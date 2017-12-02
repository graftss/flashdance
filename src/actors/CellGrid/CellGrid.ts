import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import CellGridBorder from './CellGridBorder';
import Game from '../..';
import GridPathLayer from './GridPathLayer';
import { shiftAnchor } from '../../utils';

export default class CellGrid extends Phaser.Group {
  private cells: Cell[][] = [];
  private border: CellGridBorder;

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
    private rows: number,
    private cols: number,
  ) {
    super(game);

    shiftAnchor(this, w / 2, h / 2);
    this.initCells();
    this.initBorder();
  }

  private initCells() {
    const { cols, rows, w, h, game } = this;
    const wCell = w / cols;
    const hCell = h / rows;

    let x = 0;
    for (let col = 0; col < cols; col++) {
      this.cells[col] = [];
      let y = 0;
      for (let row = 0; row < rows; row++) {
        this.cells[col][row] = new Cell(game, this, x, y, wCell, hCell, col, row);
        y += hCell;
      }

      x += wCell;
    }
  }

  public cellContainingPoint(x: number, y: number): Maybe<Cell> {
    const { cells, cols, rows } = this;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const cell = this.getCell(col, row);

        if (cell.containsPoint(x, y)) {
          return cell;
        }
      }
    }

    return null;
  }

  public flashCell(opts: FlashOpts): GameAction {
    const { cell: { col, row }, duration } = opts;

    return {
      duration,
      tween: this.getCell(row, col).flash(opts),
    };
  }

  public fakeFlashCell(opts: FlashOpts): GameAction {
    const { cell: { col, row }, duration } = opts;

    return {
      duration,
      tween: this.getCell(row, col).fakeFlash(opts),
    };
  }

  public path(opts: PathOpts): GameAction {
    const { cells, duration } = opts;

    const positions = cells
      .map(this.getCellByGridPos)
      .map(cell => cell.position)

    return {
      duration,
      tween: this.getCellByGridPos(cells[0]).path(positions, duration),
    };
  }

  public rotate(opts: RotateOpts): GameAction {
    const { rotation, duration } = opts;

    return {
      duration,
      tween: this.game.tweener.rotation(this, rotation, duration),
    };
  }

  public reflect(opts: ReflectOpts): GameAction {
    const { duration, reflectX, reflectY } = opts;

    const targetScale = {
      x: this.scale.x * (reflectX ? -1 : 1),
      y: this.scale.y * (reflectY ? -1 : 1),
    };

    return {
      duration,
      tween: this.game.tweener.scale(this, targetScale, duration),
    };
  }

  private initBorder() {
    this.border = new CellGridBorder(this.game, this, 0, 0, this.w, this.h);
  }

  private getCell(row: number, col: number) {
    return this.cells[col][row];
  }

  private getCellByGridPos = ({ col, row }: GridPos) => {
    return this.getCell(row, col);
  }
}

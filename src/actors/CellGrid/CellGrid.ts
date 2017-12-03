import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import CellGridBorder from './CellGridBorder';
import FlashLayer from './FlashLayer';
import Game from '../..';
import GridPathLayer from './GridPathLayer';
import TrailManager from './TrailManager';
import { shiftAnchor, vec2 } from '../../utils';

export default class CellGrid extends Phaser.Group {
  private cells: Cell[][] = [];
  private border: CellGridBorder;
  private flashLayer: FlashLayer;
  private trailManager: TrailManager;

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public rows: number,
    public cols: number,
  ) {
    super(game);

    this.trailManager = new TrailManager(game);

    shiftAnchor(this, w / 2, h / 2);
    this.initCells();
    this.initBorder();
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
    const { origin, duration } = opts;
    const originCell = this.getCellByGridPos(origin);

    return this.flashLayer.flashTween(originCell, duration);
  }

  public fakeFlashCell(opts: FlashOpts): GameAction {
    const { origin, duration } = opts;
    const originCell = this.getCellByGridPos(origin);

    return this.flashLayer.fakeFlashTween(originCell, duration);
  }

  public path(opts: PathOpts): GameAction {
    const { origin, path, duration } = opts;

    const originCell = this.getCellByGridPos(origin);
    const pathPositions = path.map(this.pathPositionMap(originCell));

    return this.flashLayer.pathTween(originCell, pathPositions, duration);
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

    this.flashLayer = new FlashLayer(this.game, this, wCell, hCell, { color: 0x0000ff });
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

  private pathPositionMap = (originCell: Cell) => {
    return (gridPos: GridPos) => {
      const cell = this.getCellByGridPos(gridPos);
      return vec2.minus(cell.position, originCell.position);
    };
  }
}

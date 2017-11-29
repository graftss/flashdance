import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import CellGridBorder from './CellGridBorder';
import Game from '../..';
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

  initCells() {
    const { cols, rows, w, h, game } = this;
    const wCell = w / cols;
    const hCell = h / rows;

    let x = 0;
    for (let i = 0; i < cols; i++) {
      this.cells[i] = [];
      let y = 0;
      for (let j = 0; j < rows; j++) {
        const cell = new Cell(game, this, x, y, wCell, hCell);
        this.cells[i][j] = cell;
        y += hCell;
      }

      x += wCell;
    }
  }

  initBorder() {
    this.border = new CellGridBorder(this.game, this, 0, 0, this.w, this.h);
  }

  getCell(row: number, col: number) {
    return this.cells[col][row];
  }

  flashCell(opts: FlashOpts): GameAction {
    const { row, col, duration } = opts;

    return {
      duration: duration,
      tween: this.getCell(row, col).flash(opts),
    };
  }

  rotate(opts: RotateOpts) {
    const { rotation, duration } = opts;

    return {
      duration,
      tween: this.game.tweener.rotation(this, rotation, duration),
    };
  }
}

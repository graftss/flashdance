import * as Phaser from 'phaser-ce';

import Flashdance from '.';

import Cell from './Cell';
import CellGroupBorder from './CellGroupBorder';
import { shiftAnchor } from './utils';

export default class CellGroup extends Phaser.Group {
  private cells: Cell[][] = [];
  private border: CellGroupBorder;

  constructor(
    public game: Flashdance,
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
    this.border = new CellGroupBorder(this.game, this, 0, 0, this.w, this.h);
  }

  getCell(row: number, col: number) {
    return this.cells[col][row];
  }

  flashCell(opts: FlashOpts): GameAction {
    return {
      tween: this.getCell(opts.row, opts.col).flash(opts),
    };
  }

  rotate(opts: RotateOpts) {
    const { rotation, duration } = opts;
    const tween = this.game.tweener.rotation(this, rotation, duration);

    return {
      tween,
    };
  }
}

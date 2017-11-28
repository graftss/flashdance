import * as Phaser from 'phaser-ce';

import Flashdance from '.';

import Cell from './Cell';
import CellGroupBorder from './CellGroupBorder';

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

  flashCell(row: number, col: number, opts: FlashOpts): Phaser.Tween {
    return this.getCell(row, col).flash(opts);
  }

  flashCells(): Phaser.Tween {
    const coords = [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 2, y: 0 },
    ];

    const opts = { speed: 200 };

    const tweens = coords.map(({ x, y }) => this.cells[x][y].flash(opts));

    return this.game.tweener.chain(tweens);
  }
}

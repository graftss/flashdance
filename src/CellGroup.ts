import * as Phaser from 'phaser-ce';

import Cell from './Cell';

export default class CellGroup extends Phaser.Group {
  private cells: Cell[][] = [];

  constructor(
    public game: Phaser.Game,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
    private rows: number,
    private cols: number,
  ) {
    super(game);

    this.createCells();
  }

  createCells() {
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

    this.cells[1][1].flash().start();
  }
}

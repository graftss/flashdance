import * as Phaser from 'phaser-ce';

import Game from '../../Game';

export default class Background extends Phaser.Group {
  private grid: number[][];

  constructor(
    game: Game,
  ) {
    super(game);
  }

  private initGrid(): void {
    const size = 30;
    this.grid = [];

    for (let i = 0; i < size; i++) {
      this.grid.push([]);
      for (let j = 0; j < size; j++) {
        this.grid[i].push(0);
      }
    }
  }

  private cellInUse(col: number, row: number): boolean {
    return !!this.grid[row][col];
  }

  private setCellUse(col: number, row: number, value: number): void {
    this.grid[row][col] = value;
  }
}

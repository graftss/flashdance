import * as Phaser from 'phaser-ce';

import Array2D from '../../Array2D';
import BackgroundLight from './BackgroundLight';
import Game from '../../Game';

export default class Background extends Phaser.Group {
  private cellSize: number = 15;
  private cellMargin: number = 3;

  private grid: Array2D<number>;
  private lightTexture: Phaser.RenderTexture;

  constructor(
    public game: Game,
  ) {
    super(game);

    this.initGrid();
    this.initLightTexture();

    this.newLight(0, 0);
    this.newLight(0, 1);
    this.newLight(0, 2);
  }

  private initGrid(): void {
    const cellCols = Math.floor(this.game.width / (this.cellSize + this.cellMargin));
    const cellRows = Math.floor(this.game.height / (this.cellSize + this.cellMargin));
    this.grid = new Array2D(cellCols, cellRows);
  }

  private initLightTexture() {
    const graphic = this.game.add.graphics(0, 0)
      .beginFill(0xffffff)
      .drawRoundedRect(0, 0, this.cellSize, this.cellSize, this.cellSize / 5)
      .endFill();

    this.lightTexture = graphic.generateTexture();

    graphic.destroy();
  }

  private cellInUse(col: number, row: number): boolean {
    return Boolean(this.grid.get(col, row));
  }

  private setCellUse(value: number, col: number, row: number): void {
    this.grid.set(value, col, row);
  }

  private newLight(col: number, row: number): void {
    const { cellMargin, cellSize, game, lightTexture } = this;
    const x = cellMargin + col * (cellMargin + cellSize);
    const y = cellMargin + row * (cellMargin + cellSize);

    const light = new BackgroundLight(game, x, y, lightTexture);
  }
}

import * as Phaser from 'phaser-ce';

import Array2D from '../../Array2D';
import BackgroundLight from './BackgroundLight';
import Game from '../../Game';
import { random } from '../../utils';

export default class Background extends Phaser.Group {
  private cellSize: number = 200;
  private cellMargin: number = 3;

  private cols: number;
  private rows: number;
  private grid: Array2D<number>;
  private lightTexture: Phaser.RenderTexture;

  constructor(
    public game: Game,
  ) {
    super(game);

    this.initGrid();
    this.initLightTexture();

    setInterval(() => this.newRandomLight(), 350);
  }

  private initGrid(): void {
    this.cols = Math.floor(this.game.width / (this.cellSize + this.cellMargin));
    this.rows = Math.floor(this.game.height / (this.cellSize + this.cellMargin));
    this.grid = new Array2D(this.cols, this.rows);
  }

  private initLightTexture() {
    const graphic = this.game.add.graphics(0, 0)
      .beginFill(0xff0000, 0.4)
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

  private newLight(col: number, row: number): BackgroundLight {
    const { cellMargin, cellSize, game, lightTexture } = this;
    const x = cellMargin + col * (cellMargin + cellSize);
    const y = cellMargin + row * (cellMargin + cellSize);

    this.setCellUse(1, col, row);

    return new BackgroundLight(game, x, y, lightTexture);
  }

  private newRandomLight(): Maybe<BackgroundLight> {
    const maxTries = 3;

    for (let n = 0; n < maxTries; n++) {
      const col = random(0, this.cols - 1);
      const row = random(0, this.rows - 1);
      if (!this.cellInUse(col, row)) {
        return this.newLight(col, row);
      }
    }

    return null;
  }
}

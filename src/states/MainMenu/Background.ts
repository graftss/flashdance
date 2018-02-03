import * as Phaser from 'phaser-ce';

import Array2D from '../../Array2D';
import FlashLayer from '../Play/CellGrid/FlashLayer';
import Game from '../../Game';
import { random } from '../../utils';

export default class Background extends Phaser.Group {
  private cellSize: number = 30;
  private cellMargin: number = 3;

  private cols: number;
  private rows: number;
  private grid: Array2D<number>;
  private runInterval;

  constructor(
    public game: Game,
  ) {
    super(game);

    this.initGrid();
    this.alpha = 0.3;
  }

  public run(speed: number): void {
    this.runInterval = setInterval(() => this.runRandomLights(3), 1000 / speed);
  }

  public stop(): void {
    clearInterval(this.runInterval);
  }

  private initGrid(): void {
    this.cols = Math.floor(this.game.width / (this.cellSize + this.cellMargin));
    this.rows = Math.floor(this.game.height / (this.cellSize + this.cellMargin));
    this.grid = new Array2D(this.cols, this.rows);
  }

  private cellInUse({ col, row }: GridPos): boolean {
    return Boolean(this.grid.get(col, row));
  }

  private setCellUse(value: number, { col, row }: GridPos): void {
    this.grid.set(value, col, row);
  }

  private newLight({ col, row }: GridPos): TweenWrapper {
    const { cellMargin, cellSize, game } = this;
    const x = cellMargin + col * (cellMargin + cellSize);
    const y = cellMargin + row * (cellMargin + cellSize);

    this.setCellUse(1, { col, row });

    const flashLayer = new FlashLayer(
      this.game,
      this,
      new Phaser.Point(x, y),
      this.cellSize,
      this.cellSize,
      false,
    );

    const { tween } = flashLayer.flashTween(300);
    tween.onComplete.add(() => this.setCellUse(0, { col, row }));

    return tween;
  }

  private newRandomLight(): Maybe<TweenWrapper> {
    const maxTries = 3;

    for (let n = 0; n < maxTries; n++) {
      const col = random(0, this.cols - 1);
      const row = random(0, this.rows - 1);
      if (!this.cellInUse({ col, row })) {
        return this.newLight({ col, row });
      }
    }

    return null;
  }

  private runLight(light: Maybe<TweenWrapper>) {
    if (light !== null) {
      light.start();
    }
  }

  private runRandomLights(count: number): void {
    for (let n = 0; n < count; n++) {
      this.runLight(this.newRandomLight());
    }
  }
}

import * as Phaser from 'phaser-ce';

import Game from '../../../Game';

export default class GridLines extends Phaser.Group {
  private graphic: Phaser.Graphics;
  private pulseInterval: any;

  private margin: number = 3;
  private thickness: number = 1;
  private pulseDuration: number = 5000;
  private lowAlpha: number = 0.25;
  private highAlpha: number = 0.35;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public w: number,
    public h: number,
    public rows: number,
    public cols: number,
  ) {
    super(game, parent);

    this.initGraphic();

    this.pulseInterval = setInterval(this.pulseLoop, this.pulseDuration);
  }

  private initGraphic() {
    const { cols, game, h, margin, rows, thickness, w } = this;
    const dx = w / cols;
    const dy = h / rows;

    this.graphic = game.add.graphics(0, 0, this)
      .beginFill(0xffffff);
    this.graphic.alpha = this.lowAlpha;

    for (let x = dx; x < w - 1; x += dx) {
      for (let row = 0; row < rows; row++) {
        this.graphic.drawRect(
          x - thickness / 2,
          margin + (row * dy),
          thickness,
          dy - (2 * margin),
        );
      }
    }

    for (let y = dy; y < h - 1; y += dy) {
      for (let col = 0; col < cols; col++) {
        this.graphic.drawRect(
          margin + (col * dx),
          y - thickness / 2,
          dx - (2 * margin),
          thickness,
        );
      }
    }
  }

  private pulse = (): TweenWrapper => {
    const { highAlpha, lowAlpha, pulseDuration } = this;
    const { alpha, chain, nothing } = this.game.tweener;

    return chain([
      alpha(this.graphic, highAlpha, pulseDuration / 2.5),
      nothing(pulseDuration / 5),
      alpha(this.graphic, lowAlpha, pulseDuration / 2.5),
    ]);
  }

  private clearPulseInterval(): void {
    clearInterval(this.pulseInterval);
  }

  private pulseLoop = (): void => {
    if (this.game) {
      this.pulse().start();
    } else {
      this.clearPulseInterval();
    }
  }
}

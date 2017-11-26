import * as Phaser from 'phaser-ce';

const flashLayerColor = 0xffffff;
const borderColor = 0xffffff;

export default class Cell extends Phaser.Group {
  private flashLayer: Phaser.Graphics;

  constructor(
    public game: Phaser.Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {
    super(game, parent);

    this.initDraw();
  }

  initDraw(): void {
    this.flashLayer = this.game.add.graphics(0, 0, this);
    this.flashLayer.alpha = 0;

    this.flashLayer.beginFill(flashLayerColor);
    this.flashLayer.drawRect(0, 0, this.w, this.h);
    this.flashLayer.endFill();
  }

  flash(): Phaser.Tween {
    return this.game.add.tween(this.flashLayer)
      .to({ alpha: 1 }, 1000);
  }
}

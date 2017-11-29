import * as Phaser from 'phaser-ce';

import Game from '../..';
import { shiftAnchor } from '../../utils';

const flashLayerColor = 0xffffff;
const borderColor = 0xffffff;

export default class Cell extends Phaser.Group {
  private flashLayer: Phaser.Graphics;
  private inputCaptureLayer: Phaser.Sprite;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {
    super(game, parent);

    this.initFlashLayer();
  }

  initFlashLayer(): void {
    this.flashLayer = this.game.add.graphics(0, 0, this);

    // hide the layer initially
    this.flashLayer.alpha = 0;
    this.flashLayer.scale.x = 0;
    this.flashLayer.scale.y = 0;

    shiftAnchor(this.flashLayer, this.w / 2, this.h / 2);

    this.flashLayer.beginFill(flashLayerColor);
    this.flashLayer.drawRect(0, 0, this.w, this.h);
    this.flashLayer.endFill();
  }

  initInputCaptureLayer(): void {
    this.inputCaptureLayer = this.game.add.sprite(0, 0, this);
  }

  flash(opts: FlashOpts): Phaser.Tween {
    const { alpha, chain, merge, scale } = this.game.tweener;
    const { duration } = opts;

    const scaleTween = chain([
      scale(this.flashLayer, 1, duration / 2),
      scale(this.flashLayer, 0, duration / 2),
    ]);

    const alphaTween = chain([
      alpha(this.flashLayer, 1, duration / 2),
      alpha(this.flashLayer, 0, duration / 2),
    ]);

    return merge([
      scaleTween,
      alphaTween,
    ]);
  }
}

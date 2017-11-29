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

    shiftAnchor(this.flashLayer, this.w / 2, this.h / 2);

    this.flashLayer.beginFill(flashLayerColor);
    this.flashLayer.drawRoundedRect(0, 0, this.w, this.h, this.w / 10);
    this.flashLayer.endFill();

    this.vanishFlashLayer();
  }

  vanishFlashLayer = (): void => {
    this.flashLayer.alpha = 0;
    // this.flashLayer.scale.x = 0;
    // this.flashLayer.scale.y = 0;
  }

  initInputCaptureLayer(): void {
    this.inputCaptureLayer = this.game.add.sprite(0, 0, this);
  }

  flash(opts: FlashOpts): TweenWrapper {
    const { alpha, chain, merge, nothing, scale } = this.game.tweener;
    const { delay, duration } = opts;

    const fadeInDuration = duration / 5;
    const growDuration = Math.max(30, duration * .04);
    const waitDuration = (delay === undefined ? duration : delay) - growDuration;

    const scaleTween = chain([
      scale(this.flashLayer, .8, growDuration).easing(Phaser.Easing.Quadratic.Out),
      nothing(waitDuration),
    ]);

    const alphaTween = chain([
      alpha(this.flashLayer, 1, fadeInDuration),
      alpha(this.flashLayer, 0, duration - fadeInDuration),
    ]);

    const result = merge([scaleTween, alphaTween]);
    result.onComplete.add(this.vanishFlashLayer);

    return result;
  }
}

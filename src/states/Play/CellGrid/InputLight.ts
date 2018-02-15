import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import Game from '../../../Game';
import { centerAnchor } from '../../../utils';

export default class InputLight extends Phaser.Group {
  private graphics: Phaser.Graphics;
  private splash: Phaser.Sprite;

  constructor(
    public game: Game,
    parent: Phaser.Group,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
    private tone: InputLightTone = 'neutral',
  ) {
    super(game, parent);

    centerAnchor(this, w, h);

    this.initBacklight();
    this.initSplash();
    this.setTone(tone);
  }

  public brighten(splash: boolean = true): Phaser.Tween {
    return this.game.tweener.alpha(this.graphics, .6, 1);
  }

  public dim(splashScale): Phaser.Tween {
    this.runSplash(splashScale);

    return this.game.tweener.alpha(this.graphics, 0, 100);
  }

  public dimAndDestroy(splashScale: number = 2): Phaser.Tween {
    const dimTween = this.dim(splashScale);
    dimTween.onComplete.add(() => this.graphics.destroy());

    return dimTween;
  }

  private runSplash(splashScale): void {
    const { alpha, merge, scale } = this.game.tweener;
    this.splash.alpha = 1;

    merge([
      scale(this.splash, splashScale, 500).easing(Phaser.Easing.Quadratic.Out),
      alpha(this.splash, 0, 500),
    ]).start();
  }

  public setTone(tone: InputLightTone): void {
    this.tone = tone;

    switch (tone) {
      case 'correct': {
        this.graphics.tint = 0x3cb371;
        this.splash.tint = 0x3cb371;
        break;
      }

      case 'incorrect': {
        this.graphics.tint = 0xff80c0;
        this.splash.tint = 0xff80c0;
        break;
      }

      case 'neutral': {
        this.graphics.tint = 0x80c0ff;
        this.splash.tint = 0x80c0ff;
        break;
      }
    }
  }

  private initBacklight(): void {
    this.graphics = this.game.add.graphics(0, 0, this);
    centerAnchor(this.graphics, this.w, this.h);
    this.graphics.alpha = 0;

    this.graphics
      .beginFill(0xffffff, 0.6)
      .lineStyle(2, 0xffffff, 1)
      .drawRoundedRect(0, 0, this.w, this.h, this.w / 25);
  }

  private initSplash(): void {
    const texture = this.graphics.generateTexture();

    this.splash = this.game.add.sprite(0, 0, texture, null, this);
    centerAnchor(this.splash, this.w, this.h);
    this.splash.alpha = 0;
  }
}

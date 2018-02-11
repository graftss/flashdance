import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import Game from '../../../Game';
import { centerAnchor } from '../../../utils';

export default class InputLight extends Phaser.Group {
  private graphics: Phaser.Graphics;

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

    this.graphics = this.game.add.graphics(0, 0, this);

    centerAnchor(this, w, h);
    centerAnchor(this.graphics, w, h);

    this.initBacklight();
    this.setTone(tone);
  }

  public brighten(): Phaser.Tween {
    return this.game.tweener.alpha(this.graphics, .6, 30);
  }

  public dim(): Phaser.Tween {
    return this.game.tweener.alpha(this.graphics, 0, 100);
  }

  public dimAndDestroy(): Phaser.Tween {
    const dimTween = this.dim();
    dimTween.onComplete.add(() => this.destroy());

    return dimTween;
  }

  public setTone(tone: InputLightTone): void {
    switch (tone) {
      case 'correct': {
        this.graphics.tint = 0x3cb371;
        break;
      }

      case 'incorrect': {
        this.graphics.tint = 0xff80c0;
        break;
      }

      case 'neutral': {
        this.graphics.tint = 0x80c0ff;
        break;
      }
    }
  }

  private initBacklight(): void {
    this.graphics
      .beginFill(0xffffff, 0.8)
      .lineStyle(2, 0xffffff, 1)
      .drawRoundedRect(0, 0, this.w, this.h, this.w / 25)
      .endFill();

    this.graphics.alpha = 0;
  }
}

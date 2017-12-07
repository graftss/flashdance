import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import Game from '../../../Game';
import { centerAnchor } from '../../../utils';

export default class InputLight extends Phaser.Group {
  graphics: Phaser.Graphics;

  constructor(
    public game: Game,
    parent: Phaser.Group,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
  ) {
    super(game, parent);

    this.graphics = this.game.add.graphics(0, 0, this);

    centerAnchor(this, w, h);
    centerAnchor(this.graphics, w, h);

    this.initBacklight();
  }

  public flash(): TweenWrapper {
    return this.game.tweener.chain([
      this.brighten(),
      this.dim()
    ]);
  }

  public brighten(): Phaser.Tween {
    return this.game.tweener.alpha(this.graphics, .8, 30);
  }

  public dim(): Phaser.Tween {
    return this.game.tweener.alpha(this.graphics, 0, 75);
  }

  public dimAndDestroy(): Phaser.Tween {
    const dimTween = this.dim();
    dimTween.onComplete.add(() => this.destroy());

    return dimTween;
  }

  private initBacklight(): void {
    this.graphics
      .beginFill(0x80ffc0, 1)
      .drawRoundedRect(0, 0, this.w, this.h, 5)
      .endFill()

    this.graphics.alpha = 0;
  }
}

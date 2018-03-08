import * as Phaser from 'phaser-ce';

import Game from '../Game';
import MenuTextOption from './MenuTextOption';
import { vec2 } from '../utils';

export default class SlidingLink extends Phaser.Group {
  public slideInProgress: boolean = false;
  public inFinalPosition: boolean = false;
  private slideTween: Phaser.Tween;

  constructor(
    public game: Game,
    public text: MenuTextOption,
  ) {
    super(game);

    this.hide();
  }

  public slide(
    duration: number = 500,
    slideBy: Vec2 = { x: -this.game.width, y: 0 },
    slideTo: Vec2 = this.text.position,
  ): void {
    if (this.slideInProgress || this.inFinalPosition) {
      return;
    }

    const initialPosition = vec2.minus(slideTo, slideBy);
    this.text.x = initialPosition.x;
    this.text.y = initialPosition.y;

    this.slideTween = this.game.tweener.positionBy(this.text, slideBy, duration);

    this.unhide();
    this.slideInProgress = true;
    this.inFinalPosition = false;

    this.slideTween.onComplete.add(() => {
      this.slideInProgress = false;
      this.inFinalPosition = true;
    });

    this.slideTween.start();
  }

  public hide() {
    this.text.alpha = 0;
    this.inFinalPosition = false;
  }

  public unhide() {
    this.text.alpha = 1;
  }
}

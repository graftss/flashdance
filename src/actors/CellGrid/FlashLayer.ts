import * as Phaser from 'phaser-ce';

import Game from '../..';
import { vec2, shiftAnchor } from '../../utils';

export default class FlashLayer {
  private layer: Phaser.Graphics;
  private origPos: Phaser.Point;

  constructor(
    public game: Game,
    private parent: Phaser.Group,
    private w: number,
    private h: number,
    private opts: FlashLayerOpts,
  ) {
    this.layer = game.add.graphics(0, 0, parent);

    this.center();
    this.origPos = this.layer.position.clone();

    this.drawLayer();
    this.reset();
  }

  public flashTween(duration: number): TweenWrapper {
    const { fadeInOut, game, layer, reset, ripple } = this;

    const result = game.tweener.merge([ripple(duration), fadeInOut(duration / 10, duration)]);
    result.onComplete.add(reset);

    return result;
  }

  public pathTween(positions: Array<Vec2>, duration: number) {
    const { plus, minus } = vec2;
    const { chain, merge } = this.game.tweener;

    const parentPosition = positions.shift();
    const pathPositions = positions.map(
      pos => plus(this.origPos, minus(pos, parentPosition))
    );

    const movement = chain(pathPositions.map(pos => (
      this.moveTo(pos, duration / positions.length)
    )));

    const alpha = this.fadeInOut(duration / 5, duration);

    return merge([alpha, movement]);
  }

  private drawLayer(): void {
    this.layer.beginFill(this.opts.color);
    this.layer.drawRoundedRect(0, 0, this.w, this.h, this.w / 10);
    this.layer.endFill();
  }

  private center(): void {
    shiftAnchor(this.layer, this.w / 2, this.h / 2);
  }

  private reset = (): void => {
    this.layer.alpha = 0;
    this.layer.scale.x = .7;
    this.layer.scale.y = .7;
    this.layer.position = this.origPos;
  }

  private brighten(duration: number): Phaser.Tween {
    return this.game.tweener.alpha(this.layer, 1, duration);
  }

  private dim(duration: number): Phaser.Tween {
    return this.game.tweener.alpha(this.layer, 0, duration);
  }

  private fadeInOut = (fadeDuration: number, duration: number): TweenWrapper => {
    if (fadeDuration > duration) {
      throw new Error('fadeInOut: `fadeDuration` should be shorter than `duration`');
    }

    const { chain, nothing } = this.game.tweener;

    return chain([
      this.brighten(fadeDuration / 2),
      nothing(duration - fadeDuration),
      this.dim(fadeDuration / 2),
    ]);
  }

  private ripple = (duration: number) => {
    const { game, layer } = this;
    const { scale, chain } = game.tweener;

    const growDuration = Math.max(40, duration / 3);
    const shrinkDuration =  duration - growDuration;

    return chain([
      scale(layer, .85, growDuration),
      scale(layer, .75, shrinkDuration),
    ]);
  }

  private moveTo(position: Vec2, duration: number): Phaser.Tween {
    return this.game.tweener.position(this.layer, position, duration);
  }
}

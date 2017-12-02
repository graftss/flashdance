import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import Game from '../..';
import { vec2, shiftAnchor } from '../../utils';

export default class FlashLayer {
  private layer: Phaser.Graphics;
  private origPos: Phaser.Point;

  constructor(
    public game: Game,
    private parentCell: Cell,
    private w: number,
    private h: number,
    private opts: FlashLayerOpts,
  ) {
    this.layer = game.add.graphics(0, 0, parentCell);

    this.center();
    this.origPos = this.layer.position.clone();

    this.drawLayer();
    this.reset();
  }

  public flashTween(duration: number): TweenWrapper {
    const { fadeInOut, game, layer, reset, ripple } = this;

    const result = game.tweener.merge([ripple(duration), fadeInOut(duration / 5, duration)]);
    result.onComplete.add(reset);

    return result;
  }

  public pathTween(path: Array<Vec2>, duration: number): TweenWrapper {
    const alpha = this.fadeInOut(duration / 10, duration);
    const movement = this.path(path, duration);

    return this.game.tweener.merge([alpha, movement]);
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
      this.brighten(fadeDuration / 3 * 2),
      nothing(duration - fadeDuration),
      this.dim(fadeDuration / 3),
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

  private path(path: Array<Vec2>, duration: number): TweenWrapper {
    const { plus, minus } = vec2;
    const { chain, nothing } = this.game.tweener;

    const pathStepDuration = duration / (path.length + 2);

    // the `path` positions are relative to `Cell` objects, not our
    // `layer`; to fix this, we add to each `path` position the difference
    // between our parent `Cell` and our `layer`
    const layerToCellOffset = minus(this.origPos, this.parentCell.position);
    const relativePath = path.map(p => plus(p, layerToCellOffset));

    const pathTweens = relativePath.map(pos => this.moveTo(pos, pathStepDuration));

    return chain([
      nothing(pathStepDuration),
      ...pathTweens,
      nothing(pathStepDuration),
    ]);
  }
}

import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import Game from '../..';
import { vec2, shiftAnchor } from '../../utils';

const flashColor = 0xffffff;
const fakeFlashColor = 0xff0000;

export default class FlashLayer extends Phaser.Group {
  public layer: Phaser.Graphics;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    private w: number,
    private h: number,
    private opts: FlashLayerOpts,
  ) {
    super(game, parent);

    this.layer = game.add.graphics(0, 0, this);

    this.center();

    this.reset();
  }

  public flashTween(originCell: Cell, duration: number): GameAction {
    originCell.addChild(this);
    const tween = this.flash(duration, flashColor);

    return { duration, tween };
  }

  public fakeFlashTween(originCell: Cell, duration: number): GameAction {
    originCell.addChild(this);
    const tween = this.flash(duration, fakeFlashColor);

    return { duration, tween };
  }

  public pathTween(originCell: Cell, path: Vec2[], duration: number): GameAction {
    originCell.addChild(this);

    this.drawLayer(flashColor);

    const tween = this.game.tweener.merge([
      this.path(path, duration),
      this.fadeInOut(duration, duration / 10),
      this.ripple(30),
    ]);

    tween.onComplete.add(this.reset);

    return { duration, tween };
  }

  private drawLayer(color: number): void {
    this.layer.beginFill(color);
    this.layer.drawRoundedRect(0, 0, this.w, this.h, this.w / 10);
    this.layer.endFill();
  }

  private center(): void {
    shiftAnchor(this.layer, this.w / 2, this.h / 2);
  }

  private reset = (): void => {
    this.layer.clear();
    this.layer.alpha = 0;
    this.layer.scale.x = .7;
    this.layer.scale.y = .7;
    this.position = new Phaser.Point(0, 0);
  }

  private brighten(duration: number): Phaser.Tween {
    return this.game.tweener.alpha(this.layer, 1, duration);
  }

  private dim(duration: number): Phaser.Tween {
    return this.game.tweener.alpha(this.layer, 0, duration / 5);
  }

  private fadeInOut = (duration: number, fadeDuration: number): TweenWrapper => {
    if (fadeDuration > duration) {
      throw new Error('fadeInOut: `fadeDuration` should be shorter than `duration`');
    }

    const { chain, nothing } = this.game.tweener;

    return chain([
      this.brighten(fadeDuration / 4 * 3),
      nothing(duration - fadeDuration),
      this.dim(fadeDuration / 4),
    ]);
  }

  private ripple = (duration: number) => {
    const { game, layer } = this;
    const { scale, chain } = game.tweener;

    const growDuration = Math.max(40, duration / 3);
    const shrinkDuration =  duration - growDuration;

    return chain([
      scale(layer, .8, growDuration),
      scale(layer, .76, shrinkDuration),
    ]);
  }

  private moveTo(position: Vec2, duration: number): Phaser.Tween {
    return this.game.tweener.position(this, position, duration);
  }

  private flash(duration: number, color: number): TweenWrapper {
    this.drawLayer(color);

    const result = this.game.tweener.merge([
      this.ripple(duration),
      this.fadeInOut(duration, duration / 5),
    ]);

    result.onComplete.add(this.reset);

    return result;
  }

  private path(path: Vec2[], duration: number): TweenWrapper {
    const { plus, minus } = vec2;
    const { chain, nothing } = this.game.tweener;

    const pathStepDuration = duration / (path.length + 2);

    return chain([
      nothing(pathStepDuration),
      ...path.map(pos => this.moveTo(pos, pathStepDuration)),
      nothing(pathStepDuration),
    ]);
  }
}

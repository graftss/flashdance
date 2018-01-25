import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import Game from '../../../Game';
import { vec2, shiftAnchor } from '../../../utils';

const flashColor = 0xffffff;
const fakeFlashColor = 0xff0000;

export default class FlashLayer extends Phaser.Group {
  public layer: Phaser.Graphics;
  public emitter: Phaser.Particles.Arcade.Emitter;
  public trail: Phaser.Sprite[] = [];

  private moving: boolean = false;
  private lastTrailPos: Phaser.Point = new Phaser.Point(0, 0);

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    private w: number,
    private h: number,
  ) {
    super(game, parent);

    this.layer = game.add.graphics(0, 0, this);
    this.center();
    this.layer.alpha = 0;
    this.layer.scale.x = .7;
    this.layer.scale.y = .7;

    this.destroy = this.destroy.bind(this);
  }

  public moveToCell(cell: Cell) {
    this.position.copyFrom(cell.position);
  }

  public flashTween(originCell: Cell, duration: number): GameAction {
    const tween = this.flash(duration, flashColor);
    tween.onStart.add(() => this.moveToCell(originCell));

    return { duration, tween };
  }

  public fakeFlashTween(originCell: Cell, duration: number): GameAction {
    const tween = this.flash(duration, fakeFlashColor);
    tween.onStart.add(() => this.moveToCell(originCell));

    return { duration, tween };
  }

  public pathTween(originCell: Cell, path: Vec2[], duration: number): GameAction {
    this.drawLayer(flashColor);

    const tween = this.path(path, duration);
    tween.onStart.add(() => this.moveToCell(originCell));
    tween.onComplete.add(this.destroy);

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

  private brighten(duration: number): Phaser.Tween {
    return this.game.tweener.alpha(this.layer, 1, duration);
  }

  private dim(duration: number): Phaser.Tween {
    return this.game.tweener.alpha(this.layer, 0, duration);
  }

  private fadeInOut = (duration: number, fadeDuration: number): TweenWrapper => {
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

  private ripple = (duration: number): TweenWrapper => {
    const { game, layer } = this;
    const { scale, chain } = game.tweener;

    const growDuration = Math.max(40, duration / 3);
    const shrinkDuration =  duration - growDuration;

    return chain([
      scale(layer, .8, growDuration),
      scale(layer, .78, shrinkDuration),
    ]);
  }

  private moveTo(position: Vec2, duration: number): Phaser.Tween {
    const tween = this.game.tweener.position(this, position, duration);
    tween.onStart.add(() => this.moving = true);
    tween.onComplete.add(() => this.moving = false);
    return tween;
  }

  private flash(duration: number, color: number): TweenWrapper {
    this.drawLayer(color);

    const result = this.game.tweener.merge([
      this.ripple(duration),
      this.fadeInOut(duration, duration / 5),
    ]);

    result.onComplete.add(this.destroy);

    return result;
  }

  private path(path: Vec2[], duration: number): TweenWrapper {
    const { scale, chain, nothing } = this.game.tweener;
    const { plus, minus } = vec2;
    const pathStepDuration = (duration - 400) / (path.length);

    return chain([
      this.brighten(150),
      nothing(50),
      ...path.map(pos => this.moveTo(pos, pathStepDuration)),
      nothing(50),
      this.dim(150),
    ]);
  }
}

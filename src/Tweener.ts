import * as Phaser from 'phaser-ce';

import { vec2 } from './utils';

const normalizeScale = (target: ScaleTarget): ScaleObject => (
  typeof target === 'number' ? { x: target, y: target } : target
);

export default class Tweener {
  constructor(private game: Phaser.Game) {}

  public nothing = (duration: number): Phaser.Tween => {
    return this.game.add.tween({}).to({}, duration);
  }

  public position = (
    obj: ITweenablePosition,
    to: Vec2,
    duration: number,
  ): Phaser.Tween => {
    return this.game.add.tween(obj.position).to(to, duration);
  }

  public positionBy = (
    obj: ITweenablePosition,
    delta: Vec2,
    duration: number,
  ): Phaser.Tween => {
    return this.position(obj, vec2.plus(obj.position, delta), duration);
  }

  public alpha = (
    obj: ITweenableAlpha,
    to: number,
    duration: number,
  ): Phaser.Tween => {
    return this.game.add.tween(obj).to({ alpha: to }, duration);
  }

  public rotation = (
    obj: ITweenableRotation,
    to: number,
    duration: number,
  ): Phaser.Tween => {
    return this.game.add.tween(obj).to({ rotation: obj.rotation + to }, duration);
  }

  public scale = (
    obj: ITweenableScale,
    to: ScaleTarget,
    duration: number,
  ): Phaser.Tween => {
    return this.game.add.tween(obj.scale).to(normalizeScale(to), duration);
  }

  public tint = (
    obj: ITweenableTint,
    to: number,
    duration: number,
  ): Phaser.Tween => {
    const { interpolateColor } = Phaser.Color;

    const from = obj.tint;
    const tween = this.game.add.tween({ t: 0 }).to({ t: 1 }, duration);

    tween.onUpdateCallback((_, t) => obj.tint = interpolateColor(from, to, 1, t));

    return tween;
  }

  // Note that the merged tween completes when the first tween does
  public merge = <T extends TweenWrapper>(tweens: T[]): T => {
    if (tweens.length === 0) {
      throw new Error('cannot merge zero tweens');
    }

    const [base, ...rest] = tweens;
    base.onStart.add(() => rest.forEach(t => t.start()));

    return base;
  }

  public chain = <T extends TweenWrapper>(tweens: T[]): TweenWrapper => {
    if (tweens.length === 0) {
      throw new Error('cannot chain zero tweens');
    }

    const first = tweens[0];
    const last = tweens[tweens.length - 1];

    for (let i = 0; i < tweens.length - 1; i++) {
      tweens[i].onComplete.add(() => tweens[i + 1].start());
    }

    return {
      onComplete: last.onComplete,
      onStart: first.onStart,
      start: first.start.bind(first),
    };
  }

  public waitGameAction(opts: WaitOpts): GameAction {
    const { duration } = opts;

    return {
      duration,
      tween: this.nothing(duration),
    };
  }
}

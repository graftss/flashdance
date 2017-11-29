import * as Phaser from 'phaser-ce';

const normalizeScale = (target: ScaleTarget): ScaleObject => (
  typeof target === 'number' ? { x: target, y: target } : target
);

export default class Tweener {
  constructor(private game: Phaser.Game) {}

  nothing = (duration: number): Phaser.Tween => {
    return this.game.add.tween({}).to({}, duration);
  };

  alpha = (
    obj: ITweenableAlpha,
    to: number,
    duration: number,
  ): Phaser.Tween => {
    return this.game.add.tween(obj).to({ alpha: to }, duration);
  };

  rotation = (
    obj: ITweenableRotation,
    to: number,
    duration: number,
  ): Phaser.Tween => {
    return this.game.add.tween(obj).to({ rotation: to }, duration);
  };

  scale = (
    obj: ITweenableScale,
    to: ScaleTarget,
    duration: number,
  ): Phaser.Tween => {
    return this.game.add.tween(obj.scale).to(normalizeScale(to), duration);
  };

  // Note that the merged tween completes when the first tween does
  merge = <T extends TweenWrapper>(tweens: T[]): T => {
    if (tweens.length === 0) throw new Error('cannot merge zero tweens');

    const [base, ...rest] = tweens;
    base.onStart.add(() => rest.forEach(t => t.start()));

    return base;
  };

  chain = (tweens: Phaser.Tween[]): TweenWrapper => {
    if (tweens.length === 0) throw new Error('cannot chain zero tweens');

    const first = tweens[0];
    const last = tweens[tweens.length - 1];

    first.chain(...tweens.slice(1));

    return {
      start: first.start.bind(first),
      onStart: first.onStart,
      onComplete: last.onComplete,
    };
  };
}

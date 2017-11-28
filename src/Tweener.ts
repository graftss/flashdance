import * as Phaser from 'phaser-ce';

const normalizeScale = (target: ScaleTarget): ScaleObject => (
  typeof target === 'number' ? { x: target, y: target } : target
);

export default class Tweener {
  constructor(private game: Phaser.Game) {}

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

  merge = (tweens: Phaser.Tween[]): Phaser.Tween => {
    if (tweens.length === 0) throw new Error('cannot merge zero tweens');

    const [base, ...rest] = tweens;
    base.onStart.add(() => rest.forEach(t => t.start()));

    return base;
  };

  chain = (tweens: Phaser.Tween[]): Phaser.Tween => {
    if (tweens.length === 0) throw new Error('cannot chain zero tweens');

    const starter = index => () => tweens[index].start();

    for (let i = 0; i < tweens.length - 1; i++) {
      tweens[i].onComplete.add(starter(i + 1));
    }

    return tweens[0];
  };
}

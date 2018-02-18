import * as Phaser from 'phaser-ce';

import Game from '../../../Game';
import { shiftAnchor } from '../../../utils';

export default class ProgressBar extends Phaser.Group {
  private border: Phaser.Graphics;
  private progressFill: Phaser.Graphics;
  private pulseInterval: any;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
    private minDifficulty: number,
    private maxDifficulty: number,
  ) {
    super(game, parent);

    shiftAnchor(this, w / 2, h / 2);

    this.initBorder();
    this.initProgressFill();
    this.game.eventBus().play.difficultyChanged.add(this.onDifficultyChange);

    this.onDestroy.add(this.stopPulse);
  }

  private initBorder(): void {
    const { game, h, w } = this;

    this.border = game.add.graphics(0, 0, this)
      .beginFill(0, 0)
      .lineStyle(1, 0xffffff, 1)
      .drawRoundedRect(0, 0, w, h, h / 5)
      .endFill();
  }

  private initProgressFill(): void {
    const { game, h, w } = this;

    this.progressFill = game.add.graphics(0, 0, this)
      .beginFill(0xffffff, 1)
      .drawRoundedRect(0, 0, w, h, h / 5)
      .endFill();

    this.progressFill.scale.x = 0;
  }

  private onDifficultyChange = (difficulty: number): void => {
    const { game, minDifficulty, maxDifficulty, progressFill } = this;
    const scale = {
      x: this.getScale(difficulty, minDifficulty, maxDifficulty),
      y: 1,
    };

    const tween = game.tweener.scale(progressFill, scale, 1000)
      .easing(Phaser.Easing.Elastic.Out);
    tween.start();

    const atMaxDifficulty = difficulty === maxDifficulty;
    const pulsing = Boolean(this.pulseInterval);

    if (atMaxDifficulty && !pulsing) {
      this.pulseInterval = setInterval(this.pulse, 1000);
    } else if (!atMaxDifficulty) {
      this.stopPulse();
    }
  }

  private getScale(difficulty: number, min: number, max: number): number {
    return min === max ?
      1 :
      (difficulty - min) / (max - min);
  }

  private pulse = (): void => {
    const { chain, scale } = this.game.tweener;

    chain([
      scale(this, 1.05, 100),
      scale(this, 1, 100),
    ]).start();
  }

  private stopPulse = (): void => {
    clearInterval(this.pulseInterval);
    this.pulseInterval = undefined;
  }
}

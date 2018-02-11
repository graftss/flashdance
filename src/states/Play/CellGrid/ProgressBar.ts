import * as Phaser from 'phaser-ce';

import Game from '../../../Game';

export default class ProgressBar extends Phaser.Group {
  private border: Phaser.Graphics;
  private progressFill: Phaser.Graphics;

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

    this.initBorder();
    this.initProgressFill();
    this.game.eventBus().play.difficultyChanged.add(this.onDifficultyChange);
  }

  private initBorder(): void {
    const { game, h, w } = this;

    this.border = game.add.graphics(0, 0, this)
      .beginFill(0, 0)
      .lineStyle(1, 0xffffff, 1)
      .drawRect(0, 0, w, h)
      .endFill();
  }

  private initProgressFill(): void {
    const { game, h, w } = this;

    this.progressFill = game.add.graphics(0, 0, this)
      .beginFill(0xffffff, 1)
      .drawRect(0, 0, w, h)
      .endFill();

    this.progressFill.scale.x = 0;
  }

  private onDifficultyChange = (difficulty: number): void => {
    const { game, minDifficulty, maxDifficulty, progressFill } = this;
    const scale = {
      x: (difficulty - minDifficulty) / (maxDifficulty - minDifficulty),
      y: 1,
    };

    const tween = game.tweener.scale(progressFill, scale, 1000)
      .easing(Phaser.Easing.Elastic.Out);
    tween.start();
  }
}

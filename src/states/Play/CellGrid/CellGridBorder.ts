import * as Phaser from 'phaser-ce';

import Game from '../../../Game';
import { destroy, shiftAnchor } from '../../../utils';

export default class CellGridBorder extends Phaser.Group {
  private border: Phaser.Graphics;
  private borderTween: Phaser.Tween;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
    private thickness: number,
  ) {
    super(game, parent);

    shiftAnchor(this, this.w / 2, this.h / 2);

    this.initBorder();
    this.initEventHandlers();
  }

  private initBorder(): void {
    const { game, h, thickness, w } = this;

    destroy(this.border);

    this.border = game.add.graphics(-thickness, -thickness, this)
      .lineStyle(thickness, 0xffffff)
      .drawRect(0, 0, w + 2 * thickness, h + 2 * thickness);
  }

  private pulse = (targetScale: number): void => {
    const { chain, nothing, scale } = this.game.tweener;

    chain([
      scale(this, targetScale, 300),
      scale(this, 1, 300),
    ]).start();
  }

  private startBorderTween(tween: Phaser.Tween): void {
    if (this.borderTween) {
      this.borderTween.stop();
    }

    this.borderTween = tween;
    this.borderTween.start();
  }

  private tweenBorderTint(color: number, duration: number = 400): void {
    const tween = this.game.tweener.tint(this.border, color, duration);
    this.startBorderTween(tween);
  }

  private initEventHandlers(): void {
    const eventBus = this.game.eventBus().play;

    eventBus.inputEnabled.add(this.onInputEnabled);
    eventBus.roundComplete.add(this.onRoundComplete);
    eventBus.roundFail.add(this.onRoundFail);
  }

  private onInputEnabled = (enabled: boolean): void => {
    if (enabled) {
      this.tweenBorderTint(0x00ff00);
    } else {
      this.tweenBorderTint(0xffffff);
    }
  }

  private onRoundComplete = (): void => {
    this.pulse(1.01);
  }

  private onRoundFail = (): void => {
    this.pulse(0.99);
    this.tweenBorderTint(0xff0000);
  }
}

import * as Phaser from 'phaser-ce';

import Game from '../../../Game';
import Play from '..';
import { clamp, destroy, shiftAnchor } from '../../../utils';

export default class CellGridBorder extends Phaser.Group {
  private border: Phaser.Graphics;
  private borderTween: Phaser.Tween;
  private defaultThickness: number = 3;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
  ) {
    super(game, parent);

    shiftAnchor(this, this.w / 2, this.h / 2);

    this.initBorder();
    this.initEventHandlers();
  }

  private initBorder(thickness: number = this.defaultThickness): void {
    const { game, h, w } = this;

    destroy(this.border);

    this.border = game.add.graphics(-thickness, -thickness, this)
      .lineStyle(thickness, 0xffffff)
      .drawRect(0, 0, w + 2 * thickness, h + 2 * thickness);
  }

  private pulse = (targetScale: number): void => {
    const { chain, nothing, scale } = this.game.tweener;
    const duration = 300 - 100 * targetScale;

    chain([
      scale(this, targetScale, duration),
      scale(this, 1, duration),
    ]).start();
  }

  private startBorderTween(tween: Phaser.Tween): void {
    if (this.borderTween) {
      this.borderTween.stop();
    }

    this.borderTween = tween;
    this.borderTween.start();
  }

  private tweenBorderTint(color: number, duration: number = 300): void {
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
      this.tweenBorderTint(0xffffff);
    }
  }

  private onRoundComplete = (): void => {
    const { combo } = (this.game.state.getCurrentState() as Play).getCurrentScore();
    const targetScale = Math.min(1.01 + .007 * combo, 1.08);

    this.pulse(targetScale);
    this.tweenBorderTint(0x00ff00);
  }

  private onRoundFail = (): void => {
    this.pulse(0.99);
    this.tweenBorderTint(0xff0000);
  }
}

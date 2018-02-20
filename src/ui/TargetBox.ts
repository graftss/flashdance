import * as Phaser from 'phaser-ce';

import Game from '../Game';
import SingletonTween from '../SingletonTween';
import { toTexture } from '../utils';

export default class TargetBox extends Phaser.Group {
  private box: Phaser.Graphics;
  private moveTween: SingletonTween = new SingletonTween();
  private resizeTween: SingletonTween = new SingletonTween();

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {
    super(game, parent);

    this.initBox();
  }

  public moveAndResizeTo(
    x: number,
    y: number,
    w: number,
    h: number,
    duration: number,
  ): void {
    this.moveTo(x, y, duration);
    this.resizeTo(w, h, duration);
  }

  public moveTo(x: number, y: number, duration: number): void {
    const tween = this.game.tweener.position(this, { x, y }, duration);
    this.moveTween.start(tween);
  }

  public resizeTo(w: number, h: number, duration: number): void {
    const tween = this.game.add.tween(this).to({ h, w }, duration);
    tween.onUpdateCallback(this.drawBox);
    tween.onComplete.add(this.drawBox);
    this.resizeTween.start(tween);
  }

  private initBox = (): void => {
    this.box = this.game.add.graphics(0, 0, this);
  }

  private drawBox = (): void => {
    const { w, h } = this;
    const padding = 5;
    const length = 10;

    this.box
      .clear()
      .lineStyle(1, 0xffffff, 1)
      .moveTo(-padding, h / 2)
      .lineTo(-padding - length, h / 2)
      .moveTo(w + padding, h / 2)
      .lineTo(w + padding + length, h / 2);
  }
}

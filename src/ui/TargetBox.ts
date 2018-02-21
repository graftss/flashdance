import * as Phaser from 'phaser-ce';

import Game from '../Game';
import SingletonTween from '../SingletonTween';
import { toTexture } from '../utils';

export default class TargetBox extends Phaser.Group {
  private reticule: Phaser.Graphics;
  private moveTween: SingletonTween = new SingletonTween();
  private resizeTween: SingletonTween = new SingletonTween();

  private padding: number = 5;
  private reticuleLength: number = 10;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {
    super(game, parent);

    this.initReticule();
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
    tween.onUpdateCallback(this.drawReticule);
    tween.onComplete.add(this.drawReticule);
    this.resizeTween.start(tween);
  }

  public hide() {
    this.alpha = 0;
  }

  public show() {
    this.alpha = 1;
  }

  private initReticule = (): void => {
    // offset x by 1 for ocd reasons, it just looks better
    this.reticule = this.game.add.graphics(1, 0, this);
  }

  private drawReticule = (): void => {
    const { h, padding, reticuleLength: length, w } = this;

    this.reticule
      .clear()
      .lineStyle(1, 0xffffff, 1)
      .moveTo(-padding + length, 0)
      .lineTo(-padding, 0)
      .lineTo(-padding, length)
      .moveTo(-padding, h - length)
      .lineTo(-padding, h)
      .lineTo(-padding + length, h)
      .moveTo(w + padding - length, 0)
      .lineTo(w + padding, 0)
      .lineTo(w + padding, length)
      .moveTo(w + padding - length, h)
      .lineTo(w + padding, h)
      .lineTo(w + padding, h - length)
      .beginFill(0xaaaaaa, 0.25)
      .lineStyle(0, 0, 0)
      .drawRect(-padding, 0, w + 2 * padding, h);
  }
}

import * as Phaser from 'phaser-ce';

import Game from '../Game';
import SingletonTween from '../SingletonTween';
import { toTexture } from '../utils';

export default class TargetBox extends Phaser.Group {
  private reticule: Phaser.Graphics;
  private moveTween: SingletonTween = new SingletonTween();
  private resizeTween: SingletonTween = new SingletonTween();
  private pulseTween: SingletonTween = new SingletonTween();
  private pulseOffset: number = 0;

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
    this.pulse();
  }

  public resizeTo(w: number, h: number, duration: number): void {
    const tween = this.game.add.tween(this).to({ h, w }, duration);
    this.resizeTween.start(tween);
  }

  public hide() {
    this.alpha = 0;
  }

  public show() {
    this.alpha = 1;
  }

  private pulse = (): void => {
    const duration = 500;
    const repeatDelay = 250;
    const maxPulseOffset = 2;
    const minPulseOffset = -1;

    this.pulseOffset = minPulseOffset;

    this.pulseTween.start(
      this.game.add.tween(this)
        .to({ pulseOffset: maxPulseOffset }, duration / 2)
        .to({ pulseOffset: minPulseOffset }, duration / 2)
        .delay(repeatDelay)
        .easing(Phaser.Easing.Sinusoidal.In)
        .loop(),
    );
  }

  private initReticule = (): void => {
    // offset x by 1 for ocd reasons, it just looks better
    this.reticule = this.game.add.graphics(1, 0, this);
  }

  private drawReticule = (): void => {
    const {
      h,
      padding: pad,
      pulseOffset: p,
      reticuleLength: length,
      w,
    } = this;

    this.reticule
      .clear()
      .lineStyle(2, 0xffffff, 1)
      .moveTo(-pad + length - p, -p)
      .lineTo(-pad - p, -p)
      .lineTo(-pad - p, length - p)
      .moveTo(-pad - p, h - length + p)
      .lineTo(-pad - p, h + p)
      .lineTo(-pad + length - p, h + p)
      .moveTo(w + pad - length + p, -p)
      .lineTo(w + pad + p, -p)
      .lineTo(w + pad + p, length - p)
      .moveTo(w + pad - length + p, h + p)
      .lineTo(w + pad + p, h + p)
      .lineTo(w + pad + p, h - length + p)
      .beginFill(0xaaaaaa, 0.25)
      .lineStyle(0, 0, 0)
      .drawRect(-pad - p, -p, w + 2 * pad + 2 * p, h + 2 * p);
  }

  public update() {
    this.drawReticule();
  }
}

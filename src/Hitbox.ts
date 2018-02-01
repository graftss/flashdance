import * as Phaser from 'phaser-ce';

import Game from './Game';
import { destroy } from './utils';

export default class Hitbox {
  private graphic: Phaser.Graphics;
  private border: Phaser.Graphics;
  private inputTarget: Phaser.Sprite;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    inputEnabled: boolean = false,
  ) {
    this.initGraphic();

    if (inputEnabled) {
      this.initInputTarget();
    }
  }

  public containsPoint(x: number, y: number): boolean {
    return this.graphic.getBounds().contains(x, y);
  }

  public getPosition(): Phaser.Point {
    return this.graphic.position;
  }

  public generateTexture(): Phaser.RenderTexture {
    return this.graphic.generateTexture();
  }

  public showBorder(width: number, color: number): void {
    this.initBorder(width, color);
  }

  public hideBorder(): void {
    this.border.destroy();
    this.border = undefined;
  }

  private initGraphic(): void {
    const { game, h, parent, w, x, y } = this;

    const graphic = game.add.graphics(x, y, parent);
    graphic.beginFill(0, 0);
    graphic.drawRect(0, 0, w, h);
    graphic.endFill();

    destroy(this.graphic);
    this.graphic = graphic;
  }

  private initBorder(width: number, color: number): void {
    const { game, h, parent, w, x, y } = this;

    const border = this.game.add.graphics(x, y, parent);
    border.lineStyle(width, color);
    border.drawRect(0, 0, w, h);
    border.endFill();

    destroy(this.border);
    this.border = border;
  }

  private initInputTarget(): void {
    const { parent, x, y } = this;

    const inputTarget = this.game.add.sprite(x, y, this.generateTexture(), null, parent);
    inputTarget.inputEnabled = true;

    destroy(this.inputTarget);
    this.inputTarget = inputTarget;
  }
}

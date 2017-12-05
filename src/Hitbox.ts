import * as Phaser from 'phaser-ce';

import Game from './Game';

export default class Hitbox {
  private graphic: Phaser.Graphics;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    private x: number,
    private y: number,
    private w: number,
    private h: number,
  ) {
    this.graphic = game.add.graphics(0, 0, parent);
    this.drawGraphic();
  }

  private drawGraphic(): void {
    const { graphic, x, y, w, h } = this;

    graphic.beginFill(0, 0);
    graphic.drawRect(x, y, w, h);
    graphic.endFill();
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
}

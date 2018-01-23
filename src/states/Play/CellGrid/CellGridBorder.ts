import * as Phaser from 'phaser-ce';

import Game from '../../../Game';

export default class CellGridBorder extends Phaser.Group {
  private border: Phaser.Graphics;

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

    this.initBorder();
  }

  private initBorder(): void {
    const { thickness } = this;

    if (this.border) this.border.destroy();

    this.border = this.game.add.graphics(-thickness, -thickness, this);

    this.border.lineStyle(thickness, 0xffffff);
    this.border.beginFill(0, 0);
    this.border.drawRect(0, 0, this.w + 2 * thickness, this.h + 2 * thickness);
  }

  public setThickness(thickness: number): void {
    this.thickness = thickness;

    this.initBorder();
  }
}

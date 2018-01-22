import * as Phaser from 'phaser-ce';

import Game from '../../../Game';
import RetroPlasma from '../../../filters/RetroPlasma';

export default class CellGridBorder extends Phaser.Group {
  private border: Phaser.Graphics;
  private borderFilter: Phaser.Filter;
  private thickness: number = 3;

  private filterino;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
  ) {
    super(game, parent);

    this.filterino = new RetroPlasma(game);

    this.initBorder();
  }

  private initBorder(): void {
    const { thickness } = this;

    this.border = this.game.add.graphics(-thickness, -thickness, this);

    this.border.lineStyle(this.thickness, 0xffffff);
    this.border.beginFill(0, 0);
    this.border.drawRect(0, 0, this.w + 2 * thickness, this.h + 2 * thickness);

    this.border.filters = [this.filterino];
  }

  public update() {
    this.filterino.update();
  }
}

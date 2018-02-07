import * as Phaser from 'phaser-ce';

import Game from '../../../Game';
import { destroy } from '../../../utils';

export default class CellGridBorder extends Phaser.Group {
  private border: Phaser.Graphics;
  private orientor: Phaser.Group;
  private topMarker: Phaser.Graphics;
  private bottomMarker: Phaser.Graphics;
  private showTop: boolean = true;

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
    const { game, h, thickness, w } = this;

    destroy(this.border);

    this.border = game.add.graphics(-thickness, -thickness, this)
      .lineStyle(thickness, 0xffffff)
      .drawRect(0, 0, w + 2 * thickness, h + 2 * thickness);
  }

}

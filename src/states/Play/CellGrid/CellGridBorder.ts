import * as Phaser from 'phaser-ce';

import Game from '../../../Game';
import { destroy } from '../../../utils';

const upTint = 0x00ff00;
const downTint = 0xff0000;

const totalTint = upTint + downTint;

export default class CellGridBorder extends Phaser.Group {
  private border: Phaser.Graphics;
  private orientor: Phaser.Graphics;

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
    this.initOrientor();
  }

  private initBorder(): void {
    const { game, h, thickness, w } = this;

    destroy(this.border);

    this.border = game.add.graphics(-thickness, -thickness, this)
      .lineStyle(thickness, 0xffffff)
      .drawRect(0, 0, w + 2 * thickness, h + 2 * thickness);
  }

  // The orientor shows the grid's current orientation, by showing
  // both a particular direction and the side of the grid facing up.
  private initOrientor(): void {
    const { thickness, w } = this;
    const d = 20;

    const orientor = this.game.add.graphics(w / 2, -thickness, this);
    orientor.tint = upTint;

    orientor.beginFill(0xffffff);
    orientor.drawCircle(0, 0, d);
    orientor.endFill();

    this.orientor = orientor;
  }

  public flip(): void {
    this.orientor.tint = totalTint - this.orientor.tint;
  }
}

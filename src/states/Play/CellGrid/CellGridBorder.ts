import * as Phaser from 'phaser-ce';

import Game from '../../../Game';
import { destroy } from '../../../utils';

const upTint = 0x00ff00;
const downTint = 0xff0000;

const totalTint = upTint + downTint;

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
    const ballDiameter = 30;
    const markerSize = ballDiameter / 3;
    const cx = w / 2;
    const cy = -(thickness + ballDiameter);

    this.orientor = this.game.add.group(this);

    const ball = this.game.add.graphics(cx, cy, this.orientor)
      .beginFill(0xffffff)
      .drawCircle(0, 0, ballDiameter)
      .endFill();

    this.topMarker = this.game.add.graphics(cx, cy, this.orientor)
      .beginFill(0)
      .drawRect(-markerSize, -markerSize / 3, 2 * markerSize, markerSize * 2 / 3)
      .drawRect(-markerSize / 3, -markerSize, markerSize * 2 / 3, 2 * markerSize)
      .endFill();

    this.bottomMarker = this.game.add.graphics(cx, cy, this.orientor)
      .beginFill(0)
      .drawRect(-markerSize, -markerSize / 3, 2 * markerSize, markerSize * 2 / 3)
      .endFill();
  }

  public flip(): void {
    this.showTop = !this.showTop;

    if (this.showTop) {
      this.topMarker.alpha = 1;
      this.bottomMarker.alpha = 0;
    } else {
      this.topMarker.alpha = 0;
      this.bottomMarker.alpha = 1;
    }
  }
}

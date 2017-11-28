import * as Phaser from 'phaser-ce';

import Flashdance from '.';

export default class CellGroupBorder extends Phaser.Group {
  border: Phaser.Graphics;

  constructor(
    public game: Flashdance,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
  ) {
    super(game);

    this.initBorder();
  }

  initBorder() {
    this.border = this.game.add.graphics(0, 0, this);

    this.border.lineStyle(2, 0xffffff);
    this.border.beginFill(0, 0);
    this.border.drawRect(0, 0, this.w, this.h);
  }
}

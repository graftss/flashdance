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
  ) {
    super(game, parent);
    this.initBorder();
  }

  private initBorder() {
    this.border = this.game.add.graphics(0, 0, this);

    this.border.lineStyle(2, 0xffffff);
    this.border.beginFill(0, 0);
    this.border.drawRect(0, 0, this.w, this.h);
  }
}

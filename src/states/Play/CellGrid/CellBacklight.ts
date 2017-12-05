import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import Game from '../../../Game';

export default class CellBacklight extends Phaser.Group {
  graphics: Phaser.Graphics;

  constructor(
    public game: Game,
    private parentCell: Cell,
    private w: number,
    private h: number,
  ) {
    super(game, parentCell);
    this.graphics = this.game.add.graphics(0, 0, this);
    this.drawBacklight();
  }

  private drawBacklight() {
    this.graphics
      .beginFill(0x000099, .6)
      .drawRoundedRect(0, 0, this.w, this.h, 5)
      .endFill();
  }

  public brighten() {

  }
}

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
    this.initBacklight();
  }

  public flash(): Phaser.Tween {
    return this.brighten()
      .to({ alpha: 0 }, 600);
  }

  public brighten(): Phaser.Tween {
    return this.game.add.tween(this.graphics)
      .to({ alpha: .5}, 200);
  }

  private initBacklight(): void {
    this.graphics
      .beginFill(0xffffff, 1)
      .drawRoundedRect(0, 0, this.w, this.h, 5)
      .endFill()

    this.graphics.alpha = 0;
  }

}

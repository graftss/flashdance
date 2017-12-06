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

  public flash(): TweenWrapper {
    return this.game.tweener.chain([
      this.brighten(),
      this.dim()
    ]);
  }

  public brighten(): Phaser.Tween {
    return this.game.tweener.alpha(this.graphics, .8, 30);
  }

  public dim(): Phaser.Tween {
    return this.game.tweener.alpha(this.graphics, 0, 75);
  }

  private initBacklight(): void {
    this.graphics
      .beginFill(0x80c0ff, 1)
      .drawRoundedRect(0, 0, this.w, this.h, 5)
      .endFill()

    this.graphics.alpha = 0;
  }

}

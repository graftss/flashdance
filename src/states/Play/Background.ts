import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import { FBMClouds } from '../../filters';

export default class Background extends Phaser.Group {
  private graphic: Phaser.Graphics;
  private myFilter: Phaser.Filter;

  constructor(
    game: Game,
    public width: number,
    public height: number,
  ) {
    super(game);

    this.myFilter = new FBMClouds(game);

    this.graphic = game.add.graphics(0, 0, this);
    this.graphic.beginFill(0, 0);
    this.graphic.drawRect(0, 0, width, height);
    this.graphic.endFill();

    this.filters = [this.myFilter];
  }

  public update() {
    this.myFilter.update();
  }
}

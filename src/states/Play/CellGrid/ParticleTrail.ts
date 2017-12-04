import * as Phaser from 'phaser-ce';

import Game from '../../../Game';

const color = 0xffffff;
const width = 6;
const height = 6;

export default class TrailParticle extends Phaser.Graphics {
  constructor(
    public game: Game,
  ) {
    super(game);

    this.beginFill(color);
    this.drawRect(- width / 2, - height / 2, width, height);
    this.endFill();
  }
}

import * as Phaser from 'phaser-ce';

import Game from '../..';

export default class PathRenderer extends Phaser.Group {
  constructor(
    public game: Game,
  ) {
    super(game);
  }
}

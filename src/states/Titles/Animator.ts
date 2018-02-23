import * as Phaser from 'phaser-ce';

import Array2D from '../../Array2D';
import Game from '../../Game';
import FlashLayer from '../Play/CellGrid/FlashLayer';

export default class Animator {
  private flashLayers: Phaser.Group;

  constructor(
    public game: Game,
  ) {
    this.flashLayers = this.game.add.group();
  }

  private newFlashLayer(rect: Rect): FlashLayer {
    const { h, w, x, y } = rect;

    return new FlashLayer(this.game, this.flashLayers, new Phaser.Point(x, y), w, h);
  }
}

import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import FlashLayer from './FlashLayer';
import Game from '../..';

export default class GridPathLayer {
  private flashLayer: FlashLayer;

  constructor(
    private game: Game,
    private parentGrid: CellGrid,
    private w: number,
    private h: number,
    private opts: FlashLayerOpts,
  ) {

  }
}

import * as Phaser from 'phaser-ce';

import GameDirector from './GameDirector';
import Game from '../..';
import CellGrid from '../../actors/CellGrid';

export default class Play extends Phaser.State {
  private cellGrid: CellGrid;
  private director: GameDirector;

  public create(game: Game) {
    this.cellGrid = new CellGrid(game, 100, 100, 300, 300, 3, 3);
    this.director = new GameDirector(game, this.cellGrid);

    this.director.start();
  }
}

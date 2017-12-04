import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import GameDirector from './GameDirector';
import Game from '../../Game';
import ParticleManager from '../../ParticleManager';

export default class Play extends Phaser.State {
  private cellGrid: CellGrid;
  private director: GameDirector;
  private particleManager: ParticleManager;

  public create(game: Game) {
    this.cellGrid = new CellGrid(game, 100, 100, 300, 300, 3, 3);
    this.director = new GameDirector(game, this.cellGrid);
    this.particleManager = new ParticleManager(game);

    this.director.start();
  }
}

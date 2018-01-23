import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import Fragment from '../../Fragment';
import GameDirector from './GameDirector';
import Game from '../../Game';
import ParticleManager from '../../ParticleManager';
import { FBMClouds } from '../../filters';

export default class Play extends Phaser.State {
  public game: Game;
  private background: Fragment;
  private cellGrid: CellGrid;
  private director: GameDirector;
  private particleManager: ParticleManager;

  public create(game: Game) {
    this.initCellGrid();

    this.director = new GameDirector(game, this.cellGrid);

    this.particleManager = new ParticleManager(game);

    this.director.start();

    this.background = new Fragment(game, game.width, game.height, [new FBMClouds(game)]);
    this.world.sendToBack(this.background);
  }

  private initCellGrid(): void {
    const gridSize = 300;
    const gridX = (this.game.width - gridSize) / 2;
    const gridY = (this.game.height - gridSize) / 2;

    this.cellGrid = new CellGrid(this.game, gridX, gridY, gridSize, gridSize, 3, 3);
  }
}

import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import Fragment from '../../Fragment';
import GameDirector from './GameDirector';
import Game from '../../Game';
import { FBMClouds } from '../../filters';

export default class Play extends Phaser.State {
  public game: Game;
  private background: Fragment;
  private cellGrid: CellGrid;
  private director: GameDirector;

  public init(levelData: LevelData) {
    this.initCellGrid();

    this.director = new GameDirector(this.game, this.cellGrid);

    this.director.start();
  }

  private initCellGrid(): void {
    const { height, width } = this.game;

    const gridSize = Math.min(width, height) / 1.5;
    const gridX = (width - gridSize) / 2;
    const gridY = (height - gridSize) / 2;

    this.cellGrid = new CellGrid(this.game, gridX, gridY, gridSize, gridSize, 3, 3);
  }
}

import * as Phaser from 'phaser-ce';

import ActionSequencer from './ActionSequencer';
import CellGrid from './CellGrid';
import Fragment from '../../Fragment';
import GameDirector from './GameDirector';
import Game from '../../Game';

export default class Play extends Phaser.State {
  public game: Game;

  private gridCols: number = 3;
  private gridRows: number = 3;

  private background: Fragment;
  private cellGrid: CellGrid;
  private director: GameDirector;

  public init(levelData: LevelData) {
    this.initCellGrid();

    const actionSequencer = this.initActionSequencer(levelData);

    this.director = new GameDirector(this.game, this.cellGrid, actionSequencer);

    this.director.start();
  }

  private initCellGrid(): void {
    const { game, gridCols, gridRows } = this;
    const { height, width } = game;

    const gridSize = Math.min(width, height) / 1.5;
    const gridX = (width - gridSize) / 2;
    const gridY = (height - gridSize) / 2;

    this.cellGrid = new CellGrid(
      game,
      gridX, gridY,
      gridSize, gridSize,
      gridCols, gridRows,
    );
  }

  private initActionSequencer(levelData: LevelData): IActionSequencer {
    const { gridCols: c, gridRows: r } = this;

    switch (levelData.type) {
      case 'tutorial': return new ActionSequencer.Tutorial(c, r, levelData.level);
      case 'debug': return new ActionSequencer.Debug(c, r);

      default: return new ActionSequencer.Arcade(c, r);
    }
  }
}

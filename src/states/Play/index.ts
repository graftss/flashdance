import * as Phaser from 'phaser-ce';

import ActionSequencer from './ActionSequencer';
import CellGrid from './CellGrid';
import EventBus from '../../EventBus';
import Fragment from '../../Fragment';
import GameDirector from './GameDirector';
import Game from '../../Game';
import Unlocker from '../../Unlocker';

export default class Play extends Phaser.State {
  public game: Game;
  public eventBus: EventBus;

  private gridCols: number = 3;
  private gridRows: number = 3;

  private actionSequencer: IActionSequencer;
  private background: Fragment;
  private cellGrid: CellGrid;
  private courseData: CourseData;
  private director: GameDirector;
  private unlocker: Unlocker;

  public init(courseData: CourseData) {
    this.courseData = courseData;
    this.eventBus = new EventBus();
    this.unlocker = new Unlocker(this.game);
    this.initCellGrid();
    this.initActionSequencer();

    this.director = new GameDirector(
      this.game,
      this.cellGrid,
      this.courseData,
      this.actionSequencer,
    );
  }

  public create() {
    const fadeIn = this.cellGrid.fadeIn();

    fadeIn.onComplete.add(() => this.director.start());
    fadeIn.start();
  }

  public shutdown() {
    this.cellGrid.destroy();
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
      this.courseData.lives,
    );
  }

  private initActionSequencer(): void {
    const { courseData, gridCols: c, gridRows: r } = this;

    switch (courseData.type) {
      case 'tutorial': {
        this.actionSequencer = new ActionSequencer.Tutorial(c, r, courseData.level);
        break;
      }

      case 'debug': {
        this.actionSequencer = new ActionSequencer.Debug(c, r);
      }
    }
  }
}

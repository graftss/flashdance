import * as Phaser from 'phaser-ce';

import ActionSequencer from './ActionSequencer';
import CellGrid from './CellGrid';
import EventBus from '../../EventBus';
import Fragment from '../../Fragment';
import GameDirector from './GameDirector';
import Game from '../../Game';
import Unlocker from './Unlocker';

export default class Play extends Phaser.State {
  public game: Game;
  public eventBus: EventBus;

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
    this.initKeyboardListeners();

    this.director = new GameDirector(
      this.game,
      this.cellGrid,
      this.courseData,
      this.actionSequencer,
    );

    this.game.eventBus().play.courseComplete.add(a => console.log('hddi', a));
  }

  public create() {
    const fadeIn = this.cellGrid.fadeIn();
    fadeIn.onComplete.add(() => this.director.start());
    fadeIn.start();
  }

  public shutdown() {
    this.cellGrid.destroy();
  }

  public getCurrentScore(): CourseScore {
    return this.director.scorekeeper.getCurrentScore();
  }

  private initCellGrid(): void {
    const { game } = this;
    const { height, width } = game;

    const gridSize = Math.min(width, height) / 1.5;
    const gridX = (width - gridSize) / 2;
    const gridY = (height - gridSize) / 2;

    this.cellGrid = new CellGrid(
      game,
      gridX, gridY,
      gridSize, gridSize,
      this.courseData.gridCols, this.courseData.gridRows,
      this.courseData,
    );
  }

  private initActionSequencer(): void {
    this.actionSequencer = this.getActionSequencer(this.courseData);
  }

  private getActionSequencer(courseData: CourseData) {
    const { gridCols: c, gridRows: r, level } = courseData;

    switch (courseData.type) {
      case 'easy': return new ActionSequencer.EasyCourse(c, r, level);
      case 'hard': return new ActionSequencer.HardCourse(c, r, level);
      case 'debug': return new ActionSequencer.Debug(c, r);
    }
  }

  private initKeyboardListeners(): void {
    // escape: quit to main menu
    this.input.keyboard.addKey(27)
      .onDown.add(() => this.eventBus.play.courseQuit.dispatch(null));
  }
}

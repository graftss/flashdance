import * as Phaser from 'phaser-ce';

import InputVerifier from './InputVerifier';
import Game from '../../Game';
import CellGrid, { cellGridActionTypes } from './CellGrid';
import { clamp, includes, mapJust } from '../../utils';

export default class GameDirector {
  private inputVerifier: InputVerifier;
  private minDifficulty: number;
  private maxDifficulty: number;
  private lives: number;

  private roundActionData: GameActionData[];
  private difficulty: number = 1;

  private combo: number;
  private difficultyReached: number;
  private livesLost: number;

  constructor(
    private game: Game,
    private cellGrid: CellGrid,
    private courseData: CourseData,
    private actionSequencer: IActionSequencer,
  ) {
    this.lives = courseData.lives;
    this.inputVerifier = new InputVerifier(game);
    this.minDifficulty = courseData.minDifficulty;
    this.maxDifficulty = courseData.maxDifficulty;

    this.initEventHandlers();
  }

  public start(): void {
    this.startNextRound();
  }

  private setLives(lives: number): void {
    this.lives = lives;
    this.game.eventBus().play.livesChanged.dispatch(this.lives);
  }

  private buildAction = (actionData: GameActionData): GameAction => {
    if (includes(cellGridActionTypes, actionData.type)) {
      return this.cellGrid.buildAction(actionData);
    }

    switch (actionData.type) {
      case 'wait': return this.game.tweener.waitGameAction(actionData.opts);
    }
  }

  private startAction = (actionData: GameActionData): GameAction => {
    const action = this.buildAction(actionData);
    action.tween.start();

    return action;
  }

  private startActionEvent = (index: number): void => {
    const eventBus = this.game.eventBus().play;

    const actionData = this.roundActionData[index];
    const action = this.startAction(actionData);

    eventBus.actionStart.dispatch({ action, index });

    action.tween.onComplete.add(() => (
      eventBus.actionComplete.dispatch({ action, index })
    ));
  }

  private setDifficulty(difficulty: number): void {
    const newDifficulty = clamp(difficulty, this.minDifficulty, this.maxDifficulty);

    this.game.eventBus().play.difficultyChanged.dispatch(newDifficulty);
    this.difficulty = newDifficulty;
  }

  private startNextRound = (difficultyDelta: number = 0): void => {
    const newDifficulty = this.difficulty + difficultyDelta;

    if (newDifficulty > this.maxDifficulty) {
      setTimeout(() => this.onCourseComplete(), 100);
    } else {
      this.setDifficulty(newDifficulty);
      this.roundActionData = this.actionSequencer.randomRound(this.difficulty);
      setTimeout(() => this.startActionEvent(0), 250);

    }
  }

  private onCourseComplete = (): void => {
    const tween = this.cellGrid.completeCourseEffect();

    tween.onComplete.add(() => {
      this.game.eventBus().play.courseComplete.dispatch({
        completed: true,
        courseId: this.courseData.id,
        difficultyReached: 0,
        highestCombo: 0,
        livesLost: 0,
      });

      setTimeout(() => {
        this.game.state.start('MainMenu', false, false, { fadeIn: true });
      }, 1000);
    });

    tween.start();
  }

  private onCourseFail = (): void => {
    const tween = this.cellGrid.failCourseEffect();

    tween.onComplete.add(() => {
      this.game.eventBus().play.courseFail.dispatch(this.courseData);

      setTimeout(() => {
        this.game.state.start('MainMenu', false, false, { fadeIn: true });
      }, 1000);
    });

    tween.start();
  }

  private initEventHandlers(): void {
    const eventBus = this.game.eventBus();

    eventBus.play.actionComplete.add(this.onActionCompleteEvent);
    eventBus.play.roundComplete.add(this.onRoundComplete);
    eventBus.play.inputIncorrect.add(this.onRoundFail);
  }

  private onActionCompleteEvent = (context: GameActionContext): void => {
    const nextIndex = context.index + 1;

    if (this.roundActionData[nextIndex] !== undefined) {
      this.startActionEvent(nextIndex);
    } else {
      this.inputVerifier.startRound(this.roundActionData);
    }
  }

  private onRoundFail = (pair: InputPair): void => {
    this.setLives(this.lives - 1);

    if (this.lives <= 0) {
      this.onCourseFail();
    } else {
      this.startNextRound(-1);
    }
  }

  private onRoundComplete = (): void => {
    this.startNextRound(1);
  }
}

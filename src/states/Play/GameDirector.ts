import * as Phaser from 'phaser-ce';

import InputVerifier from './InputVerifier';
import Game from '../../Game';
import CellGrid, { cellGridActionTypes } from './CellGrid';
import { clamp, includes, mapJust } from '../../utils';

export default class GameDirector {
  private inputVerifier: InputVerifier;
  private minDifficulty: number = 1;
  private maxDifficulty: number;

  private roundActionData: GameActionData[];
  private difficulty: number = 1;

  constructor(
    private game: Game,
    private cellGrid: CellGrid,
    private courseData: CourseData,
    private actionSequencer: IActionSequencer,
  ) {
    this.inputVerifier = new InputVerifier(game);
    this.maxDifficulty = actionSequencer.maxDifficulty(courseData);

    this.initEventHandlers();
  }

  public start(): void {
    this.startNextRound();
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

  private onActionCompleteEvent = (context: GameActionContext): void => {
    const nextIndex = context.index + 1;

    if (this.roundActionData[nextIndex] !== undefined) {
      this.startActionEvent(nextIndex);
    } else {
      this.inputVerifier.startRound(this.roundActionData);
    }
  }

  private startActionEvent = (index: number): void => {
    const { gameActionStart, gameActionComplete } = this.game.eventBus();

    const actionData = this.roundActionData[index];
    const action = this.startAction(actionData);

    gameActionStart.dispatch({ action, index });

    action.tween.onComplete.add(() => gameActionComplete.dispatch({ action, index }));
  }

  private startNextRound = (difficultyDelta: number = 0): void => {
    const newDifficulty = this.difficulty + difficultyDelta;

    if (newDifficulty > this.maxDifficulty) {
      this.onCourseComplete();
    } else {
      this.difficulty = clamp(newDifficulty, this.minDifficulty, this.maxDifficulty);
      this.roundActionData = this.actionSequencer.randomRound(this.difficulty);
      this.startActionEvent(0);
    }
  }

  private onRoundFail = (pair: InputPair): void => {
    this.startNextRound(-1);
  }

  private onRoundComplete = (n: number): void => {
    this.startNextRound(1);
  }

  private onCourseComplete = (): void => {
    const fadeOut = this.game.tweener.alpha(this.cellGrid, 0, 500);

    fadeOut.onComplete.add(() => {
      this.game.eventBus().gameCourseComplete.dispatch(this.courseData);
      this.game.state.start('MainMenu', false, false, { fadeIn: true });
    });

    fadeOut.start();
  }

  private initEventHandlers(): void {
    const eventBus = this.game.eventBus();

    eventBus.gameActionComplete.add(this.onActionCompleteEvent);
    eventBus.gameRoundComplete.add(this.onRoundComplete);
    eventBus.incorrectInput.add(this.onRoundFail);
  }
}

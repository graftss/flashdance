import * as Phaser from 'phaser-ce';

import InputVerifier from './InputVerifier';
import Game from '../../Game';
import CellGrid, { cellGridActionTypes } from './CellGrid';
import { includes, mapJust } from '../../utils';

const onActionComplete = (action: GameAction, callback: () => any): void => {
  action.tween.onComplete.add(callback);
};

const startAction = (action: GameAction): void => {
  action.tween.start();
};

export default class GameDirector {
  private inputVerifier: InputVerifier;
  private maxDifficulty: number;

  private roundActionData: GameActionData[];
  private difficulty: number;

  constructor(
    private game: Game,
    private cellGrid: CellGrid,
    private courseData: CourseData,
    private actionSequencer: IActionSequencer,
  ) {
    this.inputVerifier = new InputVerifier(game);
    this.maxDifficulty = actionSequencer.maxDifficulty(courseData);

    this.game.eventBus().gameActionComplete.add(this.onActionCompleteEvent);
    this.game.eventBus().gameRoundComplete.add(this.onRoundComplete);

    (window as any).newGrid = this.cellGrid;
    console.log('director constructor', this.cellGrid.game);
  }

  public start(): void {
    this.difficulty = 1;
    this.startNextRound();
  }

  private startNextRound(): void {
    this.startRound(this.difficulty);
  }

  private startRound(difficulty: number): void {
    this.roundActionData = this.actionSequencer.randomRound(difficulty);
    this.startActionEvent(0);
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

    startAction(action);

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

    onActionComplete(action, () => gameActionComplete.dispatch({ action, index }));
  }

  private onRoundComplete = (n: number): void => {
    this.difficulty += 1;

    if (this.difficulty > this.maxDifficulty) {
      this.onCourseComplete();
    } else {
      this.startNextRound();
    }
  }

  private onCourseComplete = (): void => {
    this.game.eventBus().gameCourseComplete.dispatch(this.courseData);

    setTimeout(() => {
      this.game.state.start('MainMenu');
    }, 250);
  }
}

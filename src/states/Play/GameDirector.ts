import * as Phaser from 'phaser-ce';

import CellGrid, { cellGridActionTypes } from './CellGrid';
import Game from '../../Game';
import InputVerifier from './InputVerifier';
import Scorekeeper from './Scorekeeper';
import { clamp, includes, mapJust } from '../../utils';

export default class GameDirector {
  private inputVerifier: InputVerifier;
  private roundActionData: GameActionData[];
  private scorekeeper: Scorekeeper;

  constructor(
    private game: Game,
    private cellGrid: CellGrid,
    private courseData: CourseData,
    private actionSequencer: IActionSequencer,
  ) {
    this.scorekeeper = new Scorekeeper(game, courseData);
    this.inputVerifier = new InputVerifier(game);

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

  private startActionEvent = (index: number): void => {
    const eventBus = this.game.eventBus().play;

    const actionData = this.roundActionData[index];
    const action = this.startAction(actionData);

    eventBus.actionStart.dispatch({ action, index });

    action.tween.onComplete.add(() => (
      eventBus.actionComplete.dispatch({ action, index })
    ));
  }

  private startNextRound = (): void => {
    const { actionSequencer, scorekeeper } = this;

    if (scorekeeper.isCourseComplete()) {
      setTimeout(() => this.onCourseComplete(), 100);
    } else {
      this.roundActionData = actionSequencer.randomRound(scorekeeper.difficulty);
      setTimeout(() => this.startActionEvent(0), 250);
    }
  }

  private dispatchCourseComplete = (): void => {
    this.game.eventBus().play.courseComplete.dispatch(
      this.scorekeeper.getCourseResult(),
    );
  }

  private onCourseComplete = (): void => {
    const tween = this.cellGrid.completeCourseEffect();

    tween.onComplete.add(() => {
      this.dispatchCourseComplete();

      setTimeout(() => {
        this.game.state.start('MainMenu', false, false, { fadeIn: true });
      }, 1000);
    });

    tween.start();
  }

  private onCourseFail = (): void => {
    const tween = this.cellGrid.failCourseEffect();

    tween.onComplete.add(() => {
      this.dispatchCourseComplete();

      setTimeout(() => {
        this.game.state.start('MainMenu', false, false, { fadeIn: true });
      }, 1000);
    });

    tween.start();
  }

  private initEventHandlers(): void {
    const eventBus = this.game.eventBus();

    eventBus.play.actionComplete.add(this.onActionComplete);
    eventBus.play.roundComplete.add(this.onRoundComplete);
    eventBus.play.inputIncorrect.add(this.onRoundFail);
  }

  private onActionComplete = (context: GameActionContext): void => {
    const nextIndex = context.index + 1;

    if (this.roundActionData[nextIndex] !== undefined) {
      this.startActionEvent(nextIndex);
    } else {
      this.inputVerifier.startRound(this.roundActionData);
    }
  }

  private onRoundFail = (pair: InputPair): void => {
    this.scorekeeper.failRound();

    if (this.scorekeeper.lives <= 0) {
      this.onCourseFail();
    } else {
      this.startNextRound();
    }
  }

  private onRoundComplete = (): void => {
    this.scorekeeper.completeRound();

    this.startNextRound();
  }
}

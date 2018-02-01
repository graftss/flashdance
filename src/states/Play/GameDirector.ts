import * as Phaser from 'phaser-ce';

import ActionSequencer from './ActionSequencer';
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
  private actionSequencer: ActionSequencer;
  private roundActionData: GameActionData[];
  private inputVerifier: InputVerifier;
  private round: number;

  constructor(
    private game: Game,
    private cellGrid: CellGrid,
  ) {
    this.inputVerifier = new InputVerifier(game);
    this.actionSequencer = new ActionSequencer(cellGrid.rows, cellGrid.cols);

    this.game.eventBus.gameActionComplete.add(this.onActionCompleteEvent.bind(this));
    this.game.eventBus.gameRoundComplete.add(this.onRoundComplete.bind(this));
  }

  public start(): void {
    this.round = 1;
    this.startNextRound();
  }

  private startNextRound(): void {
    this.startRound(this.round);
  }

  private startRound(round: number): void {
    this.roundActionData = this.actionSequencer.randomRound(round);
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

  private startAction(actionData: GameActionData): GameAction {
    const action = this.buildAction(actionData);

    startAction(action);

    return action;
  }

  private onActionCompleteEvent(context: GameActionContext): void {
    const nextIndex = context.index + 1;

    if (this.roundActionData[nextIndex] !== undefined) {
      this.startActionEvent(nextIndex);
    } else {
      this.inputVerifier.startRound(this.roundActionData);
    }
  }

  private startActionEvent(index: number): void {
    const { gameActionStart, gameActionComplete } = this.game.eventBus;

    const actionData = this.roundActionData[index];
    const action = this.startAction(actionData);

    gameActionStart.dispatch({ action, index });

    onActionComplete(action, () => gameActionComplete.dispatch({ action, index }));
  }

  private onRoundComplete(n: number): void {
    this.round += 1;
    this.startNextRound();
  }
}

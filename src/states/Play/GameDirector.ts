import * as Phaser from 'phaser-ce';

import ActionSequencer from './ActionSequencer';
import InputVerifier from './InputVerifier';
import Game from '../../Game';
import CellGrid from './CellGrid';
import { mapJust } from '../../utils';

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
  }

  public start(): void {
    this.round = 1;
    this.startNextRound();
  }

  private startNextRound(): void {
    this.startRound(this.round);
  }

  private startRound(round: number): void {
    this.roundActionData = this.actionSequencer.roundActions(round);
    this.startActionEvent(0);
  }

  private buildAction = (actionData: GameActionData): GameAction => {
    switch (actionData.type) {
      case 'flash': return this.cellGrid.flashCell(actionData.opts);
      case 'fakeflash': return this.cellGrid.fakeFlashCell(actionData.opts);
      case 'path': return this.cellGrid.path(actionData.opts);
      case 'rotate': return this.cellGrid.rotate(actionData.opts);
      case 'reflect': return this.cellGrid.reflect(actionData.opts);
      case 'wait': return this.wait(actionData.opts);
    }
  }

  private wait(opts: WaitOpts): GameAction {
    const { duration } = opts;

    return {
      duration,
      tween: this.game.tweener.nothing(duration),
    };
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
}

import * as Phaser from 'phaser-ce';

import InputVerifier from './InputVerifier';
import Game from '../..';
import CellGrid from '../../actors/CellGrid';
import { mapJust } from '../../utils';

export default class GameDirector {
  private inputVerifier: InputVerifier;

  constructor(
    private game: Game,
    private cellGrid: CellGrid,
  ) {
    this.inputVerifier = new InputVerifier(game);
  }

  public startRound(actionDataList: GameActionData[]): void {
    this.runActions(actionDataList, () => {
      this.inputVerifier.startRound(actionDataList);
    });
  }

  private buildAction = (actionData: GameActionData): GameAction => {
    switch (actionData.type) {
      case 'flash': return this.cellGrid.flashCell(actionData.opts);
      case 'fakeflash': return this.cellGrid.fakeFlashCell(actionData.opts);
      case 'path': return this.wait(actionData.opts); // placeholder
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

  private startAction(action: GameAction): void {
    action.tween.start();
  }

  private onActionComplete(action: GameAction, callback: () => void) {
    action.tween.onComplete.add(callback);
  }

  private runActions(actionDataList: GameActionData[], onComplete: () => void): void {
    const [first, ...rest] = actionDataList;
    const action = this.buildAction(first);

    if (rest.length > 0) {
      this.onActionComplete(action, () => this.runActions(rest, onComplete));
    } else {
      this.onActionComplete(action, onComplete);
    }

    this.startAction(action);
  }
}

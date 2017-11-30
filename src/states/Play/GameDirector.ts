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

  private buildAction = (actionData: GameActionData): GameAction => {
    switch (actionData.type) {
      case 'flash': return this.cellGrid.flashCell(actionData.opts);
      case 'fakeflash': return this.cellGrid.fakeFlashCell(actionData.opts);
      case 'path': return this.wait(actionData.opts); // placeholder
      case 'rotate': return this.cellGrid.rotate(actionData.opts);
      case 'reflect': return this.cellGrid.reflect(actionData.opts);
      case 'wait': return this.wait(actionData.opts);
    }
  };

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

  private onActionComplete(action: GameAction, callback: Function) {
    action.tween.onComplete.add(callback);
  }

  private runActions(actionDataList: GameActionData[]): void {
    const [first, ...rest] = actionDataList;
    const action = this.buildAction(first);

    if (rest.length > 0) {
      this.onActionComplete(action, () => this.runActions(rest));
    } else {
      this.onActionComplete(action, () => console.log('actions done!!!'));
    }

    this.startAction(action);
  }

  startRound(actionDataList: GameActionData[]): void {
    this.inputVerifier.startRound(actionDataList);
    this.runActions(actionDataList);
  }
}

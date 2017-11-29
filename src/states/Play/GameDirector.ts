import * as Phaser from 'phaser-ce';

import Game from '../..';
import CellGrid from '../../actors/CellGrid';

export default class GameDirector {
  constructor(
    private game: Game,
    private cellGroup: CellGrid,
  ) {}

  buildAction = (actionData: GameActionData): GameAction => {
    switch (actionData.type) {
      case 'flash': return this.cellGroup.flashCell(actionData.opts);
      case 'rotate': return this.cellGroup.rotate(actionData.opts);
      case 'reflect': return this.cellGroup.reflect(actionData.opts);
    }
  };

  startAction(action: GameAction): void {
    action.tween.start();
  }

  onActionComplete(action: GameAction, callback: Function) {
    action.tween.onComplete.add(callback);
  }

  runAction(action: GameAction, nextActionsData: GameActionData[]) {
    this.onActionComplete(action, () => this.runActions(nextActionsData));
    this.startAction(action);
  }

  runActions(actionDataList: GameActionData[]): void {
    const [first, ...rest] = actionDataList;
    const action = this.buildAction(first);
    console.log(first)

    if (rest.length > 0) {
      this.onActionComplete(action, () => this.runActions(rest));
    }

    this.startAction(action);
  }
}

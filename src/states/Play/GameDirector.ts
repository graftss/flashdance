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

  sequenceActionData = (first: GameAction, second: GameActionData): GameAction => {
    first.tween.onStart.add(() => {
      setTimeout(() => this.startAction(this.buildAction(second)), first.duration);
    });

    return {
      duration: first.duration + second.opts.duration,
      tween: first.tween,
    };
  };

  startAction(action: GameAction): void {
    action.tween.start();
  }

  runActions(actionDataList: GameActionData[]): void {
    const [first, ...rest] = actionDataList;

    const actionSequence = rest.reduce(
      this.sequenceActionData,
      this.buildAction(first)
    );

    this.startAction(actionSequence);
  }
}

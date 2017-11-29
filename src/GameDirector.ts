import CellGroup from './CellGroup';

import Flashdance from '.';

export default class GameDirector {
  constructor(
    private game: Flashdance,
    private cellGroup: CellGroup,
  ) {}

  buildAction = (actionData: GameActionData): GameAction => {
    switch (actionData.type) {
      case 'flash': return this.cellGroup.flashCell(actionData.opts);
      case 'rotate': return this.cellGroup.rotate(actionData.opts);
    }
  };

  sequenceActions = (first: GameAction, second: GameAction): GameAction => {
    first.tween.onStart.add(() => {
      setTimeout(() => this.startAction(second), first.duration);
    });

    return {
      duration: first.duration + second.duration,
      tween: first.tween,
    };
  };

  startAction(action: GameAction): void {
    action.tween.start();
  }

  runActions(actionData: GameActionData[]): void {
    const sequence = actionData
      .map(this.buildAction)
      .reduce(this.sequenceActions);

    this.startAction(sequence);
  }
}

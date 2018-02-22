import { flatMap, intersperse, range } from '../../../utils';

import BaseActionSequencer from './Base';

export default class EasyCourseActionSequencer
  extends BaseActionSequencer implements IActionSequencer {

  constructor(
    gridCols: number,
    gridRows: number,
    private level: string,
  ) {
    super(gridCols, gridRows);
  }

  public randomRound(difficulty: number): GameActionData[] {
    const initialWait = this.wait(500);
    const waitBetweenActions = this.wait(50);
    const actions = this.waitlessRound(difficulty);

    return [initialWait, ...intersperse(waitBetweenActions, actions)];
  }

  private waitlessRound(difficulty: number): GameActionData[] {
    switch (this.level) {
      case 'long path': return;
      case 'flashy': return;
      case 'dizzy': return;
      case 'squint': return;
      case 'so fake': return;
      case 'jesus': return;
      case 'fast': return;
      case 'long path 2': return;
    }
  }
}

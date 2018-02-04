import { flatMap, range } from '../../../utils';

import BaseActionSequencer from './Base';

export default class TutorialActionSequencer
  extends BaseActionSequencer implements IActionSequencer {

  constructor(
    gridCols: number,
    gridRows: number,
    private level: TutorialLevel,
  ) {
    super(gridCols, gridRows);
  }

  public randomRound(difficulty: number): GameActionData[] {
    const initialWait = this.wait(500);
    let roundActions;

    switch (this.level) {
      case 'flash': roundActions = this.flashRound(difficulty); break;
    }

    return [initialWait, ...roundActions];
  }

  private flashRound(difficulty: number): GameActionData[] {
    const flashes = [
      1, 1, 2, 3, 4, 5, 5, 6, 6,
    ][difficulty];

    return flatMap(range(flashes), () => [
      this.flash(difficulty),
      this.wait(170),
    ]);
  }

  private fakeFlashRound(difficulty: number): GameActionData[] {
    return [];
  }
}

import { flatMap, intersperse, range } from '../../../utils';

import BaseActionSequencer from './Base';

export default class TutorialActionSequencer
  extends BaseActionSequencer implements IActionSequencer {

  constructor(
    gridCols: number,
    gridRows: number,
    private level: TutorialCourse,
  ) {
    super(gridCols, gridRows);
  }

  public randomRound(difficulty: number): GameActionData[] {
    const initialWait = this.wait(500);
    const waitBetweenActions = this.wait(50);
    const actions = this.waitlessRound(difficulty);

    return [initialWait, ...intersperse(waitBetweenActions, actions)];
  }

  public maxDifficulty(courseData: CourseData): number {
    switch (courseData.level)  {
      default: return 1;
    }
  }

  private waitlessRound(difficulty: number): GameActionData[] {
    switch (this.level) {
      case 'flash': return this.flashRound(difficulty);
      case 'fake flash': return this.fakeFlashRound(difficulty);
      case 'path': return this.pathRound(difficulty);
    }
  }

  private flashRound(difficulty: number): GameActionData[] {
    const flashes = Math.ceil(difficulty / 2);

    return flatMap(range(flashes), () => [
      this.flash(difficulty),
      this.wait(170),
    ]);
  }

  private fakeFlashRound(difficulty: number): GameActionData[] {
    const flashes = [[],
      [0, 1], [0, 1], [0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1],
      [0, 1, 0, 1, 1], [0, 1, 1, 0, 1], [1, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 1], [1, 0, 1, 0, 1, 0, 1],
    ][difficulty];

    return flashes.map(n => n ? this.flash(difficulty) : this.fakeFlash(difficulty));
  }

  private pathRound(difficulty: number): GameActionData[] {
    const pathLengths = [[],
      [3], [4], [5], [3, 3], [3, 4], [4, 4], [3, 5], [4, 5], [5, 5],
    ][difficulty];

    return pathLengths.map(this.path);
  }
}

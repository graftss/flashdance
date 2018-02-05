import { flatMap, range } from '../../../utils';

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
    let roundActions;

    switch (this.level) {
      case 'flash': roundActions = this.flashRound(difficulty); break;
    }

    return [initialWait, ...roundActions];
  }

  public maxDifficulty(courseData: CourseData): number {
    switch (courseData.level)  {
      default: return 3;
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
    return [];
  }
}

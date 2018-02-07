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
      default: return 5;
    }
  }

  private waitlessRound(difficulty: number): GameActionData[] {
    switch (this.level) {
      case 'flash': return this.flashRound(difficulty);
      case 'fake flash': return this.fakeFlashRound(difficulty);
      case 'path': return this.pathRound(difficulty);
      case 'multiflash': return this.multiflashRound(difficulty);
      case 'rotate': return this.rotateRound(difficulty);
      case 'reflect': return this.reflectRound(difficulty);
      case 'x-reflect': return this.xReflectRound(difficulty);
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
    const round = [[],
      [1, 0], [1, 0], [1, 1, 0], [1, 0, 1, 0], [1, 1, 0, 0],
      [1, 0, 1, 0, 0], [1, 0, 0, 1, 0], [0, 1, 1, 1, 0],
      [0, 1, 1, 0, 1, 1, 0], [0, 1, 0, 1, 0, 1, 0],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }

  private pathRound(difficulty: number): GameActionData[] {
    const round = [[],
      [3], [3], [3], [3, 3], [3, 3],
      [3, 3], [3, 0, 3], [0, 3, 3],
      [3, 0, 3, 0], [3, 3, 3],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }

  private multiflashRound(difficulty: number): GameActionData[] {
    const round = [[],
      [2], [0, 2], [2, 0], [2, 0, 2], [0, 2, 2],
      [2, 2, 2], [2, 2, 0, 2], [2, 0, 2, 2],
      [2, 2, 2, 2], [2, 2, 0, 2, 2],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }

  private rotateRound(difficulty: number): GameActionData[] {
    const round = [[],
      [0, 4], [0, 4], [0, 4], [0, 4, 0], [0, 4, 0],
      [0, 0, 4], [0, 0, 4], [0, 0, 4, 4], [0, 0, 4, 4],
      [0, 4, 0, 4],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }

  private reflectRound(difficulty: number): GameActionData[] {
    const round = [[],
      [0, 5], [0, 5], [0, 5], [0, 5, 0], [0, 5, 0],
      [0, 0, 5], [0, 0, 5], [0, 0, 5, 5], [0, 0, 5, 5],
      [0, 5, 0, 5],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }

  private xReflectRound(difficulty: number): GameActionData[] {
    const round = [[],
      [0, 6], [0, 6], [0, 6], [0, 6, 0], [0, 6, 0],
      [0, 0, 6], [0, 0, 6], [0, 0, 6, 6], [0, 0, 6, 6],
      [0, 6, 0, 6],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }
}

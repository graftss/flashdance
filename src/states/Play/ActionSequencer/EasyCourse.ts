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
      case 'flash': return this.flashRound(difficulty);
      case 'fake flash': return this.fakeFlashRound(difficulty);
      case 'path': return this.pathRound(difficulty);
      case 'multiflash': return this.multiflashRound(difficulty);
      case 'rotate': return this.rotateRound(difficulty);
      case 'reflect': return this.reflectRound(difficulty);
      case 'x-reflect': return this.xReflectRound(difficulty);
      case 'rotated path': return this.rotatedPathRound(difficulty);
      case 'reflected path': return this.reflectedPathRound(difficulty);
    }
  }

  private flashRound(difficulty: number): GameActionData[] {
    const round = [[],
      [0], [0, 0], [0, 0, 0], [0, 0, 0],
      [0, 0, 0, 0], [0, 0, 0, 0],
      [0, 0, 0, 0, 0], [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }

  private fakeFlashRound(difficulty: number): GameActionData[] {
    const round = [[],
      [1, 0], [7, 0], [1, 1, 0], [1, 0, 7, 0], [7, 7, 0, 0],
      [1, 0, 1, 7, 0], [1, 7, 0, 1, 7], [0, 7, 1, 1, 7],
      [7, 1, 1, 7, 7, 1, 0], [7, 1, 7, 1, 7, 1, 7],
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
      [0, 0, 6], [0, 0, 6], [0, 0, 0, 6], [0, 0, 0, 6],
      [0, 6, 0, 6],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }

  private rotatedPathRound(difficulty: number): GameActionData[] {
    const round = [[],
      [3, 4], [3, 4], [3, 4],
      [3, 4, 3], [3, 4, 3], [3, 4, 3],
      [3, 3, 4], [3, 3, 4], [3, 3, 4],
      [3, 4, 3, 4],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }

  private reflectedPathRound(difficulty: number): GameActionData[] {
    const round = [[],
      [3, 5], [3, 5], [3, 5],
      [3, 5, 3], [3, 5, 3], [3, 5, 3],
      [3, 3, 5], [3, 3, 5], [3, 3, 5],
      [3, 5, 3, 5],
    ][difficulty];

    return this.roundByCode(difficulty, round);
  }
}

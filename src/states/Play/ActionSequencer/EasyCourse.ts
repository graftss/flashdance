import { flatMap, intersperse, random, sample, range } from '../../../utils';

import BaseActionSequencer from './Base';

// functions to generate arguments for actions (other than duration).
const args = {
  multiflash: () => [2, random(2, 4)],
  reflect: () => {
    const reflectX = sample([true, false]);
    return [5, reflectX, !reflectX];
  },
  rotate: () => [4, sample([-1, -2, -3, 1, 2, 3])],
};

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
      case 'path': return this.pathRound(difficulty);
      case 'fake flash': return this.fakeFlashRound(difficulty);
      case 'multiflash': return this.multiflashRound(difficulty);
      case 'rotate': return this.rotateRound(difficulty);
      case 'reflect': return this.reflectRound(difficulty);
      case 'x-reflect': return this.xReflectRound(difficulty);
      case 'flash 2': return this.rotateReflectRound(difficulty);
      case 'path 2': return this.reflectedPathRound(difficulty);
      case 'flash 3': return this.rotateXReflectRound(difficulty);
      case 'path 3': return this.rotatedPathRound(difficulty);
      case 'flash 4': return this.rotateReflectFakeFlash(difficulty);
    }
  }

  private durationByActionCode(
    difficulty: number,
    code: number,
    ...actionArgs: any[],
  ): number {
    switch (code) {
      // flash
      case 0:
      // fake flash
      case 1:
      // flash and fake
      case 7: return Math.max(100, 300 - 15 * difficulty);

      // multiflash
      case 2: return Math.max(300, 600 - 25 * difficulty);

      // path
      case 3: return (actionArgs[0] + 2) * Math.max(100, 300 - difficulty * 10);

      // rotate
      case 4: return Math.abs(actionArgs[0]) * Math.max(300, 500 - difficulty * 10);

      // reflect
      case 5:
      // x-reflect
      case 6: return Math.max(250, 650 - difficulty * 25);
    }
  }

  private expand(difficulty: number, actionsByCode: any[]): GameActionData[] {
    const expandedActionsByCode = actionsByCode.map(data => {
      if (typeof data === 'number') {
        // `data` is an action code with no extra arguments
        return [data, this.durationByActionCode(difficulty, data)];
      } else {
        // otherwise `data` is an array comprised of an action code
        // followed by the action's extra non-duration arguments
        const [code, ...nonDurationArgs] = data;

        const duration = this.durationByActionCode(
          difficulty,
          code,
          ...nonDurationArgs,
        );

        return [code, duration, ...nonDurationArgs];
      }
    });

    return this.roundByCode(expandedActionsByCode);
  }

  private flashRound(difficulty: number): GameActionData[] {
    const roundCodes = [[],
      [0], [0, 0], [0, 0, 0], [0, 0, 0],
      [0, 0, 0, 0], [0, 0, 0, 0],
      [0, 0, 0, 0, 0], [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private fakeFlashRound(difficulty: number): GameActionData[] {
    const roundCodes = [[],
      [1, 0],
      [[7, 1], 0],
      [1, 1, 0],
      [1, 0, [7, 2], 0],
      [[7, 1], [7, 2], 0, 0],
      [1, 0, 1, [7, 3], 0],
      [1, [7, 3], 0, 1, [7, 3]],
      [0, [7, 3], 1, 1, [7, 4]],
      [[7, 4], 1, 1, [7, 2], [7, 3], 1, 0],
      [[7, 3], 1, [7, 3], 1, [7, 4], 1, [7, 4]],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private pathRound(difficulty: number): GameActionData[] {
    const roundCodes = [[],
      [[3, 2]],
      [[3, 3]],
      [[3, 4]],
      [[3, 2], [3, 2]],
      [[3, 2], [3, 3]],
      [[3, 3], [3, 3]],
      [[3, 4], [3, 3]],
      [[3, 2], [3, 2], [3, 2]],
      [[3, 2], [3, 3], [3, 3]],
      [[3, 4], [3, 2], [3, 4]],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private multiflashRound(difficulty: number): GameActionData[] {
    const { multiflash: m } = args;

    const roundCodes = [[],
      [m()],
      [0, m()],
      [m(), 0],
      [m(), 0, m()],
      [0, m(), m()],
      [m(), m(), m()],
      [m(), m(), 0, m()],
      [m(), 0, m(), m()],
      [m(), m(), m(), m()],
      [m(), m(), 0, m(), m()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private rotateRound(difficulty: number): GameActionData[] {
    const { rotate: r } = args;

    const roundCodes = [[],
      [0, r()],
      [0, r()],
      [0, r()],
      [0, r(), 0],
      [0, r(), 0],
      [0, 0, r()],
      [0, 0, r()],
      [0, 0, r(), r()],
      [0, 0, r(), r()],
      [0, r(), 0, r()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private reflectRound(difficulty: number): GameActionData[] {
    const { reflect: r } = args;

    const roundCodes = [[],
      [0, r()],
      [0, r()],
      [0, r()],
      [0, r(), 0],
      [0, r(), 0],
      [0, 0, r()],
      [0, 0, r()],
      [0, 0, r(), r()],
      [0, 0, r(), r()],
      [0, r(), 0, r()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private xReflectRound(difficulty: number): GameActionData[] {
    const roundCodes = [[],
      [0, 6],
      [0, 6],
      [0, 6],
      [0, 6, 0],
      [0, 6, 0],
      [0, 0, 6],
      [0, 0, 6],
      [0, 0, 0, 6],
      [0, 0, 0, 6],
      [0, 6, 0, 6],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private rotatedPathRound(difficulty: number): GameActionData[] {
    const { rotate: r } = args;

    const roundCodes = [[],
      [[3, 2], r()],
      [[3, 3], r()],
      [[3, 4], r()],
      [[3, 2], r(), [3, 2]],
      [[3, 3], r(), [3, 2]],
      [[3, 4], r(), [3, 3]],
      [[3, 2], [3, 2], r()],
      [[3, 2], [3, 3], r()],
      [[3, 3], [3, 4], r()],
      [[3, 2], r(), [3, 3], r()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private reflectedPathRound(difficulty: number): GameActionData[] {
    const { reflect: r } = args;

    console.log('hi');

    const roundCodes = [[],
      [[3, 2], r()],
      [[3, 3], r()],
      [[3, 4], r()],
      [[3, 2], r(), [3, 2]],
      [[3, 3], r(), [3, 2]],
      [[3, 4], r(), [3, 3]],
      [[3, 2], [3, 2], r()],
      [[3, 2], [3, 3], r()],
      [[3, 3], [3, 3], r()],
      [[3, 2], r(), [3, 2], r()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private rotateReflectRound(difficulty: number): GameActionData[] {
    const { reflect: re, rotate: ro } = args;

    const roundCodes = [[],
      [0, ro(), re()],
      [0, re(), ro()],
      [0, ro(), re(), ro()],
      [0, 0, ro(), re()],
      [0, 0, re(), ro()],
      [0, 0, ro(), re(), ro()],
      [0, ro(), 0, re()],
      [0, re(), 0, ro()],
      [0, re(), 0, ro(), re()],
      [0, re(), 0, ro(), 0, re()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private rotateXReflectRound(difficulty: number): GameActionData[] {
    const { rotate: ro } = args;

    const roundCodes = [[],
      [0, ro(), 6],
      [0, 6, ro()],
      [0, ro(), 6, ro()],
      [0, 0, ro(), 6],
      [0, 0, 6, ro()],
      [0, 0, ro(), 6, ro()],
      [0, ro(), 0, 6],
      [0, 6, 0, ro()],
      [0, 6, 0, ro(), 6],
      [0, 6, 0, ro(), 0, ro()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private rotateReflectFakeFlash(difficulty: number): GameActionData[] {
    const { reflect: re, rotate: ro } = args;

    const roundCodes = [[],
      [[7, 2], ro(), re()],
      [[7, 3], re(), ro()],
      [[7, 4], 1, re(), ro(), 0],
      [[7, 2], [7, 3], ro(), re(), [7, 2]],
      [[7, 1], [7, 2], re(), ro(), 0],
      [[7, 3], [7, 3], ro(), re(), ro()],
      [[7, 2], ro(), [7, 2], re()],
      [[7, 2], re(), [7, 3], ro()],
      [[7, 3], re(), [7, 3], ro(), re()],
      [[7, 4], re(), [7, 4], ro(), [7, 3], re()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }
}

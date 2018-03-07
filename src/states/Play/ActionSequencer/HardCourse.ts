import {
  flatMap,
  intersperse,
  random,
  range,
  sample,
} from '../../../utils';

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
      case 'long path': return this.longPathRound(difficulty);
      case 'flash 5': return this.flashyRound(difficulty);
      case 'dizzy': return this.dizzyRound(difficulty);
      case 'squint': return this.squintRound(difficulty);
      case 'so fake': return;
      case 'jesus': return;
      case 'fast': return;
      case 'long path 2': return;
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
      case 3: return (actionArgs[0] + 2) * Math.max(100, 250 - difficulty * 10);

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

  private longPathRound(difficulty: number): GameActionData[] {
    const roundCodes = [[],
      [[3, 6]],
      [[3, 7]],
      [[3, 8]],
      [[3, 9]],
      [[3, 10]],
      [[3, 6], [3, 5]],
      [[3, 7], [3, 5]],
      [[3, 8], [3, 5]],
      [[3, 9], [3, 5]],
      [[3, 10], [3, 5]],
      [[3, 6], [3, 4], [3, 4]],
      [[3, 7], [3, 4], [3, 4]],
      [[3, 8], [3, 4], [3, 4]],
      [[3, 9], [3, 4], [3, 4]],
      [[3, 10], [3, 4], [3, 4]],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private flashyRound(difficulty: number): GameActionData[] {
    const { rotate: ro, reflect: re } = args;

    const roundCodes = [[],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, ro(), 0, 0, 0],
      [0, 0, 0, re(), 0, 0, 0],
      [0, 0, 0, 0, 0, 0, ro()],
      [0, 0, 0, 0, 0, 0, re()],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, ro(), 0, 0, 0, 0],
      [0, 0, 0, re(), 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, ro()],
      [0, 0, 0, 0, 0, 0, 0, re()],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, ro(), 0, 0, 0, 0],
      [0, 0, 0, 0, re(), 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, ro()],
      [0, 0, 0, 0, 0, 0, 0, 0, re()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private dizzyRound(difficulty: number): GameActionData[] {
    const { rotate: ro } = args;

    const roundCodes = [[],
      [0, ro(), 0, ro(), 0, ro()],
      [0, ro(), 0, ro(), 0, ro()],
      [0, ro(), 0, ro(), 0, ro()],
      [0, ro(), 0, ro(), 0, ro(), 0],
      [0, ro(), 0, ro(), 0, ro(), 0],
      [0, ro(), 0, ro(), 0, ro(), 0],
      [0, ro(), 0, ro(), 0, ro(), 0, ro()],
      [0, ro(), 0, ro(), 0, ro(), 0, ro()],
      [0, ro(), 0, ro(), 0, ro(), 0, ro()],
      [0, ro(), 0, ro(), 0, ro(), 0, ro(), 0],
      [0, ro(), 0, ro(), 0, ro(), 0, ro(), 0],
      [0, ro(), 0, ro(), 0, ro(), 0, ro(), 0],
      [0, ro(), 0, ro(), 0, ro(), 0, ro(), 0, ro()],
      [0, ro(), 0, ro(), 0, ro(), 0, ro(), 0, ro()],
      [0, ro(), 0, ro(), 0, ro(), 0, ro(), 0, ro()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }

  private squintRound(difficulty: number): GameActionData[] {
    const { rotate: ro, reflect: re } = args;

    const roundCodes = [[],
      [0],
      [[3, 2]],
      [0, ro()],
      [0, ro(), re()],
      [0, 0],
      [[3, 2], 0],
      [0, 0, ro()],
      [0, 0, ro(), re()],
      [0, 0, 0],
      [[3, 2], 0, 0],
      [0, 0, 0, ro()],
      [0, 0, 0, re(), ro()],
      [0, 0, 0, 0],
      [[3, 2], 0, 0, 0],
      [0, 0, 0, 0, ro()],
    ][difficulty];

    return this.expand(difficulty, roundCodes);
  }
}

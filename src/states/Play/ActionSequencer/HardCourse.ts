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

const { rotate: ro, reflect: re } = args;

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
    return this.expand(difficulty, this.roundCodes[this.level][difficulty]);
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

  private roundCodes = {
    'long path': [[],
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
    ],

    'flash 5': [[],
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
    ],

    'dizzy': [[],
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
    ],

    'squint': [[],
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
    ],

    'so fake': [[],
      [[7, 4], [7, 4], [7, 4], [7, 4], [7, 4], [7, 4]],
      [[7, 6], [7, 6], [7, 6], [7, 6], [7, 6], [7, 6]],
      [[7, 8], [7, 8], [7, 8], [7, 8], [7, 8], [7, 8]],
      [[7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10]],
      [[7, 13], [7, 13], [7, 13], [7, 13], [7, 13], [7, 13]],
      [[7, 4], [7, 4], [7, 4], [7, 4], [7, 4], [7, 4], ro()],
      [[7, 6], [7, 6], [7, 6], [7, 6], [7, 6], [7, 6], re()],
      [[7, 8], [7, 8], [7, 8], [7, 8], [7, 8], [7, 8], ro()],
      [[7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], re()],
      [[7, 13], [7, 13], [7, 13], [7, 13], [7, 13], [7, 13], ro()],
      [[7, 4], [7, 4], [7, 4], ro(), [7, 4], [7, 4], [7, 4], ro()],
      [[7, 6], [7, 6], [7, 6], re(), [7, 6], [7, 6], [7, 6], re()],
      [[7, 8], [7, 8], [7, 8], re(), [7, 8], [7, 8], [7, 8], ro()],
      [[7, 10], [7, 10], [7, 10], ro(), [7, 10], [7, 10], [7, 10], re()],
      [[7, 13], [7, 13], [7, 13], re(), [7, 13], [7, 13], [7, 13], ro()],
    ],
  };
}

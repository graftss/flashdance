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

const { multiflash: m, reflect: re, rotate: ro } = args;

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
    ...actionArgs: any[]
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
      case 3: {
        return (actionArgs[0] + 2) * Math.max(100, 300 - difficulty * 10);
      }

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
    'flash': [[],
      [0], [0, 0], [0, 0, 0], [0, 0, 0],
      [0, 0, 0, 0], [0, 0, 0, 0],
      [0, 0, 0, 0, 0], [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0],
    ],

    'fake flash': [[],
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
    ],

    'path': [[],
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
    ],

    'multiflash': [[],
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
    ],

    'rotate': [[],
      [0, ro()],
      [0, ro()],
      [0, ro()],
      [0, ro(), 0],
      [0, ro(), 0],
      [0, 0, ro()],
      [0, 0, ro()],
      [0, 0, ro(), ro()],
      [0, 0, ro(), ro()],
      [0, ro(), 0, ro()],
    ],

    'reflect': [[],
      [0, re()],
      [0, re()],
      [0, re()],
      [0, re(), 0],
      [0, re(), 0],
      [0, 0, re()],
      [0, 0, re()],
      [0, 0, re(), re()],
      [0, 0, re(), re()],
      [0, re(), 0, re()],
    ],

    'x-reflect': [[],
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
    ],

    'flash 2': [[],
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
    ],

    'flash 3': [[],
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
    ],

    'flash 4': [[],
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
    ],

    'path 2': [[],
      [[3, 2], re()],
      [[3, 3], re()],
      [[3, 4], re()],
      [[3, 2], re(), [3, 2]],
      [[3, 3], re(), [3, 2]],
      [[3, 4], re(), [3, 3]],
      [[3, 2], [3, 2], re()],
      [[3, 2], [3, 3], re()],
      [[3, 3], [3, 3], re()],
      [[3, 2], re(), [3, 2], re()],
    ],

    'path 3': [[],
      [[3, 2], ro()],
      [[3, 3], ro()],
      [[3, 4], ro()],
      [[3, 2], ro(), [3, 2]],
      [[3, 3], ro(), [3, 2]],
      [[3, 4], ro(), [3, 3]],
      [[3, 2], [3, 2], ro()],
      [[3, 2], [3, 3], ro()],
      [[3, 3], [3, 4], ro()],
      [[3, 2], ro(), [3, 3], ro()],
    ],
  };
}

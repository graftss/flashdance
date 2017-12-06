import { cellTarget, random } from '../../utils';

const toCell = ([row, col]) => ({ row, col });

const path0 = [[0, 0], [1, 0], [2, 0]].map(toCell);
const path1 = [[1, 1], [1, 2], [2, 2], [2, 1], [2, 0], [1, 0], [0, 0]].map(toCell);

const testActions: GameActionData[] = [
  { type: 'wait', opts: { duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 1, col: 1 }, duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 2, col: 1 }, duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 2, col: 1 }, duration: 300 } },
  // { type: 'fakeflash', opts: { origin: { row: 2, col: 1 }, duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 0, col: 0 }, duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 2, col: 2 }, duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 0, col: 2 }, duration: 1000 } },
  { type: 'path', opts: { duration: 500, origin: path0[0], path: path0.slice(1) } },
  // { type: 'path', opts: { duration: 1200, origin: path1[0], path: path1.slice(1) } },
  // { type: 'flash', opts: { origin: { row: 1, col: 1 }, duration: 300 } },
  // { type: 'rotate', opts: { rotation: Math.PI * 2, duration: 400 } },
  // { type: 'reflect', opts: { reflectX: true, reflectY: false, duration: 300 } },
  // { type: 'reflect', opts: { reflectX: true, reflectY: true, duration: 500 } },
];

export default class ActionSequencer {
  constructor(
    private gridRows: number,
    private gridCols: number,
  ) {

  }

  public roundActions(difficulty: number): GameActionData[] {
    const result = [];

    for (let i = 0; i < difficulty; i++) {
      result.push(this.flash(difficulty));
    }

    return testActions;
    // return result;
  }

  private flash(difficulty: number): GameActionData {
    return {
      opts: {
        duration: 500,
        origin: this.randomGridPos(),
      },
      type: 'flash',
    };
  }

  private randomGridPos(): GridPos {
    return {
      col: random(this.gridCols - 1),
      row: random(this.gridRows - 1),
    };
  }
}

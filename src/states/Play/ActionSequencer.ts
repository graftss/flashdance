import { cellTarget, random, sample, shuffle } from '../../utils';

const toCell = ([row, col]) => ({ row, col });

const path0 = [[0, 0], [1, 0], [2, 0]].map(toCell);
const path1 = [[1, 1], [1, 2], [2, 2], [2, 1], [2, 0], [1, 0], [0, 0]].map(toCell);

const testActions: GameActionData[] = [
  { type: 'wait', opts: { duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 1, col: 1 }, duration: 300 } },
  { type: 'flash', opts: { origin: { row: 2, col: 1 }, duration: 300 } },
  { type: 'flash', opts: { origin: { row: 2, col: 1 }, duration: 300 } },
  { type: 'fakeflash', opts: { origin: { row: 2, col: 1 }, duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 0, col: 0 }, duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 2, col: 2 }, duration: 300 } },
  // { type: 'flash', opts: { origin: { row: 0, col: 2 }, duration: 1000 } },
  { type: 'path', opts: { duration: 500, origin: path0[0], path: path0.slice(1) } },
  { type: 'path', opts: { duration: 1200, origin: path1[0], path: path1.slice(1) } },
  // { type: 'flash', opts: { origin: { row: 1, col: 1 }, duration: 300 } },
  // { type: 'rotate', opts: { rotation: Math.PI * 2, duration: 400 } },
  // { type: 'reflect', opts: { reflectX: true, reflectY: false, duration: 300 } },
  // { type: 'reflect', opts: { reflectX: true, reflectY: true, duration: 500 } },
];

export default class ActionSequencer {
  constructor(
    private gridRows: number,
    private gridCols: number,
  ) {}

  public randomRound(difficulty: number): GameActionData[] {
    const flashes = Math.ceil(difficulty / 3) - 1;
    const obstacles = Math.floor(difficulty / 4);

    const actions = [];

    for (let i = 0; i < flashes - 1; i++) {
      if (difficulty < 6) {
        actions.push(this.randomFlash());
      } else {
        actions.push(
          Math.random() < .3 ? this.randomPath(difficulty) : this.randomFlash()
        );
      }
    }

    for (let i = 0; i < obstacles; i++) {
      actions.push(this.randomObstacle());
    }

    return [
      { type: 'wait', opts: { duration: 300 } },
      this.randomFlash(),
      ...shuffle(actions),
    ];
  }

  private randomFlash(): GameActionData {
    return {
      opts: {
        duration: 500,
        origin: this.randomGridPos(),
      },
      type: 'flash',
    };
  }

  private randomPath(difficulty: number): GameActionData {
    return {
      opts: {
        duration: 500,
        origin: path0[0],
        path: path0.slice(1),
      },
      type: 'path',
    };
  }

  private randomGridPos(): GridPos {
    return {
      col: random(this.gridCols - 1),
      row: random(this.gridRows - 1),
    };
  }

  private randomObstacle(): GameActionData {
    const typeId = sample([0, 1, 2]);

    switch (typeId) {
      case 0: return this.randomRotate();
      case 1: return this.randomSingleReflect();
      case 2: return this.randomFakeFlash();
    }
  }

  private randomRotate(): GameActionData {
    const duration = 400;
    const rotation = sample([-3, -2, -1, 1, 2, 3]) * Math.PI / 2;

    return {
      type: 'rotate',
      opts: {
        duration,
        rotation,
      },
    };
  }

  private randomSingleReflect(): GameActionData {
    const duration = 400;
    const reflectX = sample([true, false]);

    return {
      type: 'reflect',
      opts: {
        duration,
        reflectX,
        reflectY: !reflectX,
      },
    };
  }

  private randomFakeFlash(): GameActionData {
    const duration = 400;
    const origin = this.randomGridPos();

    return {
      type: 'fakeflash',
      opts: {
        duration,
        origin,
      },
    };
  }
}

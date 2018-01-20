import { cellTarget, intersperse, random, sample, shuffle } from '../../utils';

const toCell = ([row, col]) => ({ row, col });

const path0 = [[0, 0], [1, 0], [2, 0]].map(toCell);
const path1 = [[1, 1], [1, 2], [2, 2], [2, 1], [2, 0], [1, 0], [0, 0]].map(toCell);

const waitAction = duration => ({ type: 'wait', opts: { duration }});

export default class ActionSequencer {
  constructor(
    private gridRows: number,
    private gridCols: number,
  ) {}

  public randomRound(difficulty: number): GameActionData[] {
    const flashes = Math.ceil(difficulty / 3) - 1;
    const obstacles = Math.floor(difficulty / 4);

    const raw = [];

    for (let i = 0; i < flashes - 1; i++) {
      if (difficulty < 6) {
        raw.push(this.randomFlash());
      } else {
        raw.push(
          Math.random() < .3 ? this.randomPath(difficulty) : this.randomFlash()
        );
      }
    }

    for (let i = 0; i < obstacles; i++) {
      raw.push(this.randomObstacle());
    }

    const shuffled = [
      { type: 'wait', opts: { duration: 300 } },
      this.randomFlash(),
      ...shuffle(raw),
    ];

    return intersperse(shuffled, waitAction(150));
  }

  private randomFlash(): GameActionData {
    return {
      opts: {
        duration: 300,
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
    const turns = sample([-3, -2, -1, 1, 2, 3]);
    const duration = Math.abs(turns * 400);
    const rotation = turns * Math.PI / 2;

    console.log({ rotation, turns, duration });

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

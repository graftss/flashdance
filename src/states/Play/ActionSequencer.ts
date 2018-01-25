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
      opts: {
        duration,
        rotation,
      },
      type: 'rotate',
    };
  }

  private randomSingleReflect(): GameActionData {
    const duration = 1000;
    const reflectX = sample([true, false]);

    return {
      opts: {
        duration,
        reflectX,
        reflectY: !reflectX,
      },
      type: 'reflect',
    };
  }

  private randomFakeFlash(): GameActionData {
    const duration = 400;
    const origin = this.randomGridPos();

    return {
      opts: {
        duration,
        origin,
      },
      type: 'fakeflash',
    };
  }

  private wait(duration: number): GameActionData {
    return {
      opts: { duration },
      type: 'wait',
    };
  }

  private debug_rotate(): GameActionData[] {
    return [
      this.wait(300),
      this.randomFlash(),
      this.randomRotate(),
    ];
  }

  private debug_reflect(): GameActionData[] {
    return [
      this.wait(300),
      this.randomFlash(),
      this.randomSingleReflect(),
    ];
  }

  private debug_input_lights(): GameActionData[] {
    return [
      this.wait(300),
      this.randomFlash(),
      this.randomPath(5),
    ];
  }

  private debug_particle_trail(): GameActionData[] {
    return [
      this.randomPath(5),
      {
        type: 'rotate',
        opts: {
          duration: 300,
          rotation: Math.PI * 3 / 2,
        },
      },
      // this.randomSingleReflect(),
      {
        type: 'path',
        opts: {
          origin: path1[0],
          path: path1.slice(1),
          duration: 3000,
        },
      },
    ];
  }
}

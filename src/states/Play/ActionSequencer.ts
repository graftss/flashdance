import {
  adjacentGridPos,
  cellTarget,
  intersperse,
  random,
  sample,
  shuffle,
} from '../../utils';

const toCell = ([row, col]) => ({ row, col });
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
      raw.push(this.randomInputAction(difficulty));
    }

    for (let i = 0; i < obstacles; i++) {
      raw.push(this.randomObstacle(difficulty));
    }

    const shuffled = [
      { type: 'wait', opts: { duration: 300 } },
      this.randomFlash(),
      ...shuffle(raw),
    ];

    return this.debug_path();
    // return intersperse(shuffled, waitAction(150));
  }

  private randomInputAction(difficulty: number): GameActionData {
    if (difficulty < 6) {
      return this.randomFlash();
    } else {
      const rand = Math.random();

      if (rand < 0.5) {
        return this.randomFlash();
      } else if (rand < 0.75) {
        return this.randomPath(difficulty);
      } else {
        return this.randomMultiflash();
      }
    }
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

  private randomMultiflash(): GameActionData {
    return {
      opts: {
        count: random(2, 4),
        duration: 600,
        origin: this.randomGridPos(),
      },
      type: 'multiflash',
    };
  }

  private randomPath(difficulty: number): GameActionData {
    const origin = this.randomGridPos();
    const path = [origin];
    const pathLength = 4; // should scale with difficulty

    for (let n = 0; n < pathLength; n++) {
      let adjacents = adjacentGridPos(this.gridCols, this.gridRows, path[path.length - 1]);

      // stop the path from doubling back on itself for now
      // this could be difficulty related or otherwise possible
      if (path.length >= 2) {
        const { col, row } = path[path.length - 2];
        adjacents = adjacents.filter(p => p.col !== col || p.row !== row);
      }

      path.push(sample(adjacents));
    }

    // remove the origin from the path
    path.shift();
    console.log('hey', origin, path);

    return {
      opts: {
        duration: path.length * 250,
        origin,
        path,
      },
      type: 'path',
    };
  }

  private randomObstacle(difficulty: number): GameActionData {
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

  private randomGridPos(): GridPos {
    return {
      col: random(this.gridCols - 1),
      row: random(this.gridRows - 1),
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
      this.randomSingleReflect(),
      this.randomSingleReflect(),
      this.randomRotate(),
    ];
  }

  private debug_input_lights(): GameActionData[] {
    return [
      this.wait(300),
      this.randomFlash(),
      this.randomPath(5),
    ];
  }

  private debug_path(): GameActionData[] {
    return [
      this.wait(500),
      this.randomPath(5),
      // this.randomSingleReflect(),
      this.randomPath(5),
    ];
  }

  private debug_multiflash(): GameActionData[] {
    return [
      this.wait(300),
      this.randomMultiflash(),
    ];
  }
}

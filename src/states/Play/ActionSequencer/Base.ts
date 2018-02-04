import {
  adjacentGridPos,
  random,
  randomGridPos,
  sample,
} from '../../../utils';

export default class BaseActionSequencer {
  constructor(
    protected gridCols: number,
    protected gridRows: number,
  ) {}

  protected randomInputAction(difficulty: number = 0): GameActionData {
    if (difficulty < 6) {
      return this.randomFlash(difficulty);
    } else {
      const rand = Math.random();

      if (rand < 0.5) {
        return this.randomFlash(difficulty);
      } else if (rand < 0.75) {
        return this.randomPath(difficulty);
      } else {
        return this.randomMultiflash(difficulty);
      }
    }
  }

  protected randomFlash(difficulty: number = 0): GameActionData {
    const duration = Math.max(100, 300 - 10 * difficulty);

    return {
      opts: {
        duration,
        origin: this.randomGridPos(),
      },
      type: 'flash',
    };
  }

  protected randomMultiflash(difficulty: number = 0): GameActionData {
    const duration = Math.max(300, 600 - 10 * difficulty);

    return {
      opts: {
        count: random(2, 4),
        duration,
        origin: this.randomGridPos(),
      },
      type: 'multiflash',
    };
  }

  protected randomPath(difficulty: number): GameActionData {
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

    return {
      opts: {
        duration: path.length * 250,
        path,
      },
      type: 'path',
    };
  }

  protected randomObstacle(difficulty: number = 0): GameActionData {
    const typeId = sample([0, 1, 2]);

    switch (typeId) {
      case 0: return this.randomRotate(difficulty);
      case 1: return this.randomSingleReflect(difficulty);
      case 2: return this.randomFakeFlash(difficulty);
    }
  }

  protected randomRotate(difficulty: number = 0): GameActionData {
    const durationPerTurn = Math.max(200, 400 - difficulty * 10);

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

  protected randomSingleReflect(difficulty: number = 0): GameActionData {
    const duration = Math.max(250, 750 - difficulty * 15);

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

  protected randomFakeFlash(difficulty: number = 0): GameActionData {
    const duration = Math.max(200, 400 - difficulty * 20);

    return {
      opts: {
        duration,
        origin: this.randomGridPos(),
      },
      type: 'fakeflash',
    };
  }

  protected wait(duration: number): GameActionData {
    return {
      opts: { duration },
      type: 'wait',
    };
  }

  protected randomGridPos(): GridPos {
    return randomGridPos(this.gridCols, this.gridRows);
  }
}

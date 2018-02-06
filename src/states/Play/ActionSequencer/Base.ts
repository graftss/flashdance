import {
  adjacentGridPos,
  clamp,
  random,
  randomGridPos,
  sample,
} from '../../../utils';

export default class BaseActionSequencer {
  constructor(
    protected gridCols: number,
    protected gridRows: number,
  ) {}

  protected input = (difficulty: number = 0): GameActionData => {
    if (difficulty < 6) {
      return this.flash(difficulty);
    } else {
      const rand = Math.random();

      if (rand < 0.5) {
        return this.flash(difficulty);
      } else if (rand < 0.75) {
        return this.path(difficulty);
      } else {
        return this.multiflash(difficulty);
      }
    }
  }

  protected roundByCode = (difficulty: number, codes: number[]): GameActionData[] => {
    return codes.map(code => this.actionCodeMap(difficulty, code));
  }

  protected actionCodeMap = (difficulty: number, code: number): GameActionData  => {
    switch (code) {
      case 0: return this.flash(difficulty);
      case 1: return this.fakeFlash(difficulty);
      case 2: return this.multiflash(difficulty);
      case 3: return this.path(difficulty);
      case 4: return this.rotate(difficulty);
      case 5: return this.reflect(difficulty);
      case 6: return this.xReflect(difficulty);
    }
  }

  protected flash = (difficulty: number = 0): GameActionData => {
    const duration = Math.max(100, 300 - 10 * difficulty);

    return {
      opts: {
        duration,
        origin: this.randomGridPos(),
      },
      type: 'flash',
    };
  }

  protected multiflash = (difficulty: number = 0): GameActionData => {
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

  protected path = (difficulty: number): GameActionData => {
    const origin = this.randomGridPos();
    const path = [origin];
    const pathLength = clamp(Math.floor(difficulty / 3), 3, 5); // should scale with difficulty

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

  protected obstacle = (difficulty: number = 0): GameActionData => {
    const typeId = sample([0, 1, 2]);

    switch (typeId) {
      case 0: return this.rotate(difficulty);
      case 1: return this.reflect(difficulty);
      case 2: return this.fakeFlash(difficulty);
    }
  }

  protected rotate = (difficulty: number = 0): GameActionData => {
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

  protected reflect = (difficulty: number = 0): GameActionData => {
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

  protected xReflect = (difficulty: number = 0): GameActionData => {
    const duration = Math.max(250, 750 - difficulty * 15);

    return {
      opts: {
        duration,
        reflectX: true,
        reflectY: true,
      },
      type: 'reflect',
    };
  }

  protected fakeFlash = (difficulty: number = 0): GameActionData => {
    const duration = Math.max(200, 400 - difficulty * 20);

    return {
      opts: {
        duration,
        origin: this.randomGridPos(),
      },
      type: 'fakeflash',
    };
  }

  protected wait = (duration: number): GameActionData => {
    return {
      opts: { duration },
      type: 'wait',
    };
  }

  protected randomGridPos(): GridPos {
    return randomGridPos(this.gridCols, this.gridRows);
  }
}

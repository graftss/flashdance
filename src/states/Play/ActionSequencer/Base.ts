import {
  adjacentGridPos,
  clamp,
  equalGridPos,
  random,
  range,
  sample,
  sampleSize,
  xprod,
} from '../../../utils';

export default class BaseActionSequencer {
  private allGridPositions: GridPos[];
  private randomGridPositionHistory: GridPos[] = [];
  private randomGridPositionHistorySize: number = 3;

  private methodsByCode: string[] = [
    'flash',           // 0
    'fakeFlash',       // 1
    'multiflash',      // 2
    'path',            // 3
    'rotate',          // 4
    'reflect',         // 5
    'xReflect',        // 6
    'flashAndFake',    // 7
  ];

  constructor(
    protected gridCols: number,
    protected gridRows: number,
  ) {
    this.allGridPositions =
      xprod(range(0, gridCols) as number[], range(0, gridRows) as number[])
      .map(([col, row]) => ({ col, row }));
  }

  protected roundByCode = (actionsByCode: any[][]): GameActionData[] => {
    return actionsByCode.map(([code, ...args]) => this.actionByCode(code, ...args));
  }

  protected actionByCode = (code: number, ...args: any[]): GameActionData  => {
    return this[this.methodsByCode[code]](...args);
  }

  protected flash = (duration: number): GameActionData => {
    return {
      opts: {
        duration,
        origin: this.randomGridPosition(),
      },
      type: 'flash',
    };
  }

  protected flashAndFake = (duration: number, fakes: number): GameActionData => {
    const numFakes = clamp(fakes, 1, this.gridCols * this.gridRows - 1);
    const gridPositions = this.randomGridPositions(numFakes + 1);
    const origin = gridPositions.shift();

    return {
      opts: {
        duration,
        fakes: gridPositions,
        origin,
      },
      type: 'flash',
    };
  }

  protected multiflash = (duration: number, count: number): GameActionData => {
    return {
      opts: {
        count,
        duration,
        origin: this.randomGridPosition(),
      },
      type: 'multiflash',
    };
  }

  protected path = (duration: number, pathLength: number): GameActionData => {
    const origin = this.randomGridPosition();
    const path = [origin];

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
        duration,
        path,
      },
      type: 'path',
    };
  }

  protected rotate = (duration: number, turns: number): GameActionData => {
    const rotation = turns * Math.PI / 2;

    return {
      opts: {
        duration,
        rotation,
      },
      type: 'rotate',
    };
  }

  protected reflect = (
    duration: number,
    reflectX: boolean,
    reflectY: boolean,
  ): GameActionData => {
    return {
      opts: {
        duration,
        reflectX,
        reflectY,
      },
      type: 'reflect',
    };
  }

  protected xReflect = (duration: number): GameActionData => {
    return this.reflect(duration, true, true);
  }

  protected fakeFlash = (duration: number): GameActionData => {
    return {
      opts: {
        duration,
        origin: this.randomGridPosition(),
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

  protected randomGridPosition(): GridPos {
    const {
      randomGridPositionHistory: history,
      randomGridPositionHistorySize: historySize,
    } = this;

    let result;
    const tries = 3;

    for (let n = 0; n < tries; n++) {
      result = sample(this.allGridPositions);

      const inHistory = history.some(pos => equalGridPos(pos, result));
      if (!inHistory) {
        return result;
      }
    }

    return sample(history);
  }

  protected randomGridPositions(count: number = 1): GridPos[] {
    return sampleSize(this.allGridPositions, count);
  }
}

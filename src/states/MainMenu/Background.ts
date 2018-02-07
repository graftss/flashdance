import * as Phaser from 'phaser-ce';

import Array2D from '../../Array2D';
import FlashLayer from '../Play/CellGrid/FlashLayer';
import Game from '../../Game';
import { adjacentGridPos, random, randomGridPos, shuffle } from '../../utils';

export default class Background extends Phaser.Group {
  private cellSize: number = 30;
  private cellMargin: number = 3;

  private cols: number;
  private rows: number;
  private grid: Array2D<number>;
  private runInterval;

  constructor(
    public game: Game,
  ) {
    super(game);

    this.initGrid();
    this.alpha = 0.3;
  }

  public run(speed: number): void {
    console.log('running');
    this.runInterval = setInterval(() => this.runRandomLights(2), 1000 / speed);
  }

  public stop(): void {
    console.log('stopping');
    clearInterval(this.runInterval);
  }

  private initGrid(): void {
    this.cols = Math.floor(this.game.width / (this.cellSize + this.cellMargin));
    this.rows = Math.floor(this.game.height / (this.cellSize + this.cellMargin));
    this.grid = new Array2D(this.cols, this.rows);
  }

  private cellInUse({ col, row }: GridPos): boolean {
    // if the input position is invalid, say that it's in use
    return this.grid.isValidPosition(col, row) ?
      Boolean(this.grid.get(col, row)) :
      true;
  }

  private setCellUse(value: number, { col, row }: GridPos): void {
    this.grid.set(value, col, row);
  }

  private cellCoords({ col, row }: GridPos): Vec2 {
    const { cellMargin, cellSize } = this;
    const x = cellMargin + col * (cellMargin + cellSize);
    const y = cellMargin + row * (cellMargin + cellSize);

    return { x, y };
  }

  private newFlashLayer(x: number, y: number) {
    const { cellSize, game } = this;
    const pos = new Phaser.Point(x, y);

    return new FlashLayer(game, this, pos, cellSize, cellSize, 'background');
  }

  private newLight(gridPos: GridPos): TweenWrapper {
    const { x, y } = this.cellCoords(gridPos);
    const { tween } = this.newFlashLayer(x, y).flashTween(300);

    this.setCellUse(1, gridPos);
    tween.onComplete.add(() => this.setCellUse(0, gridPos));

    return tween;
  }

  private newRandomLight(): Maybe<TweenWrapper> {
    const maxTries = 3;

    for (let n = 0; n < maxTries; n++) {
      const gridPos = randomGridPos(this.cols, this.rows);

      if (!this.cellInUse(gridPos)) {
        return this.newLight(gridPos);
      }
    }

    return null;
  }

  private newRandomPath(): Maybe<TweenWrapper> {
    const maxTries = 5;
    const maxPathLength = random(6, 12);
    let gridPos;

    // choose the random initial cell
    for (let n = 0; n < maxTries; n++) {
      gridPos = randomGridPos(this.cols, this.rows);

      if (this.cellInUse(gridPos)) {
        continue;
      }
    }

    // if we didn't find an unoccupied initial cell, just give up
    if (gridPos === undefined) {
      return null;
    }

    const path = [gridPos];
    const visited = ({ col, row }) => (
      path.filter(pos => pos.col === col && pos.row === row).length > 0
    );

    // choose a random cell adjacent to the last cell added to the path
    for (let m = 0; m < maxPathLength; m++) {
      const adjacents = shuffle(adjacentGridPos(this.cols, this.rows, path[path.length - 1]));
      let giveUp = true;

      for (const adjPos of adjacents) {
        if (!this.cellInUse(adjPos) && !visited(adjPos)) {
          path.push(adjPos);
          giveUp = false;
          break;
        }
      }

      // if none of the adjacent cells were free, end the path generation
      if (giveUp) {
        break;
      }
    }

    const { x, y } = this.cellCoords(gridPos);
    const pathCoords = path.slice(1).map(pos => this.cellCoords(pos));
    const { tween } = this.newFlashLayer(x, y)
      .pathTween(pathCoords, path.length * random(130, 170));

    path.forEach(pos => this.setCellUse(1, pos));
    tween.onComplete.add(() => path.forEach(pos => this.setCellUse(0, pos)));

    return tween;
  }

  private runLight(light: Maybe<TweenWrapper>) {
    if (light !== null) {
      light.start();
    }
  }

  private runRandomLights(count: number): void {
    for (let n = 0; n < count; n++) {
      Math.random() > .01 ?
        this.runLight(this.newRandomLight()) :
        this.runLight(this.newRandomPath());
    }
  }
}

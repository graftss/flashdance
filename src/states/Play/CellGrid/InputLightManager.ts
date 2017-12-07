import * as Phaser from 'phaser-ce';

import InputLight from './InputLight';
import CellGrid from './CellGrid';
import Game from '../../../Game';

type PathLight = {
  gridPos: GridPos;
  light: InputLight;
};

export default class InputLightManager extends Phaser.Group {
  private lights: Dict<InputLight[]> = {};
  private path: PathLight[] = [];

  constructor(
    public game: Game,
    private parentGrid: CellGrid,
    private cellWidth: number,
    private cellHeight: number,
  ) {
    super(game, parentGrid);
  }

  public addLight(gridPos: GridPos): InputLight {
    const light = this.spawnLight(gridPos);
    light.brighten().start();

    return light;
  }

  public removeLight(gridPos: GridPos): void {
    this.despawnLightAtCell(gridPos);
  }

  public addPathLight(gridPos: GridPos): InputLight {
    const light = this.addLight(gridPos);
    this.path.push({ light, gridPos });
    return light;
  }

  public removePath(): void {
    for (let i = 0; i < this.path.length; i++) {
      const { gridPos, light } = this.path[i];
      setTimeout(() => {
        this.despawnLight(gridPos, light);
      }, i * 30);
    }

    this.path = [];
  }

  private spawnLight(gridPos: GridPos): InputLight {
    const { x, y } = this.parentGrid.getCellPosition(gridPos);
    const light = new InputLight(
      this.game, this,
      x, y,
      this.cellWidth, this.cellHeight,
    );

    this.lightsAtCell(gridPos).push(light);

    return light;
  }

  private despawnLightAtCell(gridPos: GridPos): void {
    const lightsAtCell = this.lightsAtCell(gridPos);

    if (lightsAtCell.length > 0) {
      this.despawnLight(gridPos, lightsAtCell[0]);
    }
  }

  private despawnLight(gridPos: GridPos, light: InputLight): void {
    const lightsAtCell = this.lightsAtCell(gridPos);
    const index = lightsAtCell.indexOf(light);

    if (index === -1) {
      return;
    }

    light.dimAndDestroy().start();
    lightsAtCell.splice(index, 1);
  }

  private lightsAtCell(gridPos: GridPos): InputLight[] {
    const lightsKey = this.gridPosKey(gridPos);

    const lights = this.lights[lightsKey] || [];
    this.lights[lightsKey] = lights;

    return lights;
  }

  private gridPosKey(gridPos: GridPos): string {
    const { col, row } = gridPos;

    return `${col},${row}`;
  }
}

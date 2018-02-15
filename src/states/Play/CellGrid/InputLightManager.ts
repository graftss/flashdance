import * as Phaser from 'phaser-ce';

import InputLight from './InputLight';
import CellGrid from './CellGrid';
import Game from '../../../Game';
import { findIndex, isEqual } from '../../../utils';

interface IInputLightData {
  gridPos: GridPos;
  light: InputLight;
}

export default class InputLightManager extends Phaser.Group {
  private lights: IInputLightData[] = [];

  constructor(
    public game: Game,
    private parentGrid: CellGrid,
    private cellWidth: number,
    private cellHeight: number,
  ) {
    super(game, parentGrid);
  }

  public addLight(
    gridPos: GridPos,
    tone?: InputLightTone,
    splash: boolean = true,
  ): InputLight {
    const light = this.spawnLight(gridPos, tone);
    light.brighten(splash).start();

    return light;
  }

  public onCompleteInput(): void {
    this.lights.forEach(({ light }) => light.setTone('correct'));
    this.lights[this.lights.length - 1].light.brighten(true);

    setTimeout(() => this.destroyAllLights(), 75);
  }

  public onIncorrectInput(): void {
    this.lights.reverse();

    setTimeout(() => {
      this.cascade(({ light }) => light.setTone('incorrect'), 60);
    }, 200);

    setTimeout(() => {
      // Wind the lights in backwards
      this.destroyAllLights();
    }, 300);
  }

  private spawnLight(gridPos: GridPos, tone?: InputLightTone): InputLight {
    const { x, y } = this.parentGrid.getCellPosition(gridPos);
    const light = new InputLight(
      this.game, this,
      x, y,
      this.cellWidth, this.cellHeight,
      tone,
    );

    this.lights.push({ gridPos, light });

    return light;
  }

  private destroyLightAtGridPos(gridPos: GridPos): void {
    for (const lightData of this.lights) {
      if (isEqual(gridPos, lightData.gridPos)) {
        return this.destroyLight(lightData.light);
      }
    }
  }

  private destroyLight(light: InputLight): void {
    for (let i = 0; i < this.lights.length; i++) {
      if (light === this.lights[i].light) {
        light.dimAndDestroy().start();
        this.lights.splice(i, 1);
        return;
      }
    }
  }

  private destroyAllLights(): void {
    this.cascade(({ light }) => light.dimAndDestroy().start(), 60);

    this.lights = [];
  }

  private cascade(f: (d: IInputLightData) => void, timestep: number): void {
    f(this.lights[0]);

    for (let i = 1; i < this.lights.length; i++) {
      const data = this.lights[i];
      setTimeout(() => f(data), i * timestep);
    }
  }
}

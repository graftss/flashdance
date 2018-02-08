import * as Phaser from 'phaser-ce';

import Game from '../Game';
import MenuOption from './MenuOption';
import { vec2 } from '../utils';

export default class Menu extends Phaser.Group {
  private optionColumns: MenuOption[][];
  private colWidth: number;

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    private rowHeight: number,
    private optionDataColumns: MenuOptionData[][],
    public id?: string,
  ) {
    super(game);

    this.colWidth = game.width / this.optionDataColumns.length;

    this.optionColumns = optionDataColumns.map((column, colIndex) => (
      column.map((data, rowIndex) => (
        this.createMenuOption(colIndex, rowIndex, data)
      ))
    ));
  }

  public setInputEnabled(value: boolean): void {
    this.forEachOption(opt => opt.setInputEnabled(value));
  }

  public transition(delta: Vec2, duration: number): Phaser.Tween {
    const tween = this.game.tweener.positionBy(this, delta, duration);

    tween.onStart.add(() => this.setInputEnabled(false));
    tween.onComplete.add(() => this.setInputEnabled(true));

    return tween;
  }

  public addMenuOption(colIndex: number, data: MenuOptionData): void {
    const column = this.optionColumns[colIndex];
    const rowIndex = column.length;

    column.push(this.createMenuOption(colIndex, rowIndex, data));
  }

  public updateMenuOption(
    colIndex: number,
    rowIndex: number,
    updater: (MenuOption) => void,
  ): void {
    updater(this.optionColumns[colIndex][rowIndex]);
  }

  private forEachOption(f: (MenuOption) => void): void {
    this.optionColumns.forEach(col => col.forEach(f));
  }

  private createMenuOption(colIndex, rowIndex, data): MenuOption {
    const { game, rowHeight, colWidth } = this;

    const option = new MenuOption(
      game,
      colWidth * colIndex, rowHeight * rowIndex,
      colWidth, rowHeight,
      data,
    );

    this.addChild(option);

    return option;
  }
}

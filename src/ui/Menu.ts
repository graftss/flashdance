import * as Phaser from 'phaser-ce';

import Game from '../Game';
import MenuTextOption from './MenuTextOption';
import { vec2 } from '../utils';

export default class Menu extends Phaser.Group {
  private optionColumns: Phaser.Group[][];
  private colWidth: number;

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public rowHeight: number,
    private optionDataColumns: MenuOptionData[][],
    public id: MenuID,
  ) {
    super(game);

    if (optionDataColumns.length) {
      this.setOptionColumns(optionDataColumns);
    }
  }

  public setOptionColumns = (optionDataColumns: MenuOptionData[][]) => {
    this.optionDataColumns = optionDataColumns;
    this.colWidth = this.game.width / optionDataColumns.length;

    this.optionColumns = optionDataColumns.map((column, colIndex) => (
      column.map((data, rowIndex) => (
        this.createMenuOption(colIndex, rowIndex, data)
      ))
    ));
  }

  public setInputEnabled(value: boolean): void {
    this.forEachOption((opt: any) => opt.setInputEnabled && opt.setInputEnabled(value));
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
    updater: (o: Phaser.Group) => void,
  ): void {
    updater(this.optionColumns[colIndex][rowIndex]);
  }

  protected getBackOptionData(): MenuOptionData {
    return {
      label: 'back',
      onSelect: () => this.game.eventBus().menu.popMenu.dispatch(null),
      type: 'text',
    };
  }

  private forEachOption(f: (o: Phaser.Group) => void): void {
    this.optionColumns.forEach(col => col.forEach(f));
  }

  private createMenuOption(
    colIndex: number,
    rowIndex: number,
    data: MenuOptionData,
  ): Phaser.Group {
    switch (data.type) {
      case 'text': return this.createMenuTextOption(colIndex, rowIndex, data);
      case 'group': return this.createMenuGroupOption(colIndex, rowIndex, data);
    }
  }

  private createMenuTextOption(
    colIndex: number,
    rowIndex: number,
    data: MenuTextOptionData,
  ): MenuTextOption {
    const { game, rowHeight, colWidth } = this;

    const option = new MenuTextOption(
      game,
      colWidth * colIndex, rowHeight * rowIndex,
      colWidth, rowHeight,
      data,
    );

    this.addChild(option);

    return option;
  }

  private createMenuGroupOption(
    colIndex: number,
    rowIndex: number,
    data: MenuGroupOptionData,
  ): Phaser.Group {
    const { rowHeight, colWidth } = this;
    const { group, width } = data;

    group.x = colWidth * colIndex + (colWidth - width) / 2;
    group.y = rowHeight * rowIndex;
    this.addChild(group);

    return group;
  }
}

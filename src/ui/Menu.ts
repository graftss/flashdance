import * as Phaser from 'phaser-ce';

import Game from '../Game';
import MenuTextOption from './MenuTextOption';
import { vec2 } from '../utils';

export default class Menu extends Phaser.Group {
  private optionColumns: Phaser.Group[][] = [];
  private colWidth: number;

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public rowHeight: number,
    private optionDataColumns: MenuOptionData[][],
  ) {
    super(game);

    if (optionDataColumns.length) {
      this.setOptionColumns(optionDataColumns);
    }
  }

  public setOptionColumns = (
    optionDataColumns: MenuOptionData[][],
    keepAlive: GridPos[] = [],
  ) => {
    const hash = ({ col, row }: GridPos) => `${col}-${row}`;

    const keepAliveHash = keepAlive.reduce((result, gridPos) => {
      result[hash(gridPos)] = true;
      return result;
    }, {});

    if (this.optionColumns) {
      this.forEachOption((o, col, row) => {
        if (!keepAliveHash[hash({ col, row })]) {
          o.destroy();
        }
      });
    }

    const oldColumns = this.optionColumns;
    this.optionDataColumns = optionDataColumns;
    this.colWidth = this.game.width / optionDataColumns.length;

    this.optionColumns = optionDataColumns.map((optionColumn, col) => (
      optionColumn.map((data, row) => (
        keepAliveHash[hash({ col, row })] ?
          oldColumns[col][row] :
          this.createMenuOption(col, row, data)
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

  public getMenuOption(colIndex: number, rowIndex: number): Phaser.Group {
    return this.optionColumns[colIndex][rowIndex];
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

  public forEachOption(f: (o: Phaser.Group, c: number, r: number) => void): void {
    this.optionColumns.forEach(
      (options, col) => options.forEach((option, row) => f(option, col, row)),
    );
  }

  public findOption(f: (o: Phaser.Group, c: number, r: number) => boolean): Maybe<GridPos> {
    let result = null;

    this.forEachOption((option, col, row) => {
      if (!result && f(option, col, row)) {
        result = { col, row };
      }
    });

    return result;
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
      colWidth * colIndex, this.getOptionHeight(colIndex, rowIndex),
      colWidth, rowHeight,
      data,
      { col: colIndex, row: rowIndex },
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
    group.y = this.getOptionHeight(colIndex, rowIndex);
    this.addChild(group);

    return group;
  }

  private getOptionHeight(colIndex, rowIndex): number {
    let result = 0;

    for (let row = 0; row < rowIndex; row++) {
      result += this.getOptionData(colIndex, row).height || this.rowHeight;
    }

    return result;
  }

  private getOptionData(colIndex, rowIndex) {
    return this.optionDataColumns[colIndex][rowIndex];
  }

  protected pushMenu(menuID: MenuID) {
    this.game.eventBus().menu.pushMenu.dispatch(menuID);
  }
}

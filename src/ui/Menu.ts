import * as Phaser from 'phaser-ce';

import Game from '../Game';
import MenuOption from './MenuOption';
import { vec2 } from '../utils';

export default class Menu extends Phaser.Group {
  private optionColumns: MenuOption[][];

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    private rowHeight: number,
    private optionDataColumns: MenuOptionData[][],
    public id?: string,
  ) {
    super(game);

    const width = game.width / this.optionDataColumns.length;

    this.optionColumns = optionDataColumns.map((column, colIndex) => (
      column.map((data, rowIndex) => {
        const option = new MenuOption(
          game,
          width * colIndex, rowHeight * rowIndex,
          width, rowHeight,
          data,
        );

        this.addChild(option);
        return option;
      })
    ));
  }

  public setInputEnabled(value: boolean) {
    this.forEachOption(opt => opt.setInputEnabled(value));
  }

  public transition(delta: Vec2, duration: number): Phaser.Tween {
    const tween = this.game.tweener.positionBy(this, delta, duration);

    tween.onStart.add(() => this.setInputEnabled(false));
    tween.onComplete.add(() => this.setInputEnabled(true));

    return tween;
  }

  private forEachOption(f: (MenuOption) => void): void {
    this.optionColumns.forEach(col => col.forEach(f));
  }
}

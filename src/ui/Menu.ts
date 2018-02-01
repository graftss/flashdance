import * as Phaser from 'phaser-ce';

import Game from '../Game';
import MenuOption from './MenuOption';
import { vec2 } from '../utils';

export default class Menu extends Phaser.Group {
  private options: MenuOption[];

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    private rowHeight: number,
    private optionData: MenuOptionData[],
  ) {
    super(game);

    this.options = optionData.map((data, index) => {
      const option = new MenuOption(
        game,
        0, rowHeight * index,
        game.width, rowHeight,
        data,
      );

      this.addChild(option);
      return option;
    });
  }

  public setInputEnabled(value: boolean) {
    this.options.forEach(opt => opt.setInputEnabled(value));
  }

  public transition(delta: Vec2, duration: number): Phaser.Tween {
    const tween = this.game.tweener.positionBy(this, delta, duration);

    tween.onStart.add(() => this.setInputEnabled(false));
    tween.onComplete.add(() => this.setInputEnabled(true));

    return tween;
  }
}

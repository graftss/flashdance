import * as Phaser from 'phaser-ce';

import Game from '../Game';
import MenuOption from './MenuOption';

export default class Menu extends Phaser.Group {
  private options: MenuOption[];

  constructor(
    public game: Game,
    private optionData: MenuOptionData[],
  ) {
    super(game);

    const top = 60;
    const rowHeight = 20;

    this.options = optionData.map(({ label }, index) => {
      const y = top + rowHeight * index;

      const option = new MenuOption(game, label, 0, y, game.width, rowHeight);

      this.addChild(option);
      return option;
    });
  }
}

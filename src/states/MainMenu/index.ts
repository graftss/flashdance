import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import Menu from '../../ui/Menu';

export default class MainMenu extends Phaser.State {
  public game: Game;
  public menu: Menu;
  private optionData: MenuOptionData[];

  public create(game: Game) {
    this.optionData = [
      {
        label: 'sup',
        onHover: () => 'hovered sup',
        onSelect: () => 'selected sup',
      },
      {
        label: 'yoyoyoyoyoyyyoyo',
        onHover: () => 'hovered yoyo',
        onSelect: () => 'selected yoyo',
      },
    ];

    this.menu = new Menu(game, this.optionData);
  }
}

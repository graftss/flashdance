import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import Menu from '../../ui/Menu';

export default class LevelSelect extends Phaser.State {
  public game: Game;
  public menu: Menu;

  create(game: Game) {
    this.menu = new Menu(game);
  }
}

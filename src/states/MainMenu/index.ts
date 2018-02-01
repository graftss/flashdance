import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import Menu from '../../ui/Menu';

export default class MainMenu extends Phaser.State {
  public game: Game;
  private mainMenu: Menu;
  private courseMenu: Menu;

  public create() {
    this.initMainMenu();
    this.initCourseMenu();
  }

  private initMainMenu() {
    const mainMenuOptions = [
      {
        label: 'play',
        onSelect: () => this.game.state.start('Play'),
      },
      {
        label: 'options',
        onSelect: () => {
          const delta = { x: 100, y: 0 };
          this.mainMenu.transition(delta, 1000).start();
        },
      },
    ];

    this.mainMenu = new Menu(this.game, 0, 80, 80, mainMenuOptions);
  }

  private initCourseMenu() {
    const courseMenuOptions = [
      {
        label: 'simon',
        onSelect: () => this.game.state.start('Play'),
      }
    ];
  }
}

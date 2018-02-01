import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import Menu from '../../ui/Menu';

export default class MainMenu extends Phaser.State {
  public game: Game;
  private menuStack: Menu[] = [];

  private courseMenu: Menu;
  private mainMenu: Menu;
  private optionMenu: Menu;

  private backOptionData: MenuOptionData = {
    label: 'back',
    onSelect: () => this.popMenu().start(),
  };

  public create() {
    this.initMainMenu();
    this.initCourseMenu();
    this.initOptionMenu();

    this.menuStack = [this.mainMenu];
  }

  private initMainMenu() {
    const mainMenuOptions = [
      {
        label: 'play',
        onSelect: () => {
          this.pushMenu(this.courseMenu).start();
        },
      },
      {
        label: 'options',
        onSelect: () => {
          this.pushMenu(this.optionMenu).start();
        },
      },
    ];

    this.mainMenu = new Menu(this.game, 0, 150, 80, mainMenuOptions);
  }

  private initCourseMenu() {
    const { game } = this;

    const courseMenuOptions = [
      {
        label: 'simon',
        onSelect: () => game.state.start('Play'),
      },
      this.backOptionData,
    ];

    this.courseMenu = new Menu(game, 0, 80, 80, courseMenuOptions);
    this.moveMenuOffscreenRight(this.courseMenu);
  }

  private initOptionMenu() {
    const { game } = this;

    const optionMenuOptions = [
      {
        label: 'delete saved data',
        onSelect: () => console.log('deleting saved data'),
      },
      {
        label: 'colorblind mode',
        onSelect: () => console.log('toggling colorblind mode'),
      },
      this.backOptionData,
    ];

    this.optionMenu = new Menu(game, 0, 80, 80, optionMenuOptions);
    this.moveMenuOffscreenRight(this.optionMenu);
  }

  private getActiveMenu(): Menu {
    return this.menuStack[this.menuStack.length - 1];
  }

  private getPreviousMenu(): Menu {
    return this.menuStack[this.menuStack.length - 2];
  }

  private moveMenuOffscreenRight(menu: Menu) {
    menu.position.x = this.game.width;
  }

  private pushMenu(menu: Menu): TweenWrapper {
    const slideDelta = { x: -this.game.width, y: 0 };
    const slideDuration = 500;
    const activeMenu = this.getActiveMenu();

    this.moveMenuOffscreenRight(menu);

    const tween = this.game.tweener.merge([
      activeMenu.transition(slideDelta, slideDuration),
      menu.transition(slideDelta, slideDuration),
    ]);

    tween.onStart.add(() => this.menuStack.push(menu));

    return tween;
  }

  private moveMenuOffscreenLeft(menu: Menu) {
    menu.position.x = -this.game.width;
  }

  private popMenu(): TweenWrapper {
    const slideDelta = { x: this.game.width, y: 0 };
    const slideDuration = 250;
    const activeMenu = this.getActiveMenu();
    const previousMenu = this.getPreviousMenu();

    this.moveMenuOffscreenLeft(previousMenu);

    const tween = this.game.tweener.merge([
      activeMenu.transition(slideDelta, slideDuration),
      previousMenu.transition(slideDelta, slideDuration),
    ]);

    tween.onStart.add(() => this.menuStack.pop());

    return tween;
  }
}

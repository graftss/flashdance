import * as Phaser from 'phaser-ce';

import Background from './Background';
import CourseMenu from './CourseMenu';
import Game from '../../Game';
import Menu from '../../ui/Menu';
import { destroy } from '../../utils';

const menuIds = {
  main: 'main',
  option: 'option',
  tutorial: 'tutorial',
};

export default class MainMenu extends Phaser.State {
  public game: Game;

  private objects: Phaser.Group;
  private background: Background;
  private menuStack: Menu[] = [];
  private tutorialMenu: Menu;
  private mainMenu: Menu;
  private optionMenu: Menu;

  private backOptionData: MenuOptionData = {
    label: 'back',
    onSelect: () => this.popMenu().start(),
  };

  public create() {
    this.objects = this.game.add.group();

    this.menuStack = [this.initMainMenu()];

    this.initBackground();
    this.background.run(80);
  }

  public shutdown() {
    this.background.stop();
  }

  private initBackground() {
    this.background = new Background(this.game);
    this.objects.add(this.background);
  }

  private initMenuById(menuId: string): Menu {
    switch (menuId) {
      case menuIds.main: return this.initMainMenu();
      case menuIds.tutorial: return this.initTutorialMenu();
      case menuIds.option: return this.initOptionMenu();
    }
  }

  private initMainMenu(): Menu {
    const menuId = menuIds.main;

    const mainMenuOptions = [[
      {
        label: 'tutorials',
        onSelect: () => {
          this.pushMenu(menuIds.tutorial).start();
        },
      },
      {
        label: 'challenges',
        onSelect: () => {
          console.log('open challenge menu');
        },
      },
      {
        label: 'practice',
        onSelect: () => {
          console.log('open practice menu');
        },
      },
      {
        label: 'options',
        onSelect: () => {
          this.pushMenu(menuIds.option).start();
        },
      },
    ]];

    destroy(this.mainMenu);
    this.mainMenu = new Menu(this.game, 0, 150, 80, mainMenuOptions, menuId);
    this.objects.add(this.mainMenu);

    return this.mainMenu;
  }

  private initTutorialMenu(): Menu {
    const { game } = this;
    const menuId = menuIds.tutorial;

    const courseIds = [[0, 1, 2, 3], [4, 5, 6]];

    destroy(this.tutorialMenu);
    this.tutorialMenu = new CourseMenu(game, 0, 80, 80, courseIds, this.startCourse);
    this.moveMenuOffscreenRight(this.tutorialMenu);
    this.objects.add(this.tutorialMenu);

    return this.tutorialMenu;
  }

  private initOptionMenu(): Menu {
    const { game } = this;
    const menuId = menuIds.option;

    const optionMenuOptions = [[
      {
        label: 'delete saved data',
        onSelect: () => {
          this.game.saveFile.clearSave();
          this.game.state.start('MainMenu');
        },
      },
      {
        label: 'colorblind mode',
        onSelect: () => console.log('toggling colourblind mode'),
      },
      this.backOptionData,
    ]];

    destroy(this.optionMenu);
    this.optionMenu = new Menu(game, 0, 80, 80, optionMenuOptions, 'option');
    this.moveMenuOffscreenRight(this.optionMenu);
    this.objects.add(this.optionMenu);

    return this.optionMenu;
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

  private pushMenu(menuId: string): TweenWrapper {
    const menu = this.initMenuById(menuId);
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

  private startCourse = (courseData: CourseData) => {
    this.game.state.start('Play', true, false, courseData);
  }
}

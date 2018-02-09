import * as Phaser from 'phaser-ce';

import Background from './Background';
import CourseMenu from './CourseMenu';
import EventBus from '../../EventBus';
import Game from '../../Game';
import Menu from '../../ui/Menu';
import OptionMenu from './OptionMenu';
import TitleMenu from './TitleMenu';
import TutorialMenu from './TutorialMenu';
import { clone, destroy } from '../../utils';

export default class MainMenu extends Phaser.State {
  public game: Game;
  public eventBus: EventBus;

  private background: Background;

  private menuStack: Menu[] = [];
  private optionMenu: Menu;
  private titleMenu: Menu;
  private tutorialMenu: Menu;

  public init(opts: any = {}) {
    this.eventBus = new EventBus();

    this.initEventHandlers();
    this.initBackground();

    const titleMenu = this.initMenuById('title');
    this.menuStack = [titleMenu];

    if (opts.fadeIn) {
      titleMenu.alpha = 0;

      const tween = this.game.tweener.alpha(titleMenu, 1, 500);
      tween.onStart.add(() => titleMenu.setInputEnabled(false));
      tween.onComplete.add(() => titleMenu.setInputEnabled(true));
      tween.start();
    }
  }

  public shutdown() {
    this.getActiveMenu().destroy();
  }

  private initBackground() {
    if (!this.background) {
      this.background = new Background(this.game);
    }

    this.background.stop();
    this.background.run(80);
  }

  private initEventHandlers = (): void => {
    this.eventBus.menu.popMenu.add(this.popMenu);
    this.eventBus.menu.pushMenu.add(this.pushMenu);
    this.eventBus.menu.startCourse.add(this.startCourse);
  }

  private initMenuById(menuId: MenuID): Menu {
    switch (menuId) {
      case 'title': return new TitleMenu(this.game, 0, 100, 80);
      case 'tutorial': return new TutorialMenu(this.game, 0, 80, 80);
      case 'option': return new OptionMenu(this.game, 0, 80, 80);
    }
  }

  private getActiveMenu(): Menu {
    return this.menuStack[this.menuStack.length - 1];
  }

  private getPreviousMenu(): Menu {
    return this.menuStack[this.menuStack.length - 2];
  }

  private pushMenu = (menuId: MenuID): void => {
    const menu = this.initMenuById(menuId);
    const slideDelta = { x: -this.game.width, y: 0 };
    const slideDuration = 500;
    const activeMenu = this.getActiveMenu();

    menu.position.x = this.game.width;

    const tween = this.game.tweener.merge([
      activeMenu.transition(slideDelta, slideDuration),
      menu.transition(slideDelta, slideDuration),
    ]);

    tween.onStart.add(() => this.menuStack.push(menu));
    tween.start();
  }

  private popMenu = (): void => {
    const slideDelta = { x: this.game.width, y: 0 };
    const slideDuration = 250;
    const activeMenu = this.getActiveMenu();

    const previousMenuId = this.getPreviousMenu().id;
    const newMenu = this.initMenuById(previousMenuId);
    newMenu.position.x = -this.game.width;
    this.menuStack.splice(this.menuStack.length - 2, 1, newMenu);

    const tween = this.game.tweener.merge([
      activeMenu.transition(slideDelta, slideDuration),
      newMenu.transition(slideDelta, slideDuration),
    ]);

    tween.onStart.add(() => this.menuStack.pop());
    tween.start();
  }

  private startCourse = (courseData: CourseData) => {
    const fadeout = this.game.tweener.alpha(this.getActiveMenu(), 0, 500);

    fadeout.onComplete.add(() => {
      this.game.state.start('Play', false, false, courseData);
    });

    fadeout.start();
  }
}

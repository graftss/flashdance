import * as Phaser from 'phaser-ce';

import Background from './Background';
import CourseMenu from './CourseMenu';
import EventBus from '../../EventBus';
import Game from '../../Game';
import Menu from '../../ui/Menu';
import OptionMenu from './OptionMenu';
import PracticeMenu from './PracticeMenu';
import TitleMenu from './TitleMenu';
import { clone, destroy } from '../../utils';

export default class MainMenu extends Phaser.State {
  public game: Game;
  public eventBus: EventBus;

  private background: Background;
  private menuIdStack: MenuID[] = [];
  private activeMenu: Menu;

  public init(opts: any = {}) {
    this.eventBus = new EventBus();

    this.initBackground();
    this.initFirstMenu();
    this.initEventHandlers();

    if (opts.fadeIn) {
      const menu = this.activeMenu;
      menu.alpha = 0;

      const tween = this.game.tweener.alpha(menu, 1, 500);
      tween.onStart.add(() => menu.setInputEnabled(false));
      tween.onComplete.add(() => menu.setInputEnabled(true));
      tween.start();
    }
  }

  public shutdown() {
    this.activeMenu.destroy();
  }

  private initFirstMenu() {
    if (PRODUCTION) {
      this.initFirstMenuById('title');
    } else {
      this.initFirstMenuById('title');
      // this.initFirstMenuById('practice');
    }
  }

  private initFirstMenuById(menuId: MenuID) {
    this.activeMenu = this.initMenuById(menuId);
    this.menuIdStack = [menuId];
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
    const rowHeight = this.game.height / 7;
    switch (menuId) {
      case 'option': return new OptionMenu(this.game, 0, 80, rowHeight);
      case 'practice': return new PracticeMenu(this.game, 0, 80, rowHeight);
      case 'title': return new TitleMenu(this.game, 0, this.game.height / 3, rowHeight);
      case 'course': return new CourseMenu(this.game, 0, 80, rowHeight);
    }
  }

  private pushMenu = (menuId: MenuID): void => {
    const { activeMenu, game } = this;
    const newMenu = this.initMenuById(menuId);
    const slideDelta = { x: -this.game.width, y: 0 };
    const slideDuration = 250;

    newMenu.position.x = this.game.width;

    const tween = game.tweener.merge([
      activeMenu.transition(slideDelta, slideDuration),
      newMenu.transition(slideDelta, slideDuration),
    ]);

    tween.onStart.add(() => {
      this.activeMenu = newMenu;
      this.menuIdStack.push(menuId);
    });
    tween.start();
  }

  private popMenu = (): void => {
    const { activeMenu, game, menuIdStack } = this;
    const slideDelta = { x: this.game.width, y: 0 };
    const slideDuration = 250;

    const previousMenuId = menuIdStack[menuIdStack.length - 2];
    const newMenu = this.initMenuById(previousMenuId);
    newMenu.position.x = -this.game.width;

    const tween = this.game.tweener.merge([
      activeMenu.transition(slideDelta, slideDuration),
      newMenu.transition(slideDelta, slideDuration),
    ]);

    tween.onStart.add(() => {
      this.activeMenu = newMenu;
      this.menuIdStack.pop();
    });
    tween.start();
  }

  private startCourse = (courseData: CourseData) => {
    const fadeout = this.game.tweener.alpha(this.activeMenu, 0, 500);

    fadeout.onComplete.add(() => {
      this.game.state.start('Play', false, false, courseData);
    });

    fadeout.start();
  }
}

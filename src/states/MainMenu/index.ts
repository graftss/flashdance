import * as Phaser from 'phaser-ce';

import Background from './Background';
import Game from '../../Game';
import Menu from '../../ui/Menu';

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

    this.initMainMenu();
    this.initTutorialMenu();
    this.initOptionMenu();
    this.initBackground();

    this.menuStack = [this.mainMenu];
    this.background.run(80);
  }

  public shutdown() {
    this.background.stop();
  }

  private initBackground() {
    this.background = new Background(this.game);
    this.objects.add(this.background);
  }

  private initMainMenu() {
    const mainMenuOptions = [[
      {
        label: 'tutorials',
        onSelect: () => {
          this.pushMenu(this.tutorialMenu).start();
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
          this.pushMenu(this.optionMenu).start();
        },
      },
    ]];

    this.mainMenu = new Menu(this.game, 0, 150, 80, mainMenuOptions);
    this.objects.add(this.mainMenu);
  }

  private initTutorialMenu() {
    const { game } = this;

    const nameToOption = (label: TutorialCourse): MenuOptionData => ({
      label,
      onSelect: () => this.startCourse({
        data: { level: label },
        type: 'tutorial',
      }),
    });

    const col0Names: TutorialCourse[] = [
      'flash',
      'path',
      'fake flash',
      'multiflash',
    ];

    const col1Names: TutorialCourse[] = [
      'reflect',
      'rotate',
      'x-reflect',
    ];

    const tutorialMenuOptions = [
      col0Names.map(nameToOption),
      col1Names.map(nameToOption).concat(this.backOptionData),
    ];

    this.tutorialMenu = new Menu(game, 0, 80, 80, tutorialMenuOptions);
    this.moveMenuOffscreenRight(this.tutorialMenu);
    this.objects.add(this.tutorialMenu);
  }

  private initOptionMenu() {
    const { game } = this;

    const optionMenuOptions = [[
      {
        label: 'delete saved data',
        onSelect: () => console.log('deleting saved data'),
      },
      {
        label: 'colorblind mode',
        onSelect: () => console.log('toggling colorblind mode'),
      },
      this.backOptionData,
    ]];

    this.optionMenu = new Menu(game, 0, 80, 80, optionMenuOptions);
    this.moveMenuOffscreenRight(this.optionMenu);
    this.objects.add(this.optionMenu);
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

  private startCourse(courseData: CourseData) {
    this.game.state.start('Play', true, true, courseData);
  }
}

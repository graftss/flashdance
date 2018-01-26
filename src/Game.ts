import 'p2';
import 'pixi';
import 'phaser';
import * as Phaser from 'phaser-ce';

import EventBus from './EventBus';
import LevelSelect from './states/LevelSelect';
import MainMenu from './states/MainMenu';
import Play from './states/Play';
import Tweener from './Tweener';

export default class Game extends Phaser.Game {
  public tweener: Tweener;
  public eventBus: EventBus;

  constructor(...args) {
    super(...args);
    this.tweener = new Tweener(this);
    this.eventBus = new EventBus();

    this.state.add('LevelSelect', LevelSelect);
    this.state.add('MainMenu', MainMenu);
    this.state.add('Play', Play);

    this.state.start('MainMenu');
  }
}

import 'p2';
import 'pixi';
import 'phaser';
import * as Phaser from 'phaser-ce';

import EventBus from './EventBus';
import Tweener from './Tweener';
import Play from './states/Play';

export default class Game extends Phaser.Game {
  public tweener: Tweener;
  public eventBus: EventBus;

  constructor(...args) {
    super(...args);
    this.tweener = new Tweener(this);
    this.eventBus = new EventBus();
  }
}

const game = new Game(800, 600, Phaser.AUTO);

game.state.add('Play', Play);

game.state.start('Play');

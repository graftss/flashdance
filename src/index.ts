import 'p2';
import 'pixi';
import 'phaser';
import * as Phaser from 'phaser-ce';

import Play from './states/Play';
import Tweener from './Tweener';

export default class Game extends Phaser.Game {
  public tweener: Tweener;

  constructor(...args) {
    super(...args);
    this.tweener = new Tweener(this);
  }
}

const game = new Game(800, 600, Phaser.AUTO);

game.state.add('Play', Play);

game.state.start('Play');

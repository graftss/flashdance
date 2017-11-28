import 'p2';
import 'pixi';
import 'phaser';
import * as Phaser from 'phaser-ce';

import CellGroup from './CellGroup';
import Tweener from './Tweener';

const preload = () => { console.log('preloading') };
const update = () => { };

const create = () => {
  const cells = new CellGroup(game, 100, 100, 300, 300, 3, 3);
  cells.flashCells().start();
};

export default class Flashdance extends Phaser.Game {
  public tweener: Tweener;

  constructor(...args) {
    super(...args);

    this.tweener = new Tweener(this);
  }
}

const game = new Flashdance(800, 600, Phaser.AUTO, '', { preload, create, update });

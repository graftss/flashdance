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

  const flashOpts = {
    row: 2,
    col: 0,
    duration: 300,
  };
  // cells.flashCell(flashOpts).tween.start();

  const rotateOpts: RotateOpts = {
    rotation: Math.PI,
    duration: 500,
  }
  cells.rotate(rotateOpts).tween.start();
};

export default class Flashdance extends Phaser.Game {
  public tweener: Tweener;

  constructor(...args) {
    super(...args);

    this.tweener = new Tweener(this);
  }
}

const game = new Flashdance(800, 600, Phaser.AUTO, '', { preload, create, update });

import 'p2';
import 'pixi';
import 'phaser';
import * as Phaser from 'phaser-ce';

import CellGroup from './CellGroup';

const preload = () => { console.log('preloading') };
const update = () => { };

const create = () => {
  const cells = new CellGroup(game, 100, 100, 300, 300, 3, 3);
};

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload, create, update });

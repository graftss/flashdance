import 'p2';
import 'pixi';
import 'phaser';

import * as Phaser from 'phaser-ce';

const create = () => { console.log('creating') };
const preload = () => { console.log('preloading') };
const update = () => { console.log('updating') };

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload, create, update });


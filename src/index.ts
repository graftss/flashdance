import 'p2';
import 'pixi';
import 'phaser';

import * as Phaser from 'phaser-ce';

const update = () => { console.log('updating') };

const game = new Phaser.Game(800, 600, Phaser.AUTO, { update: update });


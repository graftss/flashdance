import 'p2';
import 'pixi';
import 'phaser';
import * as Phaser from 'phaser-ce';

import CellGroup from './CellGroup';
import GameDirector from './GameDirector';
import Tweener from './Tweener';

const preload = () => { console.log('preloading') };
const update = () => { };

const create = () => {
  game.tweener = new Tweener(game);
  game.cellGroup = new CellGroup(game, 100, 100, 300, 300, 3, 3);
  game.director = new GameDirector(game, game.cellGroup);

  const actions: GameActionData[] = [
    { type: 'flash', opts: { row: 1, col: 1, duration: 700 } },
    { type: 'rotate', opts: { rotation: Math.PI, duration: 500 } },
  ];

  game.director.runActions(actions);
};

export default class Flashdance extends Phaser.Game {
  public tweener: Tweener;
  public cellGroup: CellGroup;
  public director: GameDirector;

  constructor(...args) {
    super(...args);

  }
}

const game = new Flashdance(800, 600, Phaser.AUTO, '', { preload, create, update });

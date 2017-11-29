import * as Phaser from 'phaser-ce';

import GameDirector from './GameDirector';
import Game from '../..';
import CellGrid from '../../actors/CellGrid';

export default class Play extends Phaser.State {
  private cellGroup: CellGrid;
  private director: GameDirector;

  create(game: Game) {
    this.cellGroup = new CellGrid(game, 100, 100, 300, 300, 3, 3);
    this.director = new GameDirector(game, this.cellGroup);

    const actions: GameActionData[] = [
      { type: 'reflect', opts: { reflectX: true, reflectY: true, duration: 500 } },
      { type: 'flash', opts: { row: 1, col: 1, duration: 600 } },
      { type: 'rotate', opts: { rotation: Math.PI, duration: 500 } },
      { type: 'reflect', opts: { reflectX: true, reflectY: false, duration: 500 } },
      { type: 'reflect', opts: { reflectX: true, reflectY: true, duration: 500 } },
    ];

    this.director.runActions(actions);
  }
}

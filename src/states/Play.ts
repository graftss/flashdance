import * as Phaser from 'phaser-ce';

import Game from '..';
import CellGrid from '../actors/CellGrid';
import GameDirector from '../actors/GameDirector';
import Tweener from '../Tweener';

export default class Play extends Phaser.State {
  private cellGroup: CellGrid;
  private director: GameDirector;

  create(game: Game) {
    this.cellGroup = new CellGrid(game, 100, 100, 300, 300, 3, 3);
    this.director = new GameDirector(game, this.cellGroup);

    const actions: GameActionData[] = [
      { type: 'flash', opts: { row: 1, col: 1, duration: 700 } },
      { type: 'rotate', opts: { rotation: Math.PI, duration: 500 } },
    ];

    this.director.runActions(actions);
  }
}

import * as Phaser from 'phaser-ce';

import GameDirector from './GameDirector';
import Game from '../..';
import CellGrid from '../../actors/CellGrid';

export default class Play extends Phaser.State {
  private cellGroup: CellGrid;
  private director: GameDirector;

  public create(game: Game) {
    this.cellGroup = new CellGrid(game, 100, 100, 300, 300, 3, 3);
    this.director = new GameDirector(game, this.cellGroup);

    const pathCells = [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }];

    const actions: GameActionData[] = [
      { type: 'wait', opts: { duration: 300 } },
      { type: 'flash', opts: { cell: { row: 1, col: 1 }, duration: 1000 } },
      { type: 'flash', opts: { cell: { row: 2, col: 1 }, duration: 300 } },
      { type: 'flash', opts: { cell: { row: 2, col: 1 }, duration: 300 } },
      { type: 'fakeflash', opts: { cell: { row: 2, col: 1 }, duration: 300 } },
      { type: 'flash', opts: { cell: { row: 0, col: 0 }, duration: 300 } },
      { type: 'flash', opts: { cell: { row: 2, col: 2 }, duration: 300 } },
      { type: 'flash', opts: { cell: { row: 0, col: 2 }, duration: 300 } },
      { type: 'path', opts: { duration: 500, cells: pathCells } },
      // { type: 'flash', opts: { cell: { row: 0, col: 2 }, duration: 300 } },
      // { type: 'rotate', opts: { rotation: Math.PI * 2, duration: 400 } },
      // { type: 'reflect', opts: { reflectX: true, reflectY: false, duration: 300 } },
      // { type: 'reflect', opts: { reflectX: true, reflectY: true, duration: 500 } },
    ];

    this.director.startRound(actions);
  }
}

import BaseActionSequencer from './Base';
import {
  adjacentGridPos,
  cellTarget,
  intersperse,
  random,
  sample,
  shuffle,
} from '../../../utils';

const toCell = ([row, col]) => ({ row, col });
const waitAction = duration => ({ type: 'wait', opts: { duration }});

export default class ArcadeActionSequencer
  extends BaseActionSequencer
  implements IActionSequencer {

  public randomRound(difficulty: number): GameActionData[] {
    const flashes = Math.ceil(difficulty / 3) - 1;
    const obstacles = Math.floor(difficulty / 4);

    const raw = [];

    for (let i = 0; i < flashes - 1; i++) {
      raw.push(this.randomInputAction(difficulty));
    }

    for (let i = 0; i < obstacles; i++) {
      raw.push(this.randomObstacle(difficulty));
    }

    const shuffled = [
      { type: 'wait', opts: { duration: 300 } },
      this.randomFlash(),
      ...shuffle(raw),
    ];

    return intersperse(shuffled, waitAction(150));
  }
}
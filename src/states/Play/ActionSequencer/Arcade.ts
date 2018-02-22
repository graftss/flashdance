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
  extends BaseActionSequencer implements IActionSequencer {

  public randomRound(difficulty: number): GameActionData[] {
    const flashes = Math.ceil(difficulty / 3) - 1;
    const obstacles = Math.floor(difficulty / 4);

    const raw = [];

    for (let i = 0; i < flashes - 1; i++) {
      // raw.push(this.input(difficulty));
      console.log('placeholder');
    }

    for (let i = 0; i < obstacles; i++) {
      // raw.push(this.obstacle(difficulty));
      console.log('placeholder');
    }

    const shuffled = [
      { type: 'wait', opts: { duration: 300 } },
      ...shuffle(raw),
    ];

    return intersperse(waitAction(150), shuffled);
  }
}

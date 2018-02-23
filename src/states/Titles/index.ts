import * as Phaser from 'phaser-ce';

import Animator from './Animator';
import Game from '../../Game';

export default class Titles extends Phaser.State {
  public game: Game;
  private animator: Animator;

  public init() {
    this.animator = new Animator(this.game);
  }
}

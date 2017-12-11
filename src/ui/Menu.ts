import * as Phaser from 'phaser-ce';

import Game from '../Game';

export default class Menu extends Phaser.Group {
  constructor(
    public game: Game,
  ) {
    super(game);

    const textStyle: Phaser.PhaserTextStyle = {
      font: 'bold 20pt Helvetica',
      fill: 'white',
    };

    game.add.text(20, 20, 'sup', textStyle);
    console.log('hello');
  }
}

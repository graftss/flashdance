import * as Phaser from 'phaser-ce';

import Game from '../Game';

export default class MenuOption extends Phaser.Group {
  private text: Phaser.Text;
  private textStyle: Phaser.PhaserTextStyle = {
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    fill: 'white',
    font: 'bold 20pt Helvetica',
  };

  constructor(
    game: Game,
    public label: string,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {
    super(game);

    this.text = game.add.text(x, y, label, this.textStyle, this);
    this.text.setTextBounds(x, y, w, h);
  }
}

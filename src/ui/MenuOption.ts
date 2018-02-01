import * as Phaser from 'phaser-ce';

import Game from '../Game';

export default class MenuOption extends Phaser.Group {
  private mouseOver: boolean;
  private text: Phaser.Text;
  private textStyle: Phaser.PhaserTextStyle = {
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    fill: 'white',
    font: '50pt Alegreya Sans',
  };

  constructor(
    game: Game,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    private menuOptionData: MenuOptionData,
  ) {
    super(game);

    const { label, onSelect } = menuOptionData;

    this.text = game.add.text(0, 0, label, this.textStyle, this);
    this.text.setTextBounds(0, 0, w, h);
    this.text.inputEnabled = true;

    this.text.events.onInputDown.add(onSelect);
    this.text.events.onInputOver.add(this.onInputOver);
    this.text.events.onInputOut.add(this.onInputOut);
  }

  public setInputEnabled(value: boolean) {
    this.text.inputEnabled = value;
  }

  private onInputOver = () => {
    if (this.mouseOver) {
      return;
    }

    this.mouseOver = true;

    console.log('over');
  };

  private onInputOut = () => {
    if (!this.mouseOver) {
      return;
    }

    this.mouseOver = false;

    console.log('out');
  }
}

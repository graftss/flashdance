import * as Phaser from 'phaser-ce';

import Game from '../Game';

const colors = {
  focused: '#ffffff',
  selected: '#ffffff',
  unfocused: '#dddddd',
};

export default class MenuOption extends Phaser.Group {
  public game: Game;

  private mouseOver: boolean = false;
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
    this.text.addColor(colors.unfocused, 0);

    this.text.events.onInputDown.add(this.onInputDown);
    this.text.events.onInputOver.add(this.onInputOver);
    this.text.events.onInputOut.add(this.onInputOut);
  }

  public setInputEnabled(value: boolean) {
    this.text.inputEnabled = value;
  }

  private onInputDown = () => {
    this.text.addColor(colors.selected, 0);
    this.menuOptionData.onSelect();
  }

  private onInputOver = () => {
    if (this.mouseOver) {
      return;
    }

    this.mouseOver = true;
    this.text.addColor(colors.focused, 0);

    console.log('over');
  }

  private onInputOut = () => {
    if (!this.mouseOver) {
      return;
    }

    this.mouseOver = false;
    this.text.addColor(colors.unfocused, 0);

    console.log('out');
  }
}

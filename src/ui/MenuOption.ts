import * as Phaser from 'phaser-ce';

import Game from '../Game';

export default class MenuOption extends Phaser.Group {
  public game: Game;

  private mouseOver: boolean = false;
  private text: Phaser.Text;
  private textStyle: Phaser.PhaserTextStyle = {
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    fill: 'white',
    font: 'Alegreya Sans',
    fontSize: 50,
    fontWeight: 'bold',
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

    Object.assign(this.textStyle, menuOptionData.textStyle);

    this.initText();
  }

  public setInputEnabled(value: boolean) {
    this.text.inputEnabled = value;
  }

  private initText() {
    const { game, h, menuOptionData, w } = this;
    const { label, onSelect } = menuOptionData;

    this.text = game.add.text(0, 0, label, this.textStyle, this);
    this.text.setTextBounds(0, 0, w, h);
    this.text.inputEnabled = true;

    this.text.events.onInputDown.add(this.onInputDown);
    this.text.events.onInputOver.add(this.onInputOver);
    this.text.events.onInputOut.add(this.onInputOut);
  }

  private onInputDown = () => {
    this.text.tint = 0xbbbbbb;
    this.menuOptionData.onSelect();
  }

  private onInputOver = () => {
    if (this.mouseOver) {
      return;
    }

    this.mouseOver = true;
    this.text.tint = 0xbbbbbb;
  }

  private onInputOut = () => {
    if (!this.mouseOver) {
      return;
    }

    this.mouseOver = false;
    this.text.tint = 0xffffff;
  }
}

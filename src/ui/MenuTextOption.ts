import * as Phaser from 'phaser-ce';

import Game from '../Game';
import { defaults } from '../utils';

const inactiveTint = 0xbbbbbb;
const activeTint = 0xffffff;

export default class MenuTextOption extends Phaser.Group {
  public game: Game;
  public text: Phaser.Text;
  public highlighted: boolean = false;
  private mouseOver: boolean = false;
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
    public menuTextOptionData: MenuTextOptionData,
    public gridPos: GridPos,
  ) {
    super(game);

    this.textStyle = defaults(menuTextOptionData.textStyle, this.textStyle);

    this.initText();
  }

  public setInputEnabled(value: boolean) {
    this.text.inputEnabled = value;
  }

  public toggleHighlight(): void {
    if (this.highlighted) {
      this.unHighlight();
    } else {
      this.highlight();
    }
  }

  public highlight(): void {
    this.highlighted = true;
    this.text.tint = activeTint;
  }

  public unHighlight(): void {
    this.highlighted = false;
    this.text.tint = inactiveTint;
  }

  private initText() {
    const { game, h, menuTextOptionData, w } = this;
    const { label, onSelect } = menuTextOptionData;

    this.text = game.add.text(0, 0, label, this.textStyle, this);
    this.text.setTextBounds(0, 0, w, h);
    this.text.inputEnabled = true;
    this.text.tint = inactiveTint;

    this.text.events.onInputDown.add(this.onInputDown);
    this.text.events.onInputOver.add(this.onInputOver);
    this.text.events.onInputOut.add(this.onInputOut);
  }

  private onInputDown = () => {
    this.menuTextOptionData.onSelect(this.gridPos);
  }

  private onInputOver = () => {
    if (this.mouseOver) {
      return;
    }

    this.mouseOver = true;
    this.text.tint = activeTint;
  }

  private onInputOut = () => {
    if (!this.mouseOver) {
      return;
    }

    this.mouseOver = false;

    if (!this.highlighted) {
      this.text.tint = inactiveTint;
    }
  }
}

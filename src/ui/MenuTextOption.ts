import * as Phaser from 'phaser-ce';

import Game from '../Game';
import { defaults, toTexture } from '../utils';

const inactiveTint = 0x666666;
const activeTint = 0xdddddd;
const activeHighlightedTint = 0xffffff;

export default class MenuTextOption extends Phaser.Group {
  public game: Game;
  public text: Phaser.Text;
  public highlighted: boolean = false;
  private background: Phaser.Sprite;
  private mouseOver: boolean = false;
  private highlightedTint: number = activeHighlightedTint;
  private textStyle: Phaser.PhaserTextStyle = {
    boundsAlignH: 'center',
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
    this.initBackground();
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

  public highlight(tint: number = activeHighlightedTint): void {
    if (this.highlighted) {
      return;
    }

    this.text.tint = tint;
    this.highlightedTint = tint;
    this.highlighted = true;
  }

  public unHighlight(): void {
    this.highlighted = false;
    this.tweenTextTint(inactiveTint).start();
  }

  public showBackground(): void {
    this.background.alpha = 1;
  }

  public hideBackground(): void {
    this.background.alpha = 0;
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

  private initBackground(): void {
    const { x, y, width, height } = this.text.getBounds();
    const paddingX = 5;

    const texture: Phaser.RenderTexture = toTexture(
      this.game.add.graphics(0, 0)
        .beginFill(0xaaaaaa, 0.3)
        .drawRoundedRect(0, 0, width + 2 * paddingX, height, height / 10),
    );

    this.background = this.game.add.sprite(
      (this.w - width) / 2 - paddingX, -2,
      texture,
      null,
      this,
    );

    this.background.alpha = 0;
  }

  private onInputDown = () => {
    this.menuTextOptionData.onSelect(this.gridPos);
  }

  private onInputOver = () => {
    if (this.mouseOver) {
      return;
    }

    this.mouseOver = true;

    if (!this.highlighted) {
      this.tweenTextTint(activeTint).start();
    }
  }

  private onInputOut = () => {
    if (!this.mouseOver) {
      return;
    }

    this.mouseOver = false;

    if (!this.highlighted) {
      this.tweenTextTint(inactiveTint).start();
    }
  }

  private tweenTextTint(color: number, duration: number = 100): Phaser.Tween {
    return this.game.tweener.tint(this.text, color, duration);
  }
}

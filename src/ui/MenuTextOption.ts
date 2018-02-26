import * as Phaser from 'phaser-ce';

import Game from '../Game';
import { defaults, toTexture } from '../utils';

const inactiveTint = 0xcccccc;
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

    this.textStyle.fontSize = this.game.height / 8;
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

  public highlight(
    tint: number = activeHighlightedTint,
    scale?: number,
  ): void {
    if (this.highlighted) {
      return;
    }

    this.text.tint = tint;
    this.highlightedTint = tint;
    this.highlighted = true;

    if (scale !== undefined) {
      this.tweenTextScale(scale);
    }
  }

  public unHighlight(): void {
    this.highlighted = false;
    this.tweenTextTint(inactiveTint);
    this.tweenTextScale(1);
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
    this.text.pivot.x = 0.5 * this.text.width;
    this.text.pivot.y = 0.5 * this.text.height;
    this.text.x += this.w / 2;
    this.text.y += this.h / 2;

    this.text.events.onInputOver.add(this.onInputOver);
    this.text.events.onInputOut.add(this.onInputOut);
  }

  private initBackground(): void {
    const { x, y, width, height } = this.text.getLocalBounds();
    const paddingX = 10;
    const paddingY = 0;

    const texture: Phaser.RenderTexture = toTexture(
      this.game.add.graphics(0, 0)
        .beginFill(0, 0)
        .lineStyle(2, 0xff0000)
        .drawRect(0, 0, width + 2 * paddingX, height),
    );

    this.background = this.game.add.sprite(
      (this.w - width) / 2 - paddingX, -10,
      texture,
      null,
      this,
    );

    this.background.anchor = new Phaser.Point(0.5, 0.5);
    this.background.x += this.background.width / 2;
    this.background.y += this.background.height / 2;

    this.background.alpha = 0;

    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.onInputDown);
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
      this.tweenTextTint(activeTint);
    }
  }

  private onInputOut = () => {
    if (!this.mouseOver) {
      return;
    }

    this.mouseOver = false;

    if (!this.highlighted) {
      this.tweenTextTint(inactiveTint);
    }
  }

  private tweenTextTint(color: number, duration: number = 100): void {
    this.game.tweener.tint(this.text, color, duration).start();
  }

  public tweenTextScale(scale: number, duration: number = 100): void {
    this.game.tweener.scale(this.text, scale, duration).start();
    this.game.tweener.scale(this.background, scale, duration).start();
  }
}

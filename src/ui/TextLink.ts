import * as Phaser from 'phaser-ce';

import Game from '../Game';
import { toTexture } from '../utils';

export default class TextLink extends Phaser.Group {
  public text: Phaser.Text;
  private boundingBox: Phaser.Sprite;

  private defaultTextStyle: Phaser.PhaserTextStyle = {
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    fill: 'white',
    font: 'Alegreya Sans',
    fontWeight: 'bold',
  };

  constructor(
    game: Game,
    parent: Phaser.Group,
    public x: number,
    public y: number,
    public fontSize: number,
    private label: string,
    private onDown?: () => void,
    centered: boolean = false,
  ) {
    super(game, parent);

    const textStyle = {
      ...this.defaultTextStyle,
      fontSize: this.fontSize,
    };

    this.text = this.game.add.text(
      0, 0, this.label, textStyle, this,
    );

    const bounds = this.text.getBounds();

    if (centered) {
      this.x -= bounds.width / 2;
      this.y -= bounds.height / 2;
    }

    this.text.pivot.x = 0.5 * bounds.width;
    this.text.pivot.y = 0.5 * bounds.height;
    this.text.x += bounds.width / 2;
    this.text.y += bounds.height / 2;

    this.initBoundingBox();
  }

  private initBoundingBox() {
    const { width, height } = this.text.getLocalBounds();

    const texture: Phaser.RenderTexture = toTexture(
      this.game.add.graphics(0, 0)
        .lineStyle(1, 0xffffff)
        .beginFill(0, 0)
        .drawRect(0, 0, width, height),
    );

    this.boundingBox = this.game.add.sprite(0, 0, texture, null, this);
    this.boundingBox.alpha = 0;

    if (this.onDown !== undefined) {
      this.boundingBox.inputEnabled = true;
      this.boundingBox.events.onInputDown.add(this.onDown);
    }
  }
}

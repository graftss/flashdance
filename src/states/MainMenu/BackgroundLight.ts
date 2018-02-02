import * as Phaser from 'phaser-ce';

import Game from '../../Game';

export default class BackgroundLight extends Phaser.Group {
  private sprite: Phaser.Sprite;

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    private texture: Phaser.RenderTexture,
  ) {
    super(game);

    this.initSprite();
  }

  initSprite(): void {
    this.sprite = this.game.add.sprite(0, 0, this.texture, null, this);
  }
}

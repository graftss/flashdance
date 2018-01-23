import * as Phaser from 'phaser-ce';

import Game from './Game';

export default class Fragment extends Phaser.Group {
  private sprite: Phaser.Sprite;

  constructor(
    game: Game,
    public width: number,
    public height: number,
    public filters: Phaser.Filter[],
    parent?: Phaser.Group,
  ) {
    super(game, parent);

    // the -2's here seem to be necessary for pixel alignment...
    // not sure what that's about
    this.sprite = game.add.sprite();
    this.sprite.width = width;
    this.sprite.height = height;
    this.sprite.filters = filters;

    this.addChild(this.sprite);
  }

  update() {
    this.filters.forEach(f => f.update());
  }
}

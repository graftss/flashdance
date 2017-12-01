import * as Phaser from 'phaser-ce';

import Game from '../..';
import { shiftAnchor } from '../../utils';

export default class FlashLayer {
  private layer: Phaser.Graphics;

  constructor(
    public game: Game,
    private parent: Phaser.Group,
    private w: number,
    private h: number,
    private opts: FlashLayerOpts,
  ) {
    this.layer = game.add.graphics(0, 0, parent);
    this.drawLayer();
    this.center();
    this.reset();
  }

  public flashTween(duration: number): TweenWrapper {
    const { layer, game } = this;
    const { alpha, chain, merge, nothing, scale } = game.tweener;

    const fadeInDuration = duration / 5;
    const growDuration = Math.max(40, duration / 3);
    const shrinkDuration =  duration - growDuration;

    const scaleEffect = chain([
      scale(layer, .85, growDuration),
      scale(layer, .75, shrinkDuration),
    ]);

    const alphaTween = chain([
      alpha(layer, 1, fadeInDuration),
      alpha(layer, 0, duration - fadeInDuration),
    ]);

    const result = merge([scaleEffect, alphaTween]);
    result.onComplete.add(this.reset);

    return result;
  }

  private drawLayer(): void {
    const { color } = this.opts;

    this.layer.beginFill(color);
    this.layer.drawRoundedRect(0, 0, this.w, this.h, this.w / 10);
    this.layer.endFill();
  }

  private center(): void {
    shiftAnchor(this.layer, this.w / 2, this.h / 2);
  }

  private reset = (): void => {
    this.layer.alpha = 0;
    this.layer.scale.x = .7;
    this.layer.scale.y = .7;
  }
}

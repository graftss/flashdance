import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import Game from '../..';
import { shiftAnchor } from '../../utils';

const flashLayerColor = 0xffffff;
const borderColor = 0xffffff;

export default class Cell extends Phaser.Group {
  private flashLayer: Phaser.Graphics;
  private inputCaptureLayer: Phaser.Graphics;

  constructor(
    public game: Game,
    public grid: CellGrid,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public col: number,
    public row: number,
  ) {
    super(game, grid);

    this.initFlashLayer();
    this.initInputCaptureLayer();
  }

  initFlashLayer(): void {
    this.flashLayer = this.game.add.graphics(0, 0, this);

    shiftAnchor(this.flashLayer, this.w / 2, this.h / 2);

    this.flashLayer.beginFill(flashLayerColor);
    this.flashLayer.drawRoundedRect(0, 0, this.w, this.h, this.w / 10);
    this.flashLayer.endFill();

    this.resetFlashLayer();
  }

  resetFlashLayer = (): void => {
    this.flashLayer.alpha = 0;
    this.flashLayer.scale.x = .7;
    this.flashLayer.scale.y = .7;
  }

  flash(opts: FlashOpts): TweenWrapper {
    const { alpha, chain, merge, nothing, scale } = this.game.tweener;
    const { delay, duration: actionDuration } = opts;

    const duration = delay || actionDuration;
    const fadeInDuration = duration / 5;
    const growDuration = Math.max(40, duration / 3);
    const shrinkDuration =  duration - growDuration;

    const scaleEffect = chain([
      scale(this.flashLayer, .85, growDuration),
      scale(this.flashLayer, .75, shrinkDuration),
    ]);

    const alphaTween = chain([
      alpha(this.flashLayer, 1, fadeInDuration),
      alpha(this.flashLayer, 0, duration - fadeInDuration),
    ]);

    const result = merge([scaleEffect, alphaTween]);
    result.onComplete.add(this.resetFlashLayer);

    return result;
  }

  initInputCaptureLayer(): void {
    this.inputCaptureLayer = this.game.add.graphics(0, 0, this);
    this.inputCaptureLayer.inputEnabled = true;

    shiftAnchor(this.inputCaptureLayer, this.w / 2, this.h / 2);

    this.inputCaptureLayer.beginFill(0, 0);
    this.inputCaptureLayer.drawRect(0, 0, this.w, this.h);
    this.inputCaptureLayer.endFill();

    this.inputCaptureLayer.events.onInputDown.add(this.onInputDown);
  }

  onInputDown = () => {
    const eventData = { type: 'cell', row: this.row, col: this.col };

    this.game.eventBus.inputDown.dispatch(<InputTarget>eventData);
  }
}

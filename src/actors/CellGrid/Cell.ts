import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import Game from '../..';
import { shiftAnchor } from '../../utils';

const flashLayerColor = 0xffffff;
const fakeFlashLayerColor = 0xff0000;
const borderColor = 0xffffff;

export default class Cell extends Phaser.Group {
  private flashLayer: Phaser.Graphics;
  private fakeFlashLayer: Phaser.Graphics;
  private inputCaptureLayer: Phaser.Graphics;

  constructor(
    public game: Game,
    private grid: CellGrid,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
    private col: number,
    private row: number,
  ) {
    super(game, grid);

    this.initFlashLayer();
    this.initFakeFlashLayer();
    this.initInputCaptureLayer();
  }

  private initFlashLayer(): void {
    this.flashLayer = this.game.add.graphics(0, 0, this);
    this.positionFlashLayer(this.flashLayer);
    this.drawFlashLayer(this.flashLayer);
  }

  private positionFlashLayer(layer: Phaser.Graphics): void {
    shiftAnchor(layer, this.w / 2, this.h / 2);
    this.resetFlashLayer(layer);
  }

  private drawFlashLayer(layer: Phaser.Graphics): void {
    layer.beginFill(flashLayerColor);
    layer.drawRoundedRect(0, 0, this.w, this.h, this.w / 10);
    layer.endFill();
  }

  private initFakeFlashLayer(): void {
    this.fakeFlashLayer = this.game.add.graphics(0, 0, this);
    this.positionFlashLayer(this.fakeFlashLayer);
    this.drawFakeFlashLayer(this.fakeFlashLayer);
  }

  private drawFakeFlashLayer(layer: Phaser.Graphics): void {
    layer.beginFill(fakeFlashLayerColor);
    layer.drawRoundedRect(0, 0, this.w, this.h, this.w / 10);
    layer.endFill();
  }

  private resetFlashLayer = (layer: Phaser.Graphics): void => {
    layer.alpha = 0;
    layer.scale.x = .7;
    layer.scale.y = .7;
  }

  private flashTween(
    layer: Phaser.Graphics,
    duration: number,
  ): TweenWrapper {
    const { alpha, chain, merge, nothing, scale } = this.game.tweener;

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
    result.onComplete.add(() => this.resetFlashLayer(layer));

    return result;
  }

  public flash = (opts: FlashOpts): TweenWrapper => {
    const { delay, duration } = opts;

    return this.flashTween(this.flashLayer, delay || duration);
  };

  public fakeFlash = (opts: FlashOpts): TweenWrapper => {
    const { duration } = opts;

    return this.flashTween(this.fakeFlashLayer, duration);
  };

  private initInputCaptureLayer(): void {
    this.inputCaptureLayer = this.game.add.graphics(0, 0, this);
    this.inputCaptureLayer.inputEnabled = true;

    shiftAnchor(this.inputCaptureLayer, this.w / 2, this.h / 2);

    this.inputCaptureLayer.beginFill(0, 0);
    this.inputCaptureLayer.drawRect(0, 0, this.w, this.h);
    this.inputCaptureLayer.endFill();

    this.inputCaptureLayer.events.onInputDown.add(this.onInputDown);
  }

  private onInputDown = () => {
    const eventData = { type: 'cell', row: this.row, col: this.col };

    this.game.eventBus.inputDown.dispatch(<InputTarget>eventData);
  }
}

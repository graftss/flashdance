import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import Game from '../..';
import { isEqual, labelArgs, shiftAnchor } from '../../utils';

const flashLayerColor = 0xffffff;
const fakeFlashLayerColor = 0xff0000;
const borderColor = 0xffffff;

export default class Cell extends Phaser.Group {
  private flashLayer: Phaser.Graphics;
  private fakeFlashLayer: Phaser.Graphics;
  private hitboxLayer: Phaser.Graphics;
  private inputLayer: Phaser.Sprite;

  public inputTarget: InputTarget;
  private lastDragTarget: InputTarget;

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

    this.attachEventHandlers();
    this.initFlashLayer();
    this.initFakeFlashLayer();
    this.initHitboxLayer();
    this.initInputLayer();

    this.inputTarget = { type: 'cell', cell: { col, row } };
  }

  private attachEventHandlers(): void {
    const { eventBus } = this.game;

    eventBus.inputEnabled.add(this.setInputEnabled);
  }

  private initFlashLayer(): void {
    this.flashLayer = this.game.add.graphics(0, 0, this);
    this.drawFlashLayer(this.flashLayer);
    this.centerLayer(this.flashLayer);
    this.resetFlashLayer(this.flashLayer);
  }

  private centerLayer(layer: PIXI.DisplayObjectContainer): void {
    shiftAnchor(layer, this.w / 2, this.h / 2);
  }

  private drawFlashLayer(layer: Phaser.Graphics): void {
    layer.beginFill(flashLayerColor);
    layer.drawRoundedRect(0, 0, this.w, this.h, this.w / 10);
    layer.endFill();
  }

  private initFakeFlashLayer(): void {
    this.fakeFlashLayer = this.game.add.graphics(0, 0, this);
    this.drawFakeFlashLayer(this.fakeFlashLayer);
    this.centerLayer(this.fakeFlashLayer);
    this.resetFlashLayer(this.fakeFlashLayer);
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

  private initHitboxLayer(): void {
    this.hitboxLayer = this.game.add.graphics(0, 0, this);
    this.drawHitboxLayer(this.hitboxLayer);
  }

  private drawHitboxLayer(layer: Phaser.Graphics): void {
    // if (this.col === 1 && this.row === 1) {
    //   layer.beginFill(0x00ff00, 1);
    // } else {
    //   layer.beginFill(0, 0);
    // }
    layer.beginFill(0, 0);
    layer.drawRect(0, 0, this.w, this.h);
    layer.endFill();
  }

  private initInputLayer(): void {
    this.inputLayer = this.getInputLayerSprite();
    this.addInputHandlers(this.inputLayer);
  }

  private setInputEnabled = (enabled: boolean): void => {
    this.inputLayer.inputEnabled = enabled;
  };

  // Only sprites can use Phaser's drag events, so we have to convert a
  // transparent graphic to a sprite via the graphics' texture.
  private getInputLayerSprite(): Phaser.Sprite {
    const layer = this.game.add.graphics(0, 0, this);

    this.drawHitboxLayer(layer);
    const texture = layer.generateTexture();

    layer.destroy();

    return this.game.add.sprite(0, 0, texture, undefined, this);
  }

  private addInputHandlers(sprite: Phaser.Sprite): void {
    // setting `inputEnabled` to true initializes `sprite.input`, because
    // modularity is an illusion
    sprite.inputEnabled = true;

    sprite.input.enableDrag();
    sprite.events.onInputDown.add(this.onInputDown);
    sprite.events.onDragUpdate.add(this.onDragUpdate);
    sprite.events.onDragStop.add(this.onDragStop);

    sprite.inputEnabled = false;
  }

  private onInputDown = (): void => {
    this.lastDragTarget = this.inputTarget;
    this.game.eventBus.inputDown.dispatch(this.inputTarget);
  };

  private onDragUpdate = (_, pointer: Phaser.Pointer): void => {
    const { x, y } = pointer;
    const cell = this.grid.cellContainingPoint(x, y);

    // for now, ignore drags that take place outside of the grid. maybe
    // in the future this will change, or maybe having to drag outside of
    // the grid will be a feature, or maybe ill kill myself before it matters
    if (cell === null) return;

    const { inputTarget } = cell;

    if (!isEqual(inputTarget, this.lastDragTarget)) {
      this.lastDragTarget = inputTarget;
      this.game.eventBus.inputDragTarget.dispatch(inputTarget);
    }
  };

  private onDragStop = (): void => {
    this.game.eventBus.inputDragStop.dispatch(this.lastDragTarget);
    this.lastDragTarget = null;
    this.inputLayer.position.copyFrom(this.hitboxLayer.position);
  }

  public containsPoint(x: number, y: number): boolean {
    return this.hitboxLayer.getBounds().contains(x, y);
  }
}

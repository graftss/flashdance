import * as Phaser from 'phaser-ce';

import Game from '../Game';
import TypedSignal from '../TypedSignal';
import { destroy } from '../utils';

export default class DoubleSlider extends Phaser.Group {
  public onChange: TypedSignal<IDoubleSliderEvent> = new TypedSignal();

  private bar: Phaser.Sprite;
  private leftSlider: Phaser.Sprite;
  private rightSlider: Phaser.Sprite;
  private sliderRadius: number;
  private slideWidth: number;
  private leftSliderValue: number = 0;
  private rightSliderValue: number = 1;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public discreteValues?: number,
  ) {
    super(game, parent);

    this.reset(discreteValues);
  }

  public reset(discreteValues?: number) {
    this.discreteValues = discreteValues;

    destroy(this.bar);
    destroy(this.leftSlider);
    destroy(this.rightSlider);

    this.initBar();
    this.initSliders();
  }

  // for debugging
  private initBorder(): void {
    const { game, h, w, x, y } = this;

    const border = this.game.add.graphics(0, 0, this)
      .beginFill(0, 0)
      .lineStyle(1, 0xffffff, 1)
      .drawRect(0, 0, w, h);
  }

  private initBar(): void {
    const { game, h, w } = this;
    const barHeight = 3;
    const y = (h - barHeight) / 2;

    const graphic = game.add.graphics(0, 0, this)
      .beginFill(0x444444, 1)
      .lineStyle(1, 0xaaaaaa, 1)
      .drawRoundedRect(0, 0, w, barHeight, barHeight / 2);

    this.bar = game.add.sprite(0, y, graphic.generateTexture(), null, this);
    graphic.destroy();
  }

  private initSliders(): void {
    const { discreteValues, game, h } = this;
    const r = this.sliderRadius = h / 2;
    const w = this.slideWidth = this.w - 2 * r;

    const graphic = game.add.graphics(0, 0, this)
      .beginFill(0xffffff, 1)
      .lineStyle(2, 0xffffff, 1)
      .drawCircle(0, 0, this.sliderRadius * 2 - 2);
    const texture = graphic.generateTexture();
    graphic.destroy();

    const leftBoundsRect: Phaser.Rectangle = new Phaser.Rectangle(0, 0, w, h);
    this.leftSlider = game.add.sprite(0, 0, texture, null, this);
    this.leftSlider.inputEnabled = true;
    this.leftSlider.input.enableDrag(true, false, true, 1, leftBoundsRect);
    this.leftSlider.events.onDragUpdate.add(this.onLeftSliderDrag);

    const rightBoundsRect: Phaser.Rectangle = new Phaser.Rectangle(0, 0, w, h);
    this.rightSlider = game.add.sprite(w, 0, texture, null, this);
    this.rightSlider.inputEnabled = true;
    this.rightSlider.input.enableDrag(true, false, true, 1, rightBoundsRect);
    this.rightSlider.events.onDragUpdate.add(this.onRightSliderDrag);

    if (discreteValues !== undefined) {
      const snapX = w / discreteValues;
      this.leftSlider.input.enableSnap(snapX, 1, true, true);
      this.rightSlider.input.enableSnap(snapX, 1, true, true);
    }

    this.updateLeftSliderBounds();
    this.updateRightSliderBounds();
  }

  private onLeftSliderDrag = (): void => {
    this.leftSliderValue = this.xToValue(this.leftSlider.x);
    this.updateRightSliderBounds();

    this.onChange.dispatch(this.getEventData());
  }

  private onRightSliderDrag = (): void => {
    this.rightSliderValue = this.xToValue(this.rightSlider.x);
    this.updateLeftSliderBounds();

    this.onChange.dispatch(this.getEventData());
  }

  private xToValue(x: number) {
    return x / this.slideWidth;
  }

  private updateLeftSliderBounds(): void {
    this.leftSlider.input.boundsRect.width = this.rightSlider.x -
      this.extraDiscreteValueSpacing();
  }

  private updateRightSliderBounds(): void {
    const rect = this.rightSlider.input.boundsRect;

    rect.width = this.slideWidth - this.leftSlider.x;
    rect.x = this.leftSlider.x +
      2 * this.sliderRadius +
      this.extraDiscreteValueSpacing();
  }

  // Amount to reduce the bounding boxes of both sliders when we're
  // using discrete values, so that the sliders can't be dragged on top
  // of each other.
  private extraDiscreteValueSpacing(): number {
    return this.discreteValues === undefined ?
      0 :
      Math.ceil(this.slideWidth / this.discreteValues / 10);
  }

  private getEventData(): IDoubleSliderEvent {
    const result: IDoubleSliderEvent = {
      left: this.leftSliderValue,
      right: this.rightSliderValue,
    };

    if (this.discreteValues !== undefined) {
      result.leftDiscrete = Math.round(result.left * this.discreteValues);
      result.rightDiscrete = Math.round(result.right * this.discreteValues);
    }

    return result;
  }
}

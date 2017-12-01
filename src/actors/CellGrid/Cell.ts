import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import FlashLayer from './FlashLayer';
import Hitbox from '../Hitbox';
import Game from '../..';
import { isEqual, labelArgs, shiftAnchor } from '../../utils';

const flashColor = 0xffffff;
const fakeFlashColor = 0xff0000;

export default class Cell extends Phaser.Group {
  private flashLayer: FlashLayer;
  private fakeFlashLayer: FlashLayer;
  private hitbox: Hitbox;
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

    this.flashLayer = new FlashLayer(game, this, w, h, { color: flashColor });
    this.fakeFlashLayer = new FlashLayer(game, this, w, h, { color: fakeFlashColor });
    this.hitbox = new Hitbox(game, this, 0, 0, w, h);

    this.attachEventHandlers();
    this.initInputLayer();

    this.inputTarget = { type: 'cell', cell: { col, row } };
  }

  private attachEventHandlers(): void {
    const { eventBus } = this.game;

    eventBus.inputEnabled.add(this.setInputEnabled);
  }

  public containsPoint(x: number, y: number): boolean {
    return this.hitbox.containsPoint(x, y);
  }

  public flash = (opts: FlashOpts): TweenWrapper => {
    const { delay, duration } = opts;

    return this.flashLayer.flashTween(delay || duration);
  };

  public fakeFlash = (opts: FlashOpts): TweenWrapper => {
    return this.fakeFlashLayer.flashTween(opts.duration);
  };

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
    const texture = this.hitbox.generateTexture();
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
    this.inputLayer.position.copyFrom(this.hitbox.getPosition());
  }
}

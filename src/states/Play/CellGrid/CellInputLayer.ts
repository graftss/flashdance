import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import Hitbox from '../../../Hitbox';
import Game from '../../../Game';
import { isEqual } from '../../../utils';

export default class CellInputLayer {
  private hitbox: Hitbox;
  public sprite: Phaser.Sprite;

  private lastDragTarget: InputTarget;

  constructor(
    private game: Game,
    private parentCell: Cell,
    private w: number,
    private h: number,
    private inputTarget: InputTarget,
  ) {
    this.hitbox = new Hitbox(game, parentCell, 0, 0, w, h);

    const texture = this.hitbox.generateTexture();

    this.sprite = game.add.sprite(0, 0, texture, undefined, parentCell);

    // enabling input is what creates the `sprite.input` object, because of
    // (i assume) shining galaxy brain optimization reasons. so we need to
    // enable input before enabling drag, and then we disable input because we
    // never actually wanted input enabled in the first place
    this.setInputEnabled(true);
    this.sprite.input.enableDrag();
    this.setInputEnabled(false);

    this.sprite.events.onInputDown.add(this.onInputDown);
    this.sprite.events.onDragUpdate.add(this.onDragUpdate);
    this.sprite.events.onDragStop.add(this.onDragStop);

    game.eventBus.inputEnabled.add(this.setInputEnabled);
  }

  public containsPoint(x: number, y: number): boolean {
    return this.hitbox.containsPoint(x, y);
  }

  private setInputEnabled = (enabled: boolean): void => {
    this.sprite.inputEnabled = enabled;
  }

  private onInputDown = (): void => {
    this.lastDragTarget = this.inputTarget;
    this.game.eventBus.inputDown.dispatch(this.inputTarget);
  }

  private onDragUpdate = (_, pointer: Phaser.Pointer): void => {
    const { x, y } = pointer;
    const cell = this.parentCell.parentGrid.cellContainingPoint(x, y);

    // for now, ignore drags that take place outside of the grid. maybe
    // in the future this will change, or maybe having to drag outside of
    // the grid will be a feature, or maybe ill kill myself before it matters
    if (cell === null) {
      return;
    }

    const { inputTarget } = cell;

    if (!isEqual(inputTarget, this.lastDragTarget)) {
      this.lastDragTarget = inputTarget;
      this.game.eventBus.inputDragTarget.dispatch(inputTarget);
    }
  }

  private onDragStop = (): void => {
    this.game.eventBus.inputDragStop.dispatch(this.lastDragTarget);
    this.sprite.position.copyFrom(this.hitbox.getPosition());
  }
}

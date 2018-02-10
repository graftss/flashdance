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
    this.sprite.inputEnabled = true;
    this.sprite.input.enableDrag();

    this.sprite.events.onInputDown.add(this.onInputDown);
    this.sprite.events.onDragUpdate.add(this.onDragUpdate);
    this.sprite.events.onDragStop.add(this.onDragStop);
  }

  public containsPoint(x: number, y: number): boolean {
    return this.hitbox.containsPoint(x, y);
  }

  private onInputDown = (): void => {
    this.lastDragTarget = this.inputTarget;
    this.game.eventBus().play.inputDown.dispatch({
      target: this.inputTarget,
      type: 'down',
    });
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
      this.game.eventBus().play.inputDragTarget.dispatch({
        target: inputTarget,
        type: 'drag',
      });
    }
  }

  private onDragStop = (): void => {
    this.sprite.position.copyFrom(this.hitbox.getPosition());
    this.game.eventBus().play.inputDragStop.dispatch({
      target: this.lastDragTarget,
      type: 'up',
    });
  }
}

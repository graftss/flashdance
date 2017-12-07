import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import CellInputLayer from './CellInputLayer';
import Game from '../../../Game';
import { cellTarget, isEqual, labelArgs, shiftAnchor } from '../../../utils';

const flashColor = 0xffffff;
const fakeFlashColor = 0xff0000;

export default class Cell extends Phaser.Group {
  public inputTarget: InputTarget;
  public inputLayer: CellInputLayer;

  public lit: boolean = false;

  constructor(
    public game: Game,
    public parentGrid: CellGrid,
    public x: number,
    public y: number,
    private w: number,
    private h: number,
    private col: number,
    private row: number,
  ) {
    super(game, parentGrid);

    this.inputTarget = cellTarget({ col, row });
    this.inputLayer = new CellInputLayer(game, this, w, h, this.inputTarget);
  }

  public containsPoint(x: number, y: number): boolean {
    return this.inputLayer.containsPoint(x, y);
  }
}

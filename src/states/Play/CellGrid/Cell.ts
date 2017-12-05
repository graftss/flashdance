import * as Phaser from 'phaser-ce';

import CellBacklight from './CellBacklight';
import CellGrid from './CellGrid';
import CellInputLayer from './CellInputLayer';
import Game from '../../../Game';
import { cellTarget, isEqual, labelArgs, shiftAnchor } from '../../../utils';

const flashColor = 0xffffff;
const fakeFlashColor = 0xff0000;

export default class Cell extends Phaser.Group {
  public backlight: CellBacklight;
  public inputTarget: InputTarget;
  public inputLayer: CellInputLayer;

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
    this.backlight = new CellBacklight(game, this, w, h);
  }

  public containsPoint(x: number, y: number): boolean {
    return this.inputLayer.containsPoint(x, y);
  }
}

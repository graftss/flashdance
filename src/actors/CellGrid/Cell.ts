import * as Phaser from 'phaser-ce';

import CellGrid from './CellGrid';
import FlashLayer from './FlashLayer';
import CellInputLayer from './CellInputLayer';
import Game from '../..';
import { isEqual, labelArgs, shiftAnchor } from '../../utils';

const flashColor = 0xffffff;
const fakeFlashColor = 0xff0000;

export default class Cell extends Phaser.Group {
  private flashLayer: FlashLayer;
  private fakeFlashLayer: FlashLayer;
  private inputLayer: CellInputLayer;

  public inputTarget: InputTarget;

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

    this.inputTarget = { type: 'cell', cell: { col, row } };

    this.flashLayer = new FlashLayer(game, this, w, h, { color: flashColor });
    this.fakeFlashLayer = new FlashLayer(game, this, w, h, { color: fakeFlashColor });
    this.inputLayer = new CellInputLayer(game, this, w, h, this.inputTarget);
  }

  public containsPoint(x: number, y: number): boolean {
    return this.inputLayer.containsPoint(x, y);
  }

  public flash = (opts: FlashOpts): TweenWrapper => {
    const { delay, duration } = opts;

    return this.flashLayer.flashTween(delay || duration);
  };

  public fakeFlash = (opts: FlashOpts): TweenWrapper => {
    return this.fakeFlashLayer.flashTween(opts.duration);
  };
}

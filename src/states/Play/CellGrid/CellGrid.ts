import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import CellGridBorder from './CellGridBorder';
import { FBMClouds } from '../../../filters';
import FlashLayer from './FlashLayer';
import Fragment from '../../../Fragment';
import Game from '../../../Game';
import InputLightManager from './InputLightManager';
import LifeBar from './LifeBar';
import { copyArray, shiftAnchor, vec2 } from '../../../utils';

export const cellGridActionTypes = [
  'fakeflash',
  'flash',
  'multiflash',
  'path',
  'reflect',
  'rotate',
];

export default class CellGrid extends Phaser.Group {
  private background: Phaser.Graphics;
  private border: CellGridBorder;
  private borderThickness: number = 3;
  private cellHeight: number;
  private cellWidth: number;
  private cells: Cell[][] = [];
  private inputLightManager: InputLightManager;
  private lifeBar: LifeBar;

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public rows: number,
    public cols: number,
  ) {
    super(game);

    this.init();
  }

  public fadeIn(): TweenWrapper {
    const fadeIn = this.game.tweener.alpha(this, 1, 1000);

    return fadeIn;
  }

  public cellContainingPoint(x: number, y: number): Maybe<Cell> {
    const { cells, cols, rows } = this;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const cell = this.getCell(col, row);

        if (cell.containsPoint(x, y)) {
          return cell;
        }
      }
    }

    return null;
  }

  public buildAction(actionData: GameActionData): GameAction {
    switch (actionData.type) {
      case 'flash': return this.flashCell(actionData.opts);
      case 'multiflash': return this.multiflashCell(actionData.opts);
      case 'fakeflash': return this.fakeFlashCell(actionData.opts);
      case 'path': return this.path(actionData.opts);
      case 'rotate': return this.rotate(actionData.opts);
      case 'reflect': return this.reflect(actionData.opts);
    }
  }

  public getCellPosition(gridPos: GridPos): Vec2 {
    return vec2.clone(this.getCellByGridPos(gridPos).position);
  }

  private flashCell(opts: FlashOpts): GameAction {
    const { duration, origin } = opts;
    const originCell = this.getCellByGridPos(origin);
    const flashLayer = this.newFlashLayer(originCell.position.clone(), false);

    return flashLayer.flashTween(duration);
  }

  private multiflashCell(opts: MultiflashOpts): GameAction {
    const { count, duration, origin } = opts;
    const originCell = this.getCellByGridPos(origin);
    const flashLayer = this.newFlashLayer(originCell.position.clone(), false);

    return flashLayer.multiflashTween(count, duration);
  }

  private fakeFlashCell(opts: FlashOpts): GameAction {
    const { duration, origin } = opts;
    const originCell = this.getCellByGridPos(origin);
    const flashLayer = this.newFlashLayer(originCell.position.clone(), true);

    return flashLayer.fakeFlashTween(duration);
  }

  private path(opts: PathOpts): GameAction {
    const { duration, path } = opts;
    const [origin, ...rest] = path;

    const originCell = this.getCellByGridPos(origin);
    const pathPositions = rest.map(this.pathPositionMap);
    const flashLayer = this.newFlashLayer(originCell.position.clone(), false);

    return flashLayer.pathTween(pathPositions, duration);
  }

  private rotate(opts: RotateOpts): GameAction {
    const { rotation, duration } = opts;

    return {
      duration,
      tween: this.game.tweener.rotation(this, rotation, duration),
    };
  }

  private reflect(opts: ReflectOpts): GameAction {
    const { duration, reflectX, reflectY } = opts;
    const { alpha, merge, scale } = this.game.tweener;

    const targetScale = {
      x: this.scale.x * (reflectX ? -1 : 1),
      y: this.scale.y * (reflectY ? -1 : 1),
    };
    const scaleTween = scale(this, targetScale, duration);

    let pastHalf = false;
    scaleTween.onUpdateCallback((_, t) => {
      if (t >= 0.5 && !pastHalf) {
        pastHalf = true;
        // this.border.flip();
        this.background.alpha = 0.8 - this.background.alpha;
      }
    });

    return {
      duration,
      tween: scaleTween,
    };
  }

  private init() {
    this.initCells();
    this.initLifeBar();
    this.initBorder();
    this.initInputLightManager();
    this.initEventHandlers();
    this.initBackground();

    this.alpha = 0;
    shiftAnchor(this, this.w / 2, this.h / 2);
    this.bringToTop(this.inputLightManager);
    this.sendToBack(this.background);
  }

  private initCells() {
    const { cols, rows, w, h, game } = this;
    const cellW = this.cellWidth = w / cols;
    const cellH = this.cellHeight = h / rows;

    let x = 0;
    for (let col = 0; col < cols; col++) {
      this.cells[col] = [];
      let y = 0;
      for (let row = 0; row < rows; row++) {
        this.cells[col][row] = new Cell(game, this, x, y, cellW, cellH, col, row);
        y += this.cellHeight;
      }

      x += cellW;
    }
  }

  private initBorder(): void {
    const { borderThickness, game, h, w } = this;

    this.border = new CellGridBorder(game, this, 0, 0, w, h, borderThickness);
  }

  private initLifeBar(): void {
    this.lifeBar = new LifeBar(this.game, this, this.w / 2, -this.h / 10, 3);
  }

  private initInputLightManager(): void {
    this.inputLightManager = new InputLightManager(
      this.game,
      this,
      this.cellWidth,
      this.cellHeight,
    );
  }

  private initEventHandlers(): void {
    this.game.eventBus().correctInput.add(this.onCorrectInput);
    this.game.eventBus().incorrectInput.add(this.onIncorrectInput);
  }

  private onCorrectInput = ({ expected, observed }: InputPair) => {
    const gridPos = expected.target.cell;

    switch (expected.type) {
      case 'down': {
        this.inputLightManager.addLight(gridPos, 'correct');
        break;
      }

      case 'down/drag':
      case 'over/drag': {
        this.inputLightManager.addLight(gridPos);
        break;
      }

      case 'up':
      case 'up/drag': {
        this.inputLightManager.onCompleteInput();
        break;
      }
    }
  }

  private onIncorrectInput = ({ expected, observed }: InputPair) => {
    const inputPos = observed.target.cell;

    this.inputLightManager.addLight(inputPos, 'incorrect');
    this.inputLightManager.onIncorrectInput();

    this.lifeBar.changeLifeCount(-1);
  }

  private initBackground(): void {
    const { borderThickness: bt, game, h, w } = this;

    const graphics = this.game.add.graphics(0, 0, this);
    graphics.alpha = 0.3;

    graphics.beginFill();
    graphics.drawRect(0, 0, w + 1, h + 1);
    graphics.endFill();

    this.background = graphics;
  }

  private newFlashLayer(position: Phaser.Point, isFake: boolean): FlashLayer {
    const flashLayer = new FlashLayer(
      this.game,
      this,
      position,
      this.cellWidth,
      this.cellHeight,
      isFake ? 'fake' : 'flash',
    );

    return flashLayer;
  }

  private getCell(row: number, col: number): Cell {
    return this.cells[col][row];
  }

  private getCellByGridPos = ({ col, row }: GridPos): Cell => {
    return this.getCell(row, col);
  }

  private pathPositionMap = (gridPos: GridPos) => {
    const cell = this.getCellByGridPos(gridPos);

    return vec2.clone(cell.position);
  }
}

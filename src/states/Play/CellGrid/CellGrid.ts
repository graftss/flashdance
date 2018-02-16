import * as Phaser from 'phaser-ce';

import Cell from './Cell';
import CellGridBorder from './CellGridBorder';
import { FBMClouds } from '../../../filters';
import FlashLayer from './FlashLayer';
import Fragment from '../../../Fragment';
import Game from '../../../Game';
import GridLines from './GridLines';
import InputLightManager from './InputLightManager';
import LifeBar from './LifeBar';
import ProgressBar from './ProgressBar';
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
  private cellHeight: number;
  private cellWidth: number;
  private cells: Cell[][] = [];
  private gridLines: GridLines;
  private inputLightManager: InputLightManager;
  private lifeBar: LifeBar;
  private progressBar: ProgressBar;

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public rows: number,
    public cols: number,
    public courseData: CourseData,
  ) {
    super(game);

    this.initCells();
    this.initGridLines();
    this.initLifeBar();
    this.initProgressBar();
    this.initBorder();
    this.initInputLightManager();
    this.initBackground();
    this.initEventHandlers();

    this.alpha = 0;
    shiftAnchor(this, this.w / 2, this.h / 2);
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

  public completeCourseEffect(): TweenWrapper {
    const { alpha, chain, merge, nothing, rotation, scale } = this.game.tweener;
    const ease = Phaser.Easing.Quartic.In;
    const effectDuration = 2000;

    const waterfallAllCells = (times: number, duration: number) => {
      const tweens = [];
      const waterfallFlashDuration = 4 * duration / (times * this.cols * this.rows);

      for (let n = 0; n < times; n++) {
        for (let col = 0; col < this.cols; col++) {
          for (let row = 0; row < this.rows; row++) {
            const index = n * (this.cols * this.rows) + col * this.rows + row + 1;
            const opts = {
              duration: waterfallFlashDuration,
              origin: { col, row },
            };

            tweens.push(chain([
              nothing(index * waterfallFlashDuration / 4),
              this.flashCell(opts).tween,
            ]));
          }
        }
      }

      // reverse `tweens` here so that the first tween in the array
      // finishes last, so that the merger can be correctly chained
      return merge(tweens.reverse());
    };

    const fadeOut = alpha(this, 0.3, effectDuration);

    // have to be careful of the grid potentially ending on a negative
    // scale from a reflect; if we double the current scale, the animation
    // will appear smooth even if one or both components are tweening
    // from -1 to -2, instead of from 1 to 2
    const targetScale = { x: this.scale.x * 2, y: this.scale.y * 2 };
    const grow = scale(this, targetScale, effectDuration).easing(ease);

    const spin = rotation(this, Math.PI * 4, effectDuration).easing(ease);

    const effect = merge([
      waterfallAllCells(5, effectDuration * .8),
      fadeOut,
      grow,
      spin,
    ]);

    return chain([nothing(100), effect]);
  }

  public failCourseEffect(): TweenWrapper {
    const { alpha, chain, merge, nothing, rotation, scale } = this.game.tweener;
    const duration = 2000;

    const delayedFadeOut = chain([
      nothing(2 * duration / 3),
      alpha(this, 0, duration / 3),
    ]);

    return merge([
      rotation(this, Math.PI * 2, duration)
        .easing(Phaser.Easing.Cubic.In),
      scale(this, 0, duration)
        .easing(Phaser.Easing.Cubic.In),
      delayedFadeOut,
    ]);
  }

  public quitCourseEffect(): TweenWrapper {
    const { alpha, chain, nothing } = this.game.tweener;
    const duration = 1000;

    const delay = duration / 5;

    return chain([
      nothing(delay),
      alpha(this, 0, duration - delay),
    ]);
  }

  private flashCell(opts: FlashOpts): GameAction {
    const { duration, fakes = [], origin } = opts;

    const flashTweens = [origin, ...fakes]
      .map(this.getCellByGridPos)
      // only the origin at index 0 isn't fake, the rest are
      .map((cell, index) => this.newFlashLayer(cell.position.clone(), index !== 0))
      .map(flashLayer => flashLayer.flashTween(duration).tween);

    return {
      duration,
      tween: this.game.tweener.merge(flashTweens),
    };
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

    return flashLayer.flashTween(duration);
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
        this.lifeBar.flip();
        this.background.alpha = 0.8 - this.background.alpha;
      }
    });

    return {
      duration,
      tween: scaleTween,
    };
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

  private initGridLines() {
    this.gridLines = new GridLines(
      this.game,
      this,
      this.w, this.h,
      this.rows, this.cols,
    );
  }

  private initBorder(): void {
    const { game, h, w } = this;

    this.border = new CellGridBorder(game, this, 0, 0, w, h);
  }

  private initLifeBar(): void {
    const { courseData: { lives }, game, h, w } = this;

    this.lifeBar = new LifeBar(game, this, w / 2, -h / 10, lives);
  }

  private initProgressBar(): void {
    const { courseData, game, h, w } = this;

    this.progressBar = new ProgressBar(
      game,
      this,
      0, h + h / 20,
      w + 2, h / 20,
      courseData.minDifficulty,
      courseData.maxDifficulty,
    );
  }

  private initInputLightManager(): void {
    this.inputLightManager = new InputLightManager(
      this.game,
      this,
      this.cellWidth,
      this.cellHeight,
    );

    this.bringToTop(this.inputLightManager);
  }

  private initEventHandlers(): void {
    const eventBus = this.game.eventBus();

    eventBus.play.inputCorrect.add(this.onCorrectInput);
    eventBus.play.inputIncorrect.add(this.onIncorrectInput);
    eventBus.play.courseQuit.add(this.onCourseQuit);
  }

  private onCorrectInput = ({ expected, observed }: InputPair) => {
    const gridPos = expected.target.cell;

    switch (expected.type) {
      case 'down': {
        this.inputLightManager.addLight(gridPos, 'neutral');
        break;
      }

      case 'down/drag':
      case 'over/drag': {
        this.inputLightManager.addLight(gridPos, 'neutral');
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
  }

  private onCourseQuit = (): void => {
    const tween = this.quitCourseEffect();

    tween.onComplete.add(() => {
      this.game.state.start('MainMenu', false, false, { fadeIn: true });
      this.destroy();
    });

    tween.start();
  }

  private initBackground(): void {
    const { game, h, w } = this;

    const graphics = this.game.add.graphics(0, 0, this);
    graphics.alpha = 0.3;

    graphics.beginFill();
    graphics.drawRect(0, 0, w + 1, h + 1);
    graphics.endFill();

    this.background = graphics;
    this.sendToBack(this.background);
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

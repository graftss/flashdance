import * as Phaser from 'phaser-ce';
import { destroy, range, sampleSize, xprod } from '../../../utils';

import Cell from './Cell';
import Game from '../../../Game';
import { shiftAnchor, toTexture, vec2 } from '../../../utils';

type FlashLayerContext = 'flash' | 'fake' | 'background';

const backgroundFlashColor = 0x999999;
const flashColor = 0xffffff;
const fakeFlashColor = 0xff0000;
const multiflashDotColor = 0x666666;

const dotPlaces = 3;

export default class FlashLayer extends Phaser.Group {
  public layer: Phaser.Group;
  public flashGraphic: Phaser.Graphics;
  public multiflashDots: Phaser.Graphics;
  public emitter: Phaser.Particles.Arcade.Emitter;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public position: Phaser.Point,
    private w: number,
    private h: number,
    private context: FlashLayerContext = 'flash',
  ) {
    super(game, parent);

    this.initLayerGroup(this.contextColor(context));
  }

  public flashTween(duration: number): GameAction {
    const tween = this.flash(duration);

    return { duration, tween };
  }

  public multiflashTween(count: number, duration: number): GameAction {
    const tween = this.multiflash(count, duration, flashColor);

    return { duration, tween };
  }

  public pathTween(path: Vec2[], duration: number): GameAction {
    const reducedPath = FlashLayer.mergeParallelPathMoves([this.position, ...path]);
    const tween = this.path(reducedPath, duration);

    return { duration, tween };
  }

  private initLayerGroup(color: number): void {
    destroy(this.layer);

    this.layer = this.game.add.group(this);
    shiftAnchor(this.layer, this.w / 2, this.h / 2);
    this.layer.alpha = 0;
    this.layer.scale.x = .95;
    this.layer.scale.y = .95;

    this.initFlashGraphic(color);
  }

  private initFlashGraphic(color: number): void {
    destroy(this.flashGraphic);

    this.flashGraphic = this.game.add.graphics(0, 0, this.layer);

    if (this.context === 'flash' || this.context === 'fake') {
      this.flashGraphic
        .lineStyle(2, 0xffffff, 1.0);
    }

    this.flashGraphic
      .beginFill(color, 0.7)
      .drawRoundedRect(0, 0, this.w, this.h, this.w / 20)
      .endFill();
  }

  private initMultiflashDots(color: number, dotPositions: Vec2[]): void {
    destroy(this.multiflashDots);

    this.multiflashDots = this.game.add.graphics(0, 0, this.layer)
      // black dots
      .beginFill();

    const dotDiameter = this.w / (dotPlaces * 2);

    dotPositions.forEach(
      ({ x, y }) => this.multiflashDots.drawCircle(x, y, dotDiameter),
    );

    this.multiflashDots.endFill();
  }

  private brighten(duration: number): Phaser.Tween {
    return this.game.tweener.alpha(this.layer, 1, duration);
  }

  private dim(duration: number): Phaser.Tween {
    return this.game.tweener.alpha(this.layer, 0, duration);
  }

  private fadeInOut = (duration: number, fadeDuration: number): TweenWrapper => {
    if (fadeDuration > duration) {
      throw new Error('fadeInOut: `fadeDuration` should be shorter than `duration`');
    }

    const { chain, nothing } = this.game.tweener;

    return chain([
      this.brighten(fadeDuration / 2),
      nothing(duration - fadeDuration),
      this.dim(fadeDuration / 2),
    ]);
  }

  private ripple = (duration: number): TweenWrapper => {
    const { game, layer } = this;
    const { scale, chain } = game.tweener;

    const growDuration = Math.max(40, duration / 3);
    const shrinkDuration =  duration - growDuration;

    return chain([
      scale(layer, 1, growDuration),
      scale(layer, .95, shrinkDuration),
    ]);
  }

  private moveTo(position: Vec2, duration: number): Phaser.Tween {
    return this.game.tweener.position(this, position, duration);
  }

  private flash(duration: number): TweenWrapper {
    const result = this.game.tweener.merge([
      // this.ripple(duration),
      this.fadeInOut(duration, duration / 5),
    ]);

    result.onComplete.add(() => this.destroy());

    return result;
  }

  private multiflash(count: number, duration: number, color: number): TweenWrapper {
    this.initMultiflashDots(
      multiflashDotColor,
      FlashLayer.getMultiflashDotPositions(count, this.w, this.h),
    );

    return this.flash(duration);
  }

  // paths have a minimum duration of 350ms for intro/outro animations
  private path(path: Vec3[], duration: number): TweenWrapper {
    const { game } = this;
    const { scale, chain, merge, nothing } = game.tweener;
    const { plus, minus } = vec2;

    const initialDelay = 100;
    const finalDelay = 300;
    const pathStepDuration = (duration - initialDelay - finalDelay) / (path.length);

    const pathStepTweens = path.map((pos: Vec3) => this.moveTo(
      pos,
      pos.z * pathStepDuration,
    ));

    const pathTween = chain([
      this.brighten(initialDelay),
      ...pathStepTweens,
      this.dim(finalDelay / 2),
      nothing(finalDelay / 2),
    ]);

    if (this.shouldSpawnTrails()) {
      this.spawnTrails(path, pathStepDuration, initialDelay);
    }

    const result = merge([pathTween, this.ripple(duration)]);
    result.onComplete.add(() => this.destroy());

    return result;

  }

  private shouldSpawnTrails() {
    switch (this.context) {
      case 'background': return this.game.state.current === 'MainMenu';
      case 'flash': return true;
      default: return false;
    }
  }

  private spawnTrails(
    path: Vec3[],
    pathStepDuration: number,
    initialDelay: number,
  ): void {
    const { game, h, w } = this;
    const dotsPerTrail = 6;
    const trailSize = 4;

    const trailTexture = toTexture(
      game.add.graphics()
        .beginFill(0xffffff)
        .drawRect(-trailSize / 2, -trailSize / 2, trailSize, trailSize),
    );

    let step = 1;
    path.forEach((next, stepIndex) => {
      if (stepIndex === 0) {
        return;
      }

      const last = path[stepIndex - 1];
      const stepDots = dotsPerTrail * next.z - 1;
      const dotLocations = vec2.interpolate(last, next, stepDots, true);

      dotLocations.forEach(({ x, y }, dotIndex) => {
        const delay = initialDelay + pathStepDuration * (step + dotIndex / dotsPerTrail);
        this.spawnDot(game, x + w / 2, y + h / 2, delay, trailTexture);
      });

      step += next.z;
    });
  }

  private spawnDot(
    game: Game,
    x: number,
    y: number,
    delay: number,
    texture: Phaser.RenderTexture,
  ) {
    const fadeOutDelay = 250;
    const fadeOutDuration = 250;

    setTimeout(() => {
      const sprite = game.add.sprite(x, y, texture, null, this.parent);

      if (this.context === 'background') {
        sprite.alpha = 0.3;
      }

      setTimeout(() => {
        const tween = game.tweener.alpha(sprite, 0, fadeOutDuration);
        tween.onComplete.add(() => sprite.destroy());
        tween.start();
      }, fadeOutDelay);
    }, delay);
  }

  private contextColor(context: FlashLayerContext): number {
    switch (context) {
      case 'flash': return flashColor;
      case 'fake': return fakeFlashColor;
      case 'background': return backgroundFlashColor;
    }
  }

  private static getMultiflashDotPositions = (
    count: number,
    w: number,
    h: number,
  ): Vec2[] => {
    // number of potential positions for a dot to be spawned per column or row
    const xCoords = range(dotPlaces).map(n => (n + 1) / (dotPlaces + 1) * w);
    const yCoords = range(dotPlaces).map(n => (n + 1) / (dotPlaces + 1) * h);
    const coords = xprod(xCoords, yCoords);

    return sampleSize(coords, count).map(([x, y]) => ({ x, y }));
  }

  // the `z` component of the result vectors gives the taxicab
  // length of the path step corresponding to `x` and `y`
  private static mergeParallelPathMoves = (path: Vec2[]): Vec3[] => {
    const { clone, about, minus } = vec2;
    const result: Vec3[] = [];

    for (let i = 0; i < path.length; i++) {
      // we're assuming here that every step is of taxicab length 1
      const next = { ...clone(path[i]), z: 1 };

      if (i < 2) {
        result.push(next);
        continue;
      }

      const shouldMerge = about(
        minus(path[i], path[i - 1]),
        minus(path[i - 1], path[i - 2]),
      );

      if (shouldMerge) {
        const last = result.splice(result.length - 1, 1, next)[0];
        next.z += last.z;
      } else {
        result.push(next);
      }
    }

    return result;
  }
}

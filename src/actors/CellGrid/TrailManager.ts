import * as Phaser from 'phaser-ce';

interface ITrailData {
  obj: PIXI.DisplayObject;
  spawnFreq: number;
  nextSpawn: number;
}

export default class TrailManager {
  private bmp: Phaser.BitmapData;
  private ctx: CanvasRenderingContext2D;
  private trailed: ITrailData[] = [];

  constructor(
    private game: Phaser.Game,
  ) {
    this.bmp = game.add.bitmapData(game.width, game.height);
    this.ctx = this.bmp.context;

    this.bmp.addToWorld();

    this.ctx.fillStyle = '#ffffff';
  }

  public add(obj: PIXI.DisplayObject, spawnFreq: number): void {
    this.trailed.push({
      nextSpawn: spawnFreq,
      obj,
      spawnFreq,
    });
  }

  public remove(obj: PIXI.DisplayObject): void {
    for (let i = 0; i < this.trailed.length; i++) {
      if (this.trailed[i].obj === obj) {
        this.trailed.splice(i, 1);
        return;
      }
    }
  }

  private update(dt: number) {
    for (const data of this.trailed) {
      data.nextSpawn -= dt;

      if (data.nextSpawn <= 0) {
        this.spawnAtObj(data.obj);
        data.nextSpawn = data.spawnFreq;
      }
    }
  }

  private spawnAtObj(obj: PIXI.DisplayObject): void {
    this.spawn(obj.worldPosition);
  }

  private spawn({ x, y }: Vec2): void {
    this.ctx.fillRect(x - 1, y - 1, 3, 3);
    this.bmp.dirty = true;
  }
}

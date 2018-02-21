import { random, sample } from 'lodash';

export {
  chunk,
  clone,
  defaults,
  findIndex,
  flatMap,
  flatten,
  get,
  includes,
  isEqual,
  random,
  range,
  sample,
  sampleSize,
  set,
  shuffle,
  zipWith,
} from 'lodash';

export const copyArray = (arr: any[]): any[] => {
  const result = [];
  for (const item of arr) {
    result.push(item);
  }

  return result;
};

export const shiftAnchor = (obj: PIXI.DisplayObject, x: number, y: number) => {
  obj.pivot.x += x;
  obj.x += x;
  obj.pivot.y += y;
  obj.y += y;
};

// This function assumes the current anchor is at the top-left corner of the
// display object (which is where Phaser initializes it by default).
export const centerAnchor = (obj: PIXI.DisplayObject, w: number, h: number) => {
  shiftAnchor(obj, w / 2, h / 2);
};

export const mapJust = <S, T>(f: (s: S) => Maybe<T>, list: S[]): T[] => {
  const result = [];

  for (const item of list) {
    const mappedItem = f(item);

    if (mappedItem !== null) {
      result.push(mappedItem);
    }
  }

  return result;
};

export const cellTarget = (cell: GridPos): InputTarget => ({ type: 'cell', cell });

export const labelArgs = label => (...args) => console.log(label, ...args);

export const vec2 = {
  clone: (v: Vec2): Vec2 => ({ x: v.x, y: v.y }),

  interpolate: (v: Vec2, w: Vec2, points: number, inclusive: boolean = false): Vec2[] => {
    const { clone, minus, plus, scale } = vec2;
    const result = [];
    let u = clone(v);
    const du = scale(minus(w, v), 1 / (points + 1));

    for (let i = 0; i < points; i++) {
      u = plus(u, du);
      result.push(clone(u));
    }

    if (inclusive) {
      result.unshift(clone(v));
      result.push(clone(w));
    }

    return result;
  },

  minus: (v: Vec2, w: Vec2): Vec2 => ({ x: v.x - w.x, y: v.y - w.y }),

  plus: (v: Vec2, w: Vec2): Vec2 => ({ x: v.x + w.x, y: v.y + w.y }),

  scale: (v: Vec2, k: number): Vec2 => ({ x: v.x * k, y: v.y * k }),

  equals: (v: Vec2, w: Vec2): boolean => v.x === w.x && v.y === w.y,

  about: (v: Vec2, w: Vec2, eps: number = 0.01): boolean => (
    Math.abs(v.x - w.x) < eps && Math.abs(v.y - w.y) < eps
  ),
};

export const destroy = (obj?: { destroy: () => any }) => {
  if (obj !== undefined) {
    obj.destroy();
  }
};

export const xprod = <T, U>(ts: T[], us: U[]): [T, U][] => {
  const result = [];

  for (const t of ts) {
    for (const u of us) {
      result.push([t, u]);
    }
  }

  return result;
};

export const repeat = <T>(count: number, ts: T[]): T[] => {
  const result = [];

  for (let n = 0; n < count; n++) {
    for (const t of ts) {
      result.push(t);
    }
  }

  return result;
};

export const equalGridPos = (g: GridPos, h: GridPos) => (
  g.col === h.col && g.row === h.row
);

export const randomGridPos = (cols: number, rows: number): GridPos => ({
  col: random(0, cols - 1),
  row: random(0, rows - 1),
});

export const validGridPos = (
  cols: number,
  rows: number,
  { col, row }: GridPos,
): boolean => (
  col >= 0 && col < cols && row >= 0 && row < rows
);

export const adjacentGridPos = (cols, rows, { col, row }: GridPos): GridPos[] => (
  [
    { col, row: row + 1 },
    { col, row: row - 1 },
    { col: col + 1, row },
    { col: col - 1, row },
  ].filter(p => validGridPos(cols, rows, p))
);

export const intersperse = <T>(item: T, list: T[]) => {
  const result = [list[0]];

  for (let i = 1; i < list.length; i++) {
    result.push(item);
    result.push(list[i]);
  }

  return result;
};

export const clamp = (value: number, min: number, max: number): number => (
  value < min ? min :
  value > max ? max :
  value
);

export const toTexture = (graphics: Phaser.Graphics): Phaser.RenderTexture => {
  const texture = graphics.generateTexture();
  graphics.destroy();
  return texture;
};

const compact = <T>(as: T[]): T[] => as.filter(a => a === a && !!a);

export const maxNum = (nums: number[]): number => Math.max(...compact(nums));
export const minNum = (nums: number[]): number => Math.min(...compact(nums));

export const destroyAfterTween = <T extends TweenWrapper>(
  object,
  tween: T,
): T => {
  tween.onComplete.add(() => object.destroy());
  tween.start();

  return tween;
};

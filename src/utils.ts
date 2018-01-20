export {
  findIndex,
  flatten,
  includes,
  isEqual,
  random,
  sample,
  shuffle,
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
};

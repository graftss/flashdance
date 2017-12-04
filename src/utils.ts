export { flatten, isEqual, random } from 'lodash';

export const shiftAnchor = (obj: PIXI.DisplayObject, x: number, y: number) => {
  obj.pivot.x += x;
  obj.x += x;
  obj.pivot.y += y;
  obj.y += y;
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

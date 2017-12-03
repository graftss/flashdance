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
  minus: (v: Vec2, w: Vec2): Vec2 => ({ x: v.x - w.x, y: v.y - w.y }),
  plus: (v: Vec2, w: Vec2): Vec2 => ({ x: v.x + w.x, y: v.y + w.y }),
};

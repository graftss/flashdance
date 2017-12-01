import * as lodashIsEqual from 'lodash.isequal';
import * as lodashFlatten from 'lodash.flatten';

export const isEqual = lodashIsEqual;
export const flatten = lodashFlatten;

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

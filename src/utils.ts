export const shiftAnchor = (obj: PIXI.DisplayObject, x: number, y: number) => {
  obj.pivot.x += x;
  obj.x += x;
  obj.pivot.y += y;
  obj.y += y;
};

export const mapJust = <S, T>(f: (S) => Maybe<T>, list: S[]): T[] => {
  const result = [];

  for (let i = 0; i < list.length; i++) {
    const item = f(list[i]);
    if (item !== null) result.push(item);
  }

  return result;
}

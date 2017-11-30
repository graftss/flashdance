// Utility

type Maybe<T> = T | null;

type GridPos = { col: number, row: number }

// Tweening

interface ITweenableAlpha { alpha: number }

type ScaleObject = { x: number, y: number }
type ScaleTarget = number | ScaleObject
interface ITweenableScale { scale: ScaleObject }

type Radians = number
interface ITweenableRotation { rotation: number }

// Game actions

// `duration` denotes how long the action should visually appear to take.
// `delay`, if present, denotes how long after the action before the
//   next action starts.

type TweenWrapper = {
  start: Function,
  onStart: Phaser.Signal
  onComplete: Phaser.Signal,
};

type GameAction = {
  duration: number,
  tween: TweenWrapper,
}

type WaitOpts = {
  duration: number,
}

type FlashOpts = {
  duration: number,
  delay?: number,
  row: number,
  col: number,
}

type PathOpts = {
  duration: number,
  cells: GridPos[],
}

type RotateOpts = {
  duration: number,
  rotation: Radians,
}

type ReflectOpts = {
  duration: number,
  reflectX: boolean,
  reflectY: boolean,
}

type GameActionData =
  { type: 'wait', opts: WaitOpts } |
  { type: 'flash', opts: FlashOpts } |
  { type: 'fakeflash', opts: FlashOpts } |
  { type: 'path', opts: PathOpts } |
  { type: 'rotate', opts: RotateOpts } |
  { type: 'reflect', opts: ReflectOpts }

// Game input

type InputTarget =
  { type: 'cell', row: number, col: number }

type GameInput =
  { type: 'down', target: InputTarget } |
  { type: 'drag', target: InputTarget }

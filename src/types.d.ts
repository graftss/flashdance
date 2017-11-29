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

type FlashOpts = {
  duration: number,
  delay?: number,
  row: number,
  col: number,
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
  { type: 'flash', opts: FlashOpts } |
  { type: 'rotate', opts: RotateOpts } |
  { type: 'reflect', opts: ReflectOpts }

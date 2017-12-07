// Utility

type Maybe<T> = T | null;

type Dict<T> = { [key: string]: T }

type GridPos = { col: number, row: number }

type Vec2 = { x: number, y: number }

// Tweening

interface ITweenableAlpha { alpha: number }

type ScaleObject = { x: number, y: number }
type ScaleTarget = number | ScaleObject
interface ITweenableScale { scale: ScaleObject }

type Radians = number
interface ITweenableRotation { rotation: number }

interface ITweenablePosition { position: Vec2 }

// Graphical effects

type InputLightTone =
  'correct' |
  'incorrect' |
  'neutral'

type ParticleData = {
  type: 'trail',
  position: Vec2,
}

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
  origin: GridPos,
}

type PathOpts = {
  duration: number,
  origin: GridPos,
  path: GridPos[],
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
  { type: 'cell', cell: GridPos }

type GameInputSource =
  'down' | 'up' |
  'down/drag' | 'over/drag' | 'up/drag'

type RawInputSource = 'down' | 'up' | 'drag'

type GameInput = { type: GameInputSource, target: InputTarget }
type RawInput = { type: RawInputSource, target: InputTarget }

type InputPair = { expected: GameInput, observed: RawInput }

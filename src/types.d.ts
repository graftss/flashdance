// Tweening


interface ITweenableAlpha { alpha: number }

type ScaleObject = { x: number, y: number }
type ScaleTarget = number | ScaleObject
interface ITweenableScale { scale: ScaleObject }

type Radians = number
interface ITweenableRotation { rotation: number }

// Game actions

type GameAction = {
  tween: Phaser.Tween,
}

type FlashOpts = {
  row: number,
  col: number,
  duration: number,
}

type RotateOpts = {
  rotation: Radians,
  duration: number,
}

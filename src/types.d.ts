// Tweening


interface ITweenableAlpha { alpha: number }

type ScaleObject = { x: number, y: number };
type ScaleTarget = number | ScaleObject;
interface ITweenableScale { scale: ScaleObject }

interface ITweenableRotation { rotation: number }

// Cell transforms

type FlashOpts = {
  speed: number;
};

declare var PRODUCTION: boolean;

// Utility

type Maybe<T> = T | null;

type Dict<T> = { [key: string]: T }

type GridPos = { col: number, row: number }

type Vec2 = { x: number, y: number }

type Vec3 = { x: number, y: number, z: number }

// Save Data

type SaveData = {
  achievements: {};
  courses: { [courseId: string]: CourseHistory };
};

type CourseResult = {
  completed: boolean;
  courseId: number;
  difficultyReached: number;
  highestCombo: number;
  livesLost: number;
};

type CourseHistory = {
  completed: boolean;
  difficultyReached: number;
  livesLost: number;
  highestCombo: number;
};

type CourseScore = {
  combo: number;
  difficulty: number;
  lives: number;
};

// UI

type MenuTextOptionData = {
  height?: number;
  label: string;
  onSelect: (g: GridPos) => void;
  textStyle?: Phaser.PhaserTextStyle;
  type: 'text';
};

type MenuGroupOptionData = {
  group: Phaser.Group;
  height?: number;
  type: 'group';
  width: number;
};

type MenuOptionData =
  MenuTextOptionData |
  MenuGroupOptionData;

type MenuID =
  'option' |
  'practice' |
  'title' |
  'course' |
  'course list';

interface IDoubleSliderEvent {
  left: number;
  leftDiscrete?: number;
  right: number;
  rightDiscrete?: number;
}

// Tweening

interface ITweenableAlpha { alpha: number }

type ScaleObject = { x: number, y: number }
type ScaleTarget = number | ScaleObject
interface ITweenableScale { scale: ScaleObject }

type Radians = number
interface ITweenableRotation { rotation: number }

interface ITweenablePosition { position: Vec2 }

interface ITweenableTint { tint: number }

// Graphical effects

type InputLightTone =
  'correct' |
  'incorrect' |
  'neutral'

type ParticleData = {
  type: 'trail',
  position: Vec2,
}

// Game levels

type EasyCourse =
  'flash' |
  'path' |
  'fake flash' |
  'multiflash' |
  'rotate' |
  'reflect' |
  'x-reflect';

type CourseType =
  'easy' |
  'hard' |
  'impossible' |
  'debug';

type CourseData = {
  endless?: boolean;
  id: number;
  immortal?: boolean;
  gridCols: number;
  gridRows: number;
  level: string;
  lives: number;
  minDifficulty: number;
  maxDifficulty: number;
  type: CourseType
}

// Game actions

// `duration` denotes how long the action should visually appear to take.
// `delay`, if present, denotes how long after the action before the
//   next action starts.

type TweenWrapper = {
  start: Function,
  onStart: Phaser.Signal,
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
  origin: GridPos,
  fakes?: GridPos[],
}

type MultiflashOpts = {
  count: number,
  duration: number,
  origin: GridPos,
}

type PathOpts = {
  duration: number,
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
  { type: 'multiflash', opts: MultiflashOpts } |
  { type: 'path', opts: PathOpts } |
  { type: 'rotate', opts: RotateOpts } |
  { type: 'reflect', opts: ReflectOpts }

type GameActionContext = {
  action: GameAction,
  index: number,
}

interface IActionSequencer {
  randomRound: (difficulty: number) => GameActionData[];
}

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

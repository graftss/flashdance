import debugCourses from './courses-debug';

const easyCommonData = {
  gridCols: 3,
  gridRows: 3,
  lives: 5,
  maxDifficulty: 10,
  minDifficulty: 1,
  type: 'easy' as 'easy',
};

const easyCourses = [
  { id: 0, level: 'flash' },
  { id: 1, level: 'path' },
  { id: 2, level: 'fake flash' },
  { id: 3, level: 'multiflash' },
  { id: 4, level: 'rotate' },
  { id: 5, level: 'reflect' },
  { id: 6, level: 'x-reflect' },
  { id: 7, level: 'flash 2' }, // rotate + reflect
  { id: 8, level: 'flash 3' }, // rotate + x-reflect
  { id: 11, level: 'flash 4' }, // rotated + reflected + fake
  { id: 9, level: 'path 2' }, // reflected path
  { id: 10, level: 'path 3' }, // rotated path
].map(obj => ({ ...easyCommonData, ...obj }));

const hardCommonData = {
  gridCols: 4,
  gridRows: 4,
  lives: 5,
  maxDifficulty: 15,
  minDifficulty: 1,
  type: 'hard' as 'hard',
};

const hardCourses: CourseData[] = [
  { id: 12, level: 'long path' },
  { id: 13, level: 'flash 5' },
  { id: 14, level: 'dizzy' },
  { id: 15, level: 'squint', gridCols: 6, gridRows: 6 },
  { id: 16, level: 'so fake' },
  { id: 17, level: 'jesus' },
  { id: 18, level: 'fast' },
  { id: 19, level: 'long path 2', maxDifficulty: 10 },
].map(obj => ({ ...hardCommonData, ...obj }));

export const courses: CourseData[] = [
  ...easyCourses,
  ...hardCourses,
];

const all: CourseData[] = PRODUCTION ? courses : courses.concat(debugCourses);

export default all;

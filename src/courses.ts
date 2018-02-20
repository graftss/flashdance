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
  { id: 9, level: 'path 2' }, // reflected path
  { id: 8, level: 'flash 3' }, // rotate + x-reflect
  { id: 10, level: 'path 3' }, // rotated path
  { id: 11, level: 'flash 4' }, // rotated + reflected + fake
].map(obj => ({ ...easyCommonData, ...obj }));

export const courses: CourseData[] = [
  ...easyCourses,
];

export default PRODUCTION ? courses : [...courses, ...debugCourses];

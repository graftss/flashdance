const debugData: CourseData = {
  endless: true,
  gridCols: 3,
  gridRows: 3,
  id: 999,
  level: 'debug',
  lives: 5,
  maxDifficulty: 3,
  minDifficulty: 1,
  type: 'debug',
};

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
  { id: 7, level: 'rotated path' },
].map(obj => ({ ...easyCommonData, ...obj }));

const debugCourses: CourseData[] = [
  ...easyCourses,
  debugData,
];

export default debugCourses;

const tutorialData = {
  gridCols: 3,
  gridRows: 3,
  lives: 5,
  maxDifficulty: 10,
  minDifficulty: 1,
  type: 'tutorial' as 'tutorial', // lol
};

const courses: CourseData[] = [
  {
    id: 0,
    level: 'flash' as TutorialCourse,
    ...tutorialData,
  },
  {
    id: 1,
    level: 'path' as TutorialCourse,
    ...tutorialData,
  },
  {
    id: 2,
    level: 'fake flash' as TutorialCourse,
    ...tutorialData,
  },
  {
    id: 3,
    level: 'multiflash' as TutorialCourse,
    ...tutorialData,
  },
  {
    id: 4,
    level: 'rotate' as TutorialCourse,
    ...tutorialData,
  },
  {
    id: 5,
    level: 'reflect' as TutorialCourse,
    ...tutorialData,
  },
  {
    id: 6,
    level: 'x-reflect' as TutorialCourse,
    ...tutorialData,
  },
];

export default courses;

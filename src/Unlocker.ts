import Game from './Game';

const courseIds = {
  tutorial: {
    flash: '1',
  },
};

export default class Unlocker {
  constructor(
    public game: Game,
  ) {
    this.initEventHandlers();
  }

  private initEventHandlers(): void {
    this.game.eventBus.gameCourseComplete.add(this.onCourseComplete);
  }

  private onCourseComplete = (courseData: CourseData): void => {
    const { type, data: { level } } = courseData;
    const courseId = courseIds[type][level];

    this.game.updateSaveData((saveData: SaveData) => {
      saveData.completedCourses[courseId] = 1;
      return saveData;
    });
  }
}

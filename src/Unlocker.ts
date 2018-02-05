import courses from './courses';
import Game from './Game';

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
    const { id } = courseData;

    this.game.updateSaveData((saveData: SaveData) => {
      saveData.completedCourses[id] = 1;
      return saveData;
    });
  }
}

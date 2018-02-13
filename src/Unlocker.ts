import courses from './courses';
import Game from './Game';

export default class Unlocker {
  constructor(
    public game: Game,
  ) {
    this.initEventHandlers();
  }

  private initEventHandlers(): void {
    this.game.eventBus().play.courseComplete.add(this.onCourseComplete);
  }

  private onCourseComplete = (
    courseResult: CourseResult,
  ): void => {
    this.game.saveFile.updateCourseHistory(courseResult.courseId, courseResult);
  }
}

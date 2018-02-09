import Menu from '../../ui/Menu';

import courses from '../../courses';
import Game from '../../Game';

export default class CourseMenu extends Menu {
  private startCourse: (CourseData) => void;

  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
    courseIdColumns: number[][],
    startCourse: (courseData: CourseData) => void,
    id: MenuID,
  ) {
    const idToOption = CourseMenu.courseIdToOptionData(game, startCourse);
    const optionDataColumns = courseIdColumns.map(col => col.map(idToOption));

    super(game, x, y, rowHeight, optionDataColumns, id);

    this.startCourse = startCourse;
  }

  private static courseIdToOptionData = (game: Game, startCourse) => (
    (courseId: number): MenuOptionData => {
      const courseData = courses[courseId];
      const unlocked = game.saveFile.isCourseUnlocked(courseId);
      const completed = game.saveFile.isCourseCompleted(courseId);

      const label = unlocked ? courseData.level : 'locked';
      const onSelect = () => unlocked && startCourse(courseData);
      const textStyle = CourseMenu.getOptionTextStyle(unlocked, completed);

      return { label, onSelect, textStyle };
    }
  )

  private static getOptionTextStyle(unlocked: boolean, completed: boolean) {
    if (!unlocked) {
      return { fill: 'red' };
    } else if (completed) {
      return { fill: 'green' };
    } else {
      return {};
    }
  }
}

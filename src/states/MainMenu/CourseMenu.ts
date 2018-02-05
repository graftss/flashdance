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
    startCourse: (CourseData) => void,
  ) {
    const idToOption = CourseMenu.courseIdToOptionData(game, startCourse);
    const optionDataColumns = courseIdColumns.map(col => col.map(idToOption));

    super(game, x, y, rowHeight, optionDataColumns);

    this.startCourse = startCourse;
  }

  private static courseIdToOptionData = (game: Game, startCourse) =>
    (courseId: number): MenuOptionData => {
      const courseData = courses[courseId];
      const label = courseData.level;
      const onSelect = () => startCourse(courseData);

      return { label, onSelect };
  }
}

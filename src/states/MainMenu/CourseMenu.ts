import Menu from '../../ui/Menu';

import courses from '../../courses';
import Game from '../../Game';

export default class CourseMenu extends Menu {
  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
    courseIdColumns: number[][],
  ) {
    const idToOption = CourseMenu.courseIdToOptionData(game);
    const optionDataColumns = courseIdColumns.map(col => col.map(idToOption));

    super(game, x, y, rowHeight, optionDataColumns);
  }

  private static courseIdToOptionData = (game: Game) => (courseId: number): MenuOptionData => {
    return {
      label: courses[courseId].level,
      onSelect: () => console.log('hi selected', courses[courseId]),
    };
  }
}

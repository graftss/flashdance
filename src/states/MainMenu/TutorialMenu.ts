import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import CourseMenu from './CourseMenu';

const tutorialMenuID: MenuID = 'tutorial';
const tutorialCourseIdColumns = [[0, 1, 2, 3], [4, 5, 6]];

export default class TutorialMenu extends CourseMenu {
  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
  ) {
    super(
      game,
      x, y,
      rowHeight,
      tutorialCourseIdColumns,
      TutorialMenu.startCourse(game),
      tutorialMenuID,
    );

    this.addMenuOption(1, this.getBackOptionData());
  }

  private static startCourse = (game: Game) => (courseData: CourseData) => {
    game.eventBus().menu.startCourse.dispatch(courseData);
  }
}

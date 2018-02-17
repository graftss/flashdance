import * as Phaser from 'phaser-ce';

import courses from '../../courses';
import Game from '../../Game';
import Menu from '../../ui/Menu';
import { chunk, zipWith } from '../../utils';

const courseListMenuID: MenuID = 'course list';
const courseTypes: CourseType[] = ['tutorial', 'challenge', 'debug'];

export default class CourseListMenu extends Menu {
  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public rowHeight: number,
  ) {
    super(game, x, y, rowHeight, [], 'course list');

    this.setOptionColumns(this.getOptionDataColumns('tutorial'));
  }

  private getOptionDataColumns(type: CourseType): MenuOptionData[][] {
    const courseTypeData = courseTypes.map(this.getCourseTypeOptionData);
    const coursesData = courses
      .filter(c => c.type === type)
      .map(this.getCourseOptionData);

    const result = zipWith(courseTypeData, chunk(coursesData, 3), (t, c) => (
      [t, ...c]
    ));

    return result;
  }

  private getCourseTypeOptionData = (type: CourseType): MenuOptionData => {
    return {
      label: type,
      onSelect: () => {
        console.log('selected', courses.filter(c => c.type === type));
      },
      textStyle: { fontSize: this.rowHeight * 1.5 },
      type: 'text',
    };
  }

  private getCourseOptionData = (course: CourseData): MenuOptionData => {
    return {
      label: course.level,
      onSelect: () => console.log('selected', course.level),
      textStyle: { fontSize: this.rowHeight },
      type: 'text',
    };
  }
}

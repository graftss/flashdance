import * as Phaser from 'phaser-ce';

import courses from '../../courses';
import Game from '../../Game';
import Menu from '../../ui/Menu';
import MenuTextOption from '../../ui/MenuTextOption';
import TypedSignal from '../../TypedSignal';
import { chunk, zipWith } from '../../utils';

const courseListMenuID: MenuID = 'course list';
const courseTypes: CourseType[] = ['tutorial', 'challenge', 'debug'];

interface ICourseTypeClickEvent {
  option: MenuTextOption;
  type: CourseType;
}

interface ICourseClickEvent {
  courseData: CourseData;
  option: MenuTextOption;
}

export default class CourseListMenu extends Menu {
  public onCourseTypeClick: TypedSignal<ICourseTypeClickEvent> = new TypedSignal();
  public onCourseClick: TypedSignal<ICourseClickEvent> = new TypedSignal();

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public rowHeight: number,
  ) {
    super(game, x, y, rowHeight, [], 'course list');

    this.onCourseTypeClick.add(this.selectCourseType);
    this.onCourseClick.add(this.selectCourse);

    this.setOptionColumns(this.getOptionDataColumns());
  }

  private getOptionDataColumns(type?: CourseType): MenuOptionData[][] {
    const courseTypeData = courseTypes.map(this.getCourseTypeOptionData);

    if (type === undefined) {
      return courseTypeData.map(opt => [opt]);
    }

    const coursesData = courses
      .filter(c => c.type === type)
      .map(this.getCourseOptionData);

    const result = zipWith(
      courseTypeData,
      chunk(coursesData, Math.ceil(coursesData.length / courseTypeData.length)),
      (t, c = []) => [t, ...c],
    );

    return result;
  }

  private getCourseTypeOptionData = (type): MenuOptionData => {
    return {
      height: this.game.height / 8,
      label: type,
      onSelect: option => this.onCourseTypeClick.dispatch({ option, type }),
      textStyle: { fontSize: this.rowHeight * 1.5 },
      type: 'text',
    };
  }

  private getCourseOptionData = (courseData): MenuOptionData => {
    return {
      height: this.game.height / 12,
      label: courseData.level,
      onSelect: option => this.onCourseClick.dispatch({ courseData, option }),
      textStyle: { fontSize: this.rowHeight },
      type: 'text',
    };
  }

  private selectCourseType = ({ type }): void => {
    const colIndex = courseTypes.indexOf(type);
    this.setOptionColumns(this.getOptionDataColumns(type));
    this.updateMenuOption(colIndex, 0, (o: MenuTextOption) => o.highlight());
  }

  private selectCourse = ({ courseData, option }): void => {
    console.log('whoopee');
  }
}

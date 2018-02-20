import * as Phaser from 'phaser-ce';

import courses from '../../courses';
import Game from '../../Game';
import Menu from '../../ui/Menu';
import MenuTextOption from '../../ui/MenuTextOption';
import TypedSignal from '../../TypedSignal';
import { chunk, zipWith } from '../../utils';

const courseListMenuID: MenuID = 'course list';
const courseTypes: CourseType[] = PRODUCTION ?
  ['easy', 'hard', 'impossible'] :
  ['easy', 'hard', 'impossible', 'debug'];

interface ICourseTypeClickEvent {
  gridPos: GridPos;
  type: CourseType;
}

interface ICourseClickEvent {
  courseData: CourseData;
  gridPos: GridPos;
}

export default class CourseListMenu extends Menu {
  public onCourseTypeDown: TypedSignal<ICourseTypeClickEvent> = new TypedSignal();
  public onCourseDown: TypedSignal<ICourseClickEvent> = new TypedSignal();

  private selectedCourseType: CourseType;
  private selectedCourse: GridPos;

  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public rowHeight: number,
  ) {
    super(game, x, y, rowHeight, []);

    this.onCourseTypeDown.add(this.selectCourseType);
    this.onCourseDown.add(this.selectCourse);

    this.setOptionColumns(this.getOptionDataColumns());
  }

  private getOptionDataColumns(type?: CourseType): MenuOptionData[][] {
    const courseTypeData = courseTypes.map(this.getCourseTypeOptionData);

    // if no `type` is passed in, show only the course types, and not
    // any courses
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
      onSelect: gridPos => this.onCourseTypeDown.dispatch({ gridPos, type }),
      textStyle: { fontSize: this.rowHeight * 1.5 },
      type: 'text',
    };
  }

  private getCourseOptionData = (courseData): MenuOptionData => {
    const unlocked = this.game.saveFile.isCourseUnlocked(courseData);
    const label = unlocked ? courseData.level : 'locked';
    const textStyle = unlocked ? {} : { fill: 'red' };

    return {
      height: this.game.height / 12,
      label,
      onSelect: gridPos => {
        if (unlocked) {
          this.onCourseDown.dispatch({ courseData, gridPos });
        }
      },
      textStyle: { ...textStyle, fontSize: this.rowHeight },
      type: 'text',
    };
  }

  private selectCourseType = ({ type }): void => {
    if (type === this.selectedCourseType) {
      return;
    }

    const colIndex = courseTypes.indexOf(type);

    this.selectedCourse = undefined;
    this.selectedCourseType = type;
    this.setOptionColumns(this.getOptionDataColumns(type));
    this.updateMenuOption(colIndex, 0, (o: MenuTextOption) => o.highlight());
  }

  private selectCourse = ({ courseData, gridPos }): void => {
    const { col, row } = gridPos;

    if (this.selectedCourse) {
      const { col: oldCol, row: oldRow } = this.selectedCourse;
      this.updateMenuOption(oldCol, oldRow, (o: MenuTextOption) => o.unHighlight());
    }

    this.selectedCourse = gridPos;
    this.updateMenuOption(col, row, (o: MenuTextOption) => o.highlight());
  }
}

import * as Phaser from 'phaser-ce';

import courses from '../../courses';
import Game from '../../Game';
import Menu from '../../ui/Menu';
import MenuTextOption from '../../ui/MenuTextOption';
import TargetBox from '../../ui/TargetBox';
import TypedSignal from '../../TypedSignal';
import { chunk, destroy, equalGridPos, zipWith } from '../../utils';

const courseListMenuID: MenuID = 'course list';
const courseTypes: CourseType[] = PRODUCTION ?
  ['easy', 'hard', 'impossible'] :
  ['easy', 'hard', 'impossible'];

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

  private selectedCourseType: GridPos;
  private selectedCourse: GridPos;
  private courseTypeTargetBox: TargetBox;
  private courseTargetBox: TargetBox;
  private selectedCourseColorTween: Phaser.Tween;

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

  private getCourseTypeOptionData = (type: CourseType): MenuOptionData => {
    return {
      height: this.game.height / 8,
      label: type,
      onSelect: gridPos => this.onCourseTypeDown.dispatch({ gridPos, type }),
      textStyle: { fontSize: this.rowHeight * 1.5 },
      type: 'text',
    };
  }

  private getCourseOptionData = (courseData: CourseData): MenuOptionData => {
    const unlocked = this.game.saveFile.isCourseUnlocked(courseData);
    const completed = this.game.saveFile.isCourseCompleted(courseData);
    const label = unlocked ? courseData.level : 'locked';
    const textStyle = completed ?
      { fill: '#66ff66' } :
      unlocked ? {} : { fill: 'red' };

    return {
      height: this.game.height / 12,
      label,
      onSelect: gridPos => {
        if (unlocked) {
          this.onCourseDown.dispatch({ courseData, gridPos });
        }
      },
      textStyle: { fontSize: this.rowHeight, ...textStyle },
      type: 'text',
    };
  }

  private selectCourseType = (
    { type, gridPos }: { type: CourseType, gridPos: GridPos },
  ): void => {
    const { col, row } = gridPos;
    const yDelta = 10;

    if (this.selectedCourseType !== undefined) {
      const { col: oldCol, row: oldRow } = this.selectedCourseType;
      if (col === oldCol && row === oldRow) {
        return;
      }

      const oldOpt = this.getMenuOption(oldCol, oldRow) as MenuTextOption;
      this.game.tweener.positionBy(oldOpt.text, { x: 0, y: yDelta }, 100).start();
      oldOpt.unHighlight();
    }

    // keep the course types alive
    const keepAlivePositions = courseTypes.map((_, index) => ({
      col: index,
      row: 0,
    }));

    this.setOptionColumns(
      this.getOptionDataColumns(type),
      keepAlivePositions,
    );

    const selectedOpt = this.getMenuOption(col, row) as MenuTextOption;
    selectedOpt.highlight(undefined, 1.3);
    this.game.tweener.positionBy(selectedOpt.text, { x: 0, y: -yDelta }, 100).start();

    for (let i = 0; i < courseTypes.length; i++) {
      if (i === col) {
        continue;
      }

      const courseTypeOpt = this.getMenuOption(i, 0) as MenuTextOption;
      courseTypeOpt.tweenTextScale(0.7);
    }

    this.selectedCourse = undefined;
    this.selectedCourseType = gridPos;
    this.destroyCourseTargetBox();
  }

  private selectCourse = ({ courseData, gridPos }): void => {
    const { col, row } = gridPos;

    if (this.selectedCourse !== undefined) {
      const { col: oldCol, row: oldRow } = this.selectedCourse;
      const oldOption = this.getMenuOption(oldCol, oldRow) as MenuTextOption;

      if (col === oldCol && row === oldRow) {
        return;
      }

      oldOption.unHighlight();
    }

    this.selectedCourse = gridPos;

    const opt = this.getMenuOption(col, row) as MenuTextOption;
    const { height, width, x, y } = opt.text.getBounds();
    const yOffsetHack = this.getMenuOption(0, 1).y + 8;

    opt.highlight();
    this.moveTargetBox(x - 2, y - yOffsetHack, width, height);
  }

  private initTargetBox(): void {
    this.courseTargetBox = new TargetBox(this.game, this, 0, 0, 0, 0);
  }

  private destroyCourseTargetBox(): void {
    destroy(this.courseTargetBox);
    this.courseTargetBox = undefined;
  }

  private moveTargetBox(x: number, y: number, w: number, h: number): void {
    const moveDuration = 100;

    if (this.courseTargetBox === undefined) {
      this.initTargetBox();
    }

    this.courseTargetBox.moveAndResizeTo(x, y, w, h, moveDuration);
  }
}

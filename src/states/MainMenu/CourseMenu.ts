import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import CourseListMenu from './CourseListMenu';
import Menu from '../../ui/Menu';
import MenuTextOption from '../../ui/MenuTextOption';
import SlidingLink from '../../ui/SlidingLink';

export default class CourseMenu extends Menu {
  private courseListMenu: CourseListMenu;
  private selectedCourseData: CourseData;
  private selectedCourseType: CourseType;
  private startLink: SlidingLink;

  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
  ) {
    super(game, x, y, rowHeight, [[]]);

    this.initCourseListMenu();
    this.initMenuOptions();
  }

  private initCourseListMenu(): void {
    this.courseListMenu = new CourseListMenu(this.game, 0, 0, 30);

    this.courseListMenu.onCourseTypeDown.add(({ type }) => {
      if (type !== this.selectedCourseType) {
        this.selectedCourseType = type;
        this.startLink.hide();
      }
    });

    this.courseListMenu.onCourseDown.add(({ courseData }) => {
      const { selectedCourseData } = this;

      if (!this.startLink.slideInProgress && !this.startLink.inFinalPosition) {
        this.startLink.slide();
      }

      if (!selectedCourseData || courseData.id !== selectedCourseData.id) {
        this.selectedCourseData = courseData;
      }
    });
  }

  private initMenuOptions(): void {
    const { game } = this;

    const optionColumnData: MenuOptionData[][] = [
      [
        {
          group: this.courseListMenu,
          height: game.height / 2,
          type: 'group',
          width: game.width,
        },
        {
          label: 'start',
          onSelect: this.dispatchStartCourse,
          type: 'text',
        },
        this.getBackOptionData(),
      ],
    ];

    this.setOptionColumns(optionColumnData);

    this.startLink = new SlidingLink(
      game,
      this.getMenuOption(0, 1) as MenuTextOption,
    );
  }

  private dispatchStartCourse = () => {
    const { selectedCourseData: courseData } = this;

    if (courseData !== undefined) {
      this.game.eventBus().menu.startCourse.dispatch(courseData);
    }
  }
}

import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import CourseListMenu from './CourseListMenu';
import Menu from '../../ui/Menu';
import MenuTextOption from '../../ui/MenuTextOption';

const tutorialCourseIdColumns = [[0, 1, 2, 3], [4, 5, 6]];

export default class CourseMenu extends Menu {
  private courseListMenu: CourseListMenu;
  private selectedCourseData: CourseData;
  private selectedCourseType: CourseType;
  private startLinkShown: boolean = false;

  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
  ) {
    super(game, x, y, rowHeight, [[]]);

    this.initCourseListMenu();

    this.setOptionColumns([
      [
        {
          group: this.courseListMenu,
          height: game.height / 2,
          type: 'group',
          width: game.width,
        },
        {
          label: '',
          onSelect: () => {
            const { selectedCourseData } = this;
            if (selectedCourseData !== undefined) {
              this.dispatchStartCourse(selectedCourseData);
            }
          },
          type: 'text',
        },
        this.getBackOptionData(),
      ],
    ]);
  }

  private initCourseListMenu(): void {
    this.courseListMenu = new CourseListMenu(this.game, 0, 0, 30);

    this.courseListMenu.onCourseTypeDown.add(({ type }) => {
      if (type !== this.selectedCourseType) {
        this.selectedCourseType = type;
        this.hideStartLink();
      }
    });

    this.courseListMenu.onCourseDown.add(({ courseData }) => {
      const { selectedCourseData } = this;

      if (!this.startLinkShown) {
        this.showStartLink();
      }

      if (!selectedCourseData || courseData.id !== selectedCourseData.id) {
        this.selectedCourseData = courseData;
      }
    });
  }

  private showStartLink(): void {
    this.updateMenuOption(0, 1, (o: MenuTextOption) => {
      o.text.setText('start');
      o.position.x += this.game.width;

      const tween = this.game.tweener.positionBy(
        o,
        { x: -this.game.width, y: 0 },
        500,
      );

      tween.onComplete.add(() => this.startLinkShown = true);
      tween.start();
    });
  }

  private hideStartLink(): void {
    this.updateMenuOption(0, 1, (o: MenuTextOption) => {
      o.text.setText('');
      this.startLinkShown = false;
    });
  }

  private dispatchStartCourse(courseData: CourseData) {
    this.game.eventBus().menu.startCourse.dispatch(courseData);
  }
}

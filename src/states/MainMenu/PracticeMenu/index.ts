import * as Phaser from 'phaser-ce';

import CourseListMenu from '../CourseListMenu';
import Game from '../../../Game';
import DifficultySlider from './DifficultySlider';
import Menu from '../../../ui/Menu';
import MenuTextOption from '../../../ui/MenuTextOption';
import SlidingLink from '../../../ui/SlidingLink';
import { chunk, destroy } from '../../../utils';

const practiceMenuID: MenuID = 'practice';

export default class OptionMenu extends Menu {
  private courseListMenu: CourseListMenu;
  private difficultySlider: DifficultySlider;
  private displayedCourseData: CourseData;
  private startLink: SlidingLink;

  private startCourseDispatched: boolean = false;

  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
  ) {
    super(game, x, y, rowHeight, []);

    this.initCourseListMenu();
    this.initDifficultySlider();
    this.setOptionColumns(this.getOptionDataColumns());

    this.startLink = new SlidingLink(
      game,
      this.getMenuOption(0, 2) as MenuTextOption,
    );
  }

  private initCourseListMenu(): void {
    this.courseListMenu = new CourseListMenu(this.game, 0, 0, 50);

    this.courseListMenu.onCourseTypeDown.add(() => {
      this.difficultySlider.hide();
    });

    this.courseListMenu.onCourseDown.add(({ courseData }) => {
      const { minDifficulty } = courseData;
      const { difficultyReached } = this.game.saveFile.getCourseHistory(courseData.id);

      this.displayedCourseData = courseData;
      this.difficultySlider.init(minDifficulty, difficultyReached);

      if (!this.startLink.inFinalPosition) {
        this.startLink.slide();
      }
    });
  }

  private initDifficultySlider(): void {
    this.difficultySlider = new DifficultySlider(this.game);
  }

  private getOptionDataColumns(): MenuOptionData[][] {
    return [
      [
        {
          group: this.courseListMenu,
          height: this.game.height / 2.2,
          type: 'group',
          width: this.game.width,
        },

        {
          group: this.difficultySlider,
          height: this.game.width / 9,
          type: 'group',
          width: this.game.width,
        },
        {
          label: 'start',
          onSelect: this.onStart,
          type: 'text',
        },
        this.getBackOptionData(),
      ],
    ];
  }

  private onStart = () => {
    if (this.startCourseDispatched) {
      return;
    }

    const {
      maxDifficulty,
      minDifficulty,
    } = this.difficultySlider.getValues();

    const courseData: CourseData = {
      ...this.displayedCourseData,
      endless: true,
      immortal: true,
      lives: 1,
      maxDifficulty,
      minDifficulty,
    };

    this.game.eventBus().menu.startCourse.dispatch(courseData);
    this.startCourseDispatched = true;
  }
}

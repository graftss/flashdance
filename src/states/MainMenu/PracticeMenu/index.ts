import * as Phaser from 'phaser-ce';

import CourseListMenu from './CourseListMenu';
import Game from '../../../Game';
import DifficultySlider from './DifficultySlider';
import Menu from '../../../ui/Menu';
import MenuTextOption from '../../../ui/MenuTextOption';
import { chunk, destroy } from '../../../utils';

const practiceMenuID: MenuID = 'practice';

export default class OptionMenu extends Menu {
  private courseListMenu: CourseListMenu;
  private difficultySlider: DifficultySlider;
  private displayedCourseData: CourseData;

  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
  ) {
    super(game, x, y, rowHeight, [], practiceMenuID);

    this.initCourseListMenu();
    this.initDifficultySlider();
    this.setOptionColumns(this.getOptionDataColumns());
  }

  private initCourseListMenu(): void {
    this.courseListMenu = new CourseListMenu(this.game, 0, 0, 40);

    this.courseListMenu.onCourseTypeClick.add(() => {
      this.difficultySlider.hide();
    });

    this.courseListMenu.onCourseClick.add(({ courseData }) => {
      const { maxDifficulty, minDifficulty } = courseData;

      this.displayedCourseData = courseData;
      this.difficultySlider.init(minDifficulty, maxDifficulty);
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
          height: this.game.height / 2.5,
          type: 'group',
          width: this.game.width,
        },

        {
          group: this.difficultySlider,
          height: this.game.width / 7,
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
  }
}

import * as Phaser from 'phaser-ce';

import CourseListMenu from './CourseListMenu';
import Game from '../../Game';
import DoubleSlider from '../../ui/DoubleSlider';
import Menu from '../../ui/Menu';
import MenuTextOption from '../../ui/MenuTextOption';
import { chunk } from '../../utils';

const practiceMenuID: MenuID = 'practice';

export default class OptionMenu extends Menu {
  private courseListMenu: CourseListMenu;
  private difficultySlider: DoubleSlider;

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
  }

  private initDifficultySlider(): void {
    this.difficultySlider = new DoubleSlider(
      this.game,
      this,
      20, 0,
      500, 20,
      30,
    );

    this.difficultySlider.onChange.add(this.onDifficultySliderChange);
  }

  private onDifficultySliderChange = (data: IDoubleSliderEvent) => {
    const { leftDiscrete: l, rightDiscrete: r } = data;

    // dependent on the ordering of this menu's columns - fragile
    this.updateMenuOption(0, 2, (textOption: MenuTextOption) => {
      textOption.text.setText(`difficulty range: ${l}-${r}`);
    });
  }

  private getOptionDataColumns(): MenuOptionData[][] {
    return [
      [
        {
          group: this.courseListMenu,
          height: this.game.height / 4,
          type: 'group',
          width: this.game.width,
        },
        {
          label: '',
          onSelect: () => 0,
          type: 'text',
        },
        {
          label: 'difficulty range',
          onSelect: () => 0,
          type: 'text',
        },
        {
          group: this.difficultySlider,
          type: 'group',
          width: 500,
        },
        this.getBackOptionData(),
      ],
    ];
  }
}

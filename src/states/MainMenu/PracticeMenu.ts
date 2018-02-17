import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import DoubleSlider from '../../ui/DoubleSlider';
import Menu from '../../ui/Menu';

const practiceMenuID: MenuID = 'practice';

export default class OptionMenu extends Menu {
  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
  ) {
    super(game, x, y, rowHeight, [], practiceMenuID);

    this.setOptionColumns(this.getOptionDataColumns());
  }

  private getOptionDataColumns(): MenuOptionData[][] {
    const slider = new DoubleSlider(
      this.game,
      this,
      20, 0,
      500, 20,
      30,
    );
    slider.onChange.add(data => console.log(data));

    return [
      [
        {
          group: slider,
          type: 'group',
          width: 500,
        },
        this.getBackOptionData(),
      ],
    ];
  }
}

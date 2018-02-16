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

    const slider = new DoubleSlider(
      game,
      this,
      20, 0,
      500, 20,
      30,
    );

    const slider2 = new DoubleSlider(
      game,
      this,
      20, 50,
      500, 20,
      10,
    );

    slider.onChange.add(data => console.log(data));
  }

  private getOptionDataColumns(): MenuOptionData[][] {
    return [
      [
        this.getBackOptionData(),
      ],
    ];
  }
}

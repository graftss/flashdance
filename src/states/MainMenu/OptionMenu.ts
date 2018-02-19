import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import Menu from '../../ui/Menu';
import MenuTextOption from '../../ui/MenuTextOption';

export default class OptionMenu extends Menu {
  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
  ) {
    super(game, x, y, rowHeight, []);

    this.setOptionColumns(this.getOptionDataColumns());
  }

  private getOptionDataColumns(): MenuOptionData[][] {
    let confirmDeleteSavedData = false;

    return [[
      {
        label: 'delete saved data',
        onSelect: () => {
          if (!confirmDeleteSavedData) {
            confirmDeleteSavedData = true;
            this.updateMenuOption(0, 0, (option: MenuTextOption) => {
              // an insane hack because phaser sucks at text
              option.text.setText('you sure?');
              option.alpha = 0.01;

              setTimeout(() => option.alpha = 1, 250);
            });
          } else {
            confirmDeleteSavedData = false;
            this.game.saveFile.clearSave();
            this.updateMenuOption(0, 0, (option: MenuTextOption) => {
              option.text.setText('delete saved data');
              option.alpha = 0.01;

              setTimeout(() => option.alpha = 1, 250);
            });
          }
        },
        type: 'text',
      },
      {
        label: 'colorblind mode',
        onSelect: () => console.log('toggling colourblind mode'),
        type: 'text',
      },
      this.getBackOptionData(),
    ]];
  }
}

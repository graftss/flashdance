import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import Menu from '../../ui/Menu';

const titleMenuID: MenuID = 'title';

export default class TitleMenu extends Menu {
  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
  ) {
    const optionDataColumns = TitleMenu.getOptionDataColumns(game);

    super(game, x, y, rowHeight, optionDataColumns, titleMenuID);
  }

  private static getOptionDataColumns(game: Game): MenuOptionData[][] {
    const { pushMenu, popMenu } = game.eventBus().menu;
    const tutorialCompleted = game.saveFile.isTutorialCompleted();

    return [[
      {
        label: 'tutorials',
        onSelect: () => {
          pushMenu.dispatch('tutorial');
        },
        textStyle: {
          fill: tutorialCompleted ? 'green' : undefined,
        },
      },
      {
        label: 'challenges',
        onSelect: () => {
          console.log('open challenge menu');
        },
      },
      {
        label: 'arcade',
        onSelect: () => {
          console.log('open arcade menu');
        },
      },
      {
        label: 'practice',
        onSelect: () => {
          console.log('open practice menu');
        },
      },
      {
        label: 'options',
        onSelect: () => {
          pushMenu.dispatch('option');
        },
      },
    ]];
  }
}

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
    super(game, x, y, rowHeight, [], titleMenuID);

    this.setOptionColumns(this.getOptionDataColumns());
  }

  private getOptionDataColumns(): MenuOptionData[][] {
    const { game } = this;
    const { pushMenu, popMenu } = game.eventBus().menu;
    const tutorialCompleted = game.saveFile.isTutorialCompleted();

    return [[
      {
        label: 'tutorials',
        onSelect: () => {
          pushMenu.dispatch('course');
        },
        textStyle: {
          fill: tutorialCompleted ? 'green' : undefined,
        },
        type: 'text',
      },
      {
        label: 'practice',
        onSelect: () => {
          pushMenu.dispatch('practice');
        },
        type: 'text',
      },
      ...this.getExtraModeOptions(),
      {
        label: 'options',
        onSelect: () => {
          pushMenu.dispatch('option');
        },
        type: 'text',
      },
    ]];
  }

  private getExtraModeOptions(): MenuOptionData[] {
    if (this.game.saveFile.isTutorialCompleted()) {
      return [
        {
          label: 'challenges',
          onSelect: () => {
            console.log('open challenge menu');
          },
          type: 'text',
        },
        {
          label: 'arcade',
          onSelect: () => {
            console.log('open arcade menu');
          },
          type: 'text',
        },
      ];
    } else {
      return [];
    }
  }
}

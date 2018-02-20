import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import Menu from '../../ui/Menu';

export default class TitleMenu extends Menu {
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
    const { game } = this;
    const { pushMenu, popMenu } = game.eventBus().menu;

    return [[
      {
        label: 'courses',
        onSelect: () => pushMenu.dispatch('course'),
        type: 'text',
      },
      {
        label: 'practice',
        onSelect: () => pushMenu.dispatch('practice'),
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
    if (this.game.saveFile.isCourseTypeCompleted('easy')) {
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

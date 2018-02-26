import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import Menu from '../../ui/Menu';
import TextLink from '../../ui/TextLink';

export default class TitleMenu extends Menu {
  constructor(
    game: Game,
    x: number,
    y: number,
    rowHeight: number,
  ) {
    super(game, 0, 0, rowHeight, []);

    this.initTitle();
    this.initOptions();
  }

  private initTitle() {
    const title = new TextLink(
      this.game,
      this,
      this.game.width / 2, 150,
      100,
      'f l a s h d a n c e',
      undefined,
      true,
    );
  }

  private initOptions() {
    const x = this.game.width / 2;
    const y = this.game.height / 2;
    const fontSize = 70;
    const verticalSpace = 90;

    const courseLink = new TextLink(
      this.game,
      this,
      x, y,
      fontSize,
      'courses',
      () => this.pushMenu('course'),
      true,
    );

    const practiceLink = new TextLink(
      this.game,
      this,
      x, y + verticalSpace,
      fontSize,
      'practice',
      () => this.pushMenu('practice'),
      true,
    );

    const optionsLink = new TextLink(
      this.game,
      this,
      x, y + verticalSpace * 2,
      fontSize,
      'options',
      () => this.pushMenu('option'),
      true,
    );
  }
}

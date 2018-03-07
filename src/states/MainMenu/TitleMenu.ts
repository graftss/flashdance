import * as Phaser from 'phaser-ce';

import Game from '../../Game';
import Menu from '../../ui/Menu';
import TextLink from '../../ui/TextLink';

export default class TitleMenu extends Menu {
  private title: TextLink[];

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
    const letters = 'flashdance'.split('');
    this.title = letters.map((l, i) => new TextLink(
      this.game,
      this,
      this.game.width / 2 - (4.5 - i) * 60, 150,
      100,
      l,
      undefined,
      true,
    ));

    setTimeout(this.animateTitle, 3000);
  }

  private animateTitle = () => {
    const { chain, merge, positionBy } = this.game.tweener;
    const duration = 4000;

    const tweens = this.title.map((textLink, i) => {
      const dx = (i - 4.5) * 3;

      return chain([
        positionBy(textLink, { x: dx, y: Math.random() * 10 - 5 }, duration),
        positionBy(textLink, { x: 0, y: 0 }, duration),
      ]);
    });

    const animation = merge(tweens);
    animation.onComplete.add(this.animateTitle);
    animation.start();
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

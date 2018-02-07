import * as Phaser from 'phaser-ce';

import Game from '../../../Game';

const lifeColor = 0xffffff;

export default class Life extends Phaser.Group {
  private bottomMarker: Phaser.Graphics;
  private topMarker: Phaser.Graphics;
  private showTop: boolean = true;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public cx: number,
    public cy: number,
    public r: number,
  ) {
    super(game, parent);

    this.initGraphic();
  }

  public flip(): void {
    this.showTop = !this.showTop;

    if (this.showTop) {
      this.topMarker.alpha = 1;
      this.bottomMarker.alpha = 0;
    } else {
      this.topMarker.alpha = 0;
      this.bottomMarker.alpha = 1;
    }
  }

  private initGraphic() {
    const { cx, cy, r } = this;
    const ballDiameter = r * 2;
    const markerSize = ballDiameter / 3;

    const ball = this.game.add.graphics(cx, cy, this)
      .beginFill(lifeColor, 1)
      .drawCircle(0, 0, ballDiameter)
      .endFill();

    this.topMarker = this.game.add.graphics(cx, cy, this)
      .beginFill(0)
      .drawRect(-markerSize, -markerSize / 3, 2 * markerSize, markerSize * 2 / 3)
      .drawRect(-markerSize / 3, -markerSize, markerSize * 2 / 3, 2 * markerSize)
      .endFill();

    this.bottomMarker = this.game.add.graphics(cx, cy, this)
      .beginFill(0)
      .drawRect(-markerSize, -markerSize / 3, 2 * markerSize, markerSize * 2 / 3)
      .endFill();
  }
}

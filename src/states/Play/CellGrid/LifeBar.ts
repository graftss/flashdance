import * as Phaser from 'phaser-ce';

import Game from '../../../Game';
import Life from './Life';

export default class LifeBar extends Phaser.Group {
  private lives: Life[] = [];
  private spaceBetweenLives: number = 35;
  private lifeRadius: number = 15;

  constructor(
    public game: Game,
    public parent: Phaser.Group,
    public x: number,
    public y: number,
    lifeCount: number,
  ) {
    super(game, parent);

    for (let n = 0; n < lifeCount; n++) {
      this.gainLife();
    }

    this.positionLives();

    this.game.eventBus().livesChanged.add(this.onLivesChanged);
  }

  public flip(): void {
    this.lives.forEach(life => life.flip());
  }

  private getLifeCount(): number {
    return this.lives.length;
  }

  private onLivesChanged = (newLifeCount: number): void => {
    const delta = newLifeCount - this.getLifeCount();
    const method = delta > 0 ? this.gainLife : this.loseLife;

    for (let i = 0; i < Math.abs(delta); i++) {
      method();
    }

    this.positionLives();
  }

  private loseLife = (): void => {
    const lostLife = this.lives.pop();

    if (lostLife) {
      lostLife.destroy();
    }
  }

  private gainLife = (): void => {
    const { game, lifeRadius, lives } = this;

    const newLife = new Life(game, this, 0, 0, lifeRadius);
    lives.push(newLife);
  }

  private positionLives(): void {
    const lifeCount = this.getLifeCount();
    const space = this.spaceBetweenLives;

    let x = -space / 2 - (space * (lifeCount / 2 - 1));

    for (const life of this.lives) {
      life.x = x;
      x += space;
    }
  }
}

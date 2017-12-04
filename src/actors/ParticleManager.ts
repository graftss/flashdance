import * as Phaser from 'phaser-ce';

import Game from '..';
import ParticleTrail from './CellGrid/ParticleTrail';

export default class ParticleManager extends Phaser.Particles.Arcade.Emitter {
  constructor(
    public game: Game,
  ) {
    super(game, 0, 0);

    game.eventBus.spawnParticle.add((data: ParticleData) => {
      const { position: { x, y } } = data;
      const g = game.add.graphics(x, y)
      g.beginFill(0xff0000);
      g.drawRect(-3, -3, 7, 7);
      g.endFill();
    });
  }


}

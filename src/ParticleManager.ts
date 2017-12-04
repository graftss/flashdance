import * as Phaser from 'phaser-ce';

import Game from './Game';
export default class ParticleManager extends Phaser.Particles.Arcade.Emitter {
  private textures: Dict<Phaser.RenderTexture>;
  private emitter: Phaser.Particles.Arcade.Emitter;

  constructor(
    public game: Game,
  ) {
    super(game, 0, 0);

    this.initTextures();

    game.eventBus.spawnParticle.add(this.onSpawnParticle);
  }

  private onSpawnParticle = (data: ParticleData): void => {
    const { position: { x, y } } = data;

    switch (data.type) {
      case 'trail': this.emitTrail(x, y);
    }
  }

  private initTextures() {
    const trail = this.game.add.graphics();
    trail.beginFill(0xdddddd);
    trail.drawRect(-3, -3, 7, 7);
    trail.endFill();

    const trailTexture = trail.generateTexture();

    this.textures = { trail: trailTexture };
  }

  private emitTrail(x: number, y: number) {
    const trail = this.game.add.sprite(x, y, this.textures.trail);

    this.fade(trail, 300).start();
  }

  private fade(sprite: Phaser.Sprite, duration: number): Phaser.Tween {
    const tween = this.game.add.tween(sprite)
      .to({ alpha: 0 }, duration);

    tween.onComplete.add(() => sprite.kill());

    return tween;
  }
}

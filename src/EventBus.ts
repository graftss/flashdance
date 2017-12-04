import * as Phaser from 'phaser-ce';

import TypedSignal from './TypedSignal';

export default class EventBus {
  public inputEnabled: TypedSignal<boolean> = new TypedSignal();
  public inputDragTarget: TypedSignal<InputTarget> = new TypedSignal();
  public inputDragStop: TypedSignal<InputTarget> = new TypedSignal();
  public inputDown: TypedSignal<InputTarget> = new TypedSignal();

  public spawnParticle: TypedSignal<ParticleData> = new TypedSignal();
}

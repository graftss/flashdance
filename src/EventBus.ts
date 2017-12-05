import * as Phaser from 'phaser-ce';

import TypedSignal from './TypedSignal';

export default class EventBus {
  public inputEnabled: TypedSignal<boolean> = new TypedSignal();
  public inputDragTarget: TypedSignal<GameInput> = new TypedSignal();
  public inputDragStop: TypedSignal<GameInput> = new TypedSignal();
  public inputDown: TypedSignal<GameInput> = new TypedSignal();

  public correctInput: TypedSignal<GameInput> = new TypedSignal();
  public incorrectInput: TypedSignal<IncorrectGameInput> = new TypedSignal();

  public spawnParticle: TypedSignal<ParticleData> = new TypedSignal();
}

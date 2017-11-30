import * as Phaser from 'phaser-ce';

class TypedSignal<T> extends Phaser.Signal {
  add(listener: (data: T) => any, ...args) {
    return super.add(listener, ...args)
  }

  addOnce(listener: (data: T) => any, ...args) {
    return super.addOnce(listener, ...args);
  }

  dispatch(data: T) {
    super.dispatch(data);
  }
}

export default class EventBus {
  public inputEnabled: TypedSignal<boolean> = new TypedSignal();
  public inputDragTarget: TypedSignal<InputTarget> = new TypedSignal();
  public inputDragStop: TypedSignal<InputTarget> = new TypedSignal();
  public inputDown: TypedSignal<InputTarget> = new TypedSignal();
}

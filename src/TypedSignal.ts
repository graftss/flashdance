import * as Phaser from 'phaser-ce';

// Extends the default `Phaser.Signal` class with typed versions of
// the methods we're actually using.

export default class TypedSignal<T> extends Phaser.Signal {
  public add(listener: (data: T) => any, ...args) {
    return super.add(listener, ...args);
  }

  public addOnce(listener: (data: T) => any, ...args) {
    return super.addOnce(listener, ...args);
  }

  public dispatch(data: T) {
    super.dispatch(data);
  }
}

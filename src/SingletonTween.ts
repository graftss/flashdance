import * as Phaser from 'phaser-ce';

export default class SingletonTween {
  private tween: Phaser.Tween;
  private inProgress: boolean = false;

  public start(tween: Phaser.Tween) {
    if (this.inProgress) {
      this.tween.stop();
    }

    this.tween = tween;
    this.inProgress = true;

    tween.onComplete.add(() => this.inProgress = false);
    tween.start();
  }
}

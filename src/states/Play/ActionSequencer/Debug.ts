import BaseActionSequencer from './Base';

export default class DebugActionSequencer
  extends BaseActionSequencer implements IActionSequencer {

  public randomRound(difficulty: number) {
    return this.path();
  }

  private rotate(): GameActionData[] {
    return [
      this.wait(300),
      this.randomFlash(),
      this.randomRotate(),
    ];
  }

  private reflect(): GameActionData[] {
    return [
      this.wait(300),
      this.randomFlash(),
      this.randomSingleReflect(),
      this.randomSingleReflect(),
      this.randomSingleReflect(),
      this.randomRotate(),
    ];
  }

  private inputLights(): GameActionData[] {
    return [
      this.wait(300),
      this.randomFlash(),
      this.randomPath(5),
    ];
  }

  private path(): GameActionData[] {
    return [
      this.wait(500),
      this.randomPath(5),
      // this.randomSingleReflect(),
      this.randomPath(5),
    ];
  }

  private multiflash(): GameActionData[] {
    return [
      this.wait(300),
      this.randomMultiflash(),
    ];
  }
}

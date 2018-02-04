import BaseActionSequencer from './Base';

export default class DebugActionSequencer
  extends BaseActionSequencer implements IActionSequencer {

  public randomRound(difficulty: number) {
    return this.debugPath();
  }

  private debugRotate(): GameActionData[] {
    return [
      this.wait(300),
      this.flash(),
      this.rotate(),
    ];
  }

  private debugReflect(): GameActionData[] {
    return [
      this.wait(300),
      this.flash(),
      this.reflect(),
      this.reflect(),
      this.reflect(),
      this.rotate(),
    ];
  }

  private debugInputLights(): GameActionData[] {
    return [
      this.wait(300),
      this.flash(),
      this.path(5),
    ];
  }

  private debugPath(): GameActionData[] {
    return [
      this.wait(500),
      this.path(5),
      // this.reflect(),
      this.path(5),
    ];
  }

  private debugMultiflash(): GameActionData[] {
    return [
      this.wait(300),
      this.multiflash(),
    ];
  }
}

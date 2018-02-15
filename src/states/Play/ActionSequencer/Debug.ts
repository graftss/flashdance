import BaseActionSequencer from './Base';

export default class DebugActionSequencer
  extends BaseActionSequencer implements IActionSequencer {

  public randomRound(difficulty: number): GameActionData[] {
    return this.debugPath();
  }

  private debugRepeatedDown(): GameActionData[] {
    return [
      this.wait(300),
      { type: 'flash', opts: { origin: { col: 1, row: 1 }, duration: 300 } },
      { type: 'flash', opts: { origin: { col: 1, row: 1 }, duration: 300 } },
      { type: 'flash', opts: { origin: { col: 1, row: 1 }, duration: 300 } },
      {
        opts: {
          duration: 1000,
          path: [
            { col: 1, row: 0 },
            { col: 1, row: 1 },
            { col: 1, row: 2 },
            { col: 1, row: 3 },
            { col: 2, row: 3 },
            { col: 2, row: 2 },
            { col: 1, row: 2 },
            { col: 0, row: 2 },
          ],
        },
        type: 'path',
      },
    ];
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

  private debugXReflect(): GameActionData[] {
    return [
      this.wait(300),
      this.flash(),
      this.xReflect(),
    ];
  }

  private debugInputLights(): GameActionData[] {
    return [
      this.wait(300),
      this.flash(),
      this.path(5),
    ];
  }

  private debugInputDisable(): GameActionData[] {
    return [
      this.wait(250),
      { type: 'flash', opts: { origin: { col: 1, row: 1 }, duration: 300 } },
      { type: 'flash', opts: { origin: { col: 1, row: 1 }, duration: 300 } },
    ];
  }

  private debugPath(): GameActionData[] {
    return [
      this.wait(100),
      this.flash(),
      this.path(5),
      // this.reflect(),
      // this.path(5),
    ];
  }

  private debugMultiflash(): GameActionData[] {
    return [
      this.wait(300),
      this.multiflash(),
    ];
  }

  private debugTrails(): GameActionData[] {
    return [
      this.wait(200),
      {
        opts: {
          duration: 3000,
          path: [
            { col: 1, row: 0 },
            { col: 1, row: 1 },
            { col: 1, row: 2 },
            { col: 1, row: 3 },
            { col: 2, row: 3 },
            { col: 2, row: 2 },
            { col: 1, row: 2 },
            { col: 0, row: 2 },
          ],
        },
        type: 'path',
      },
    ];
  }
}

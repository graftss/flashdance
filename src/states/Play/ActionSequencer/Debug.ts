import BaseActionSequencer from './Base';

export default class DebugActionSequencer
  extends BaseActionSequencer implements IActionSequencer {

  public randomRound(difficulty: number): GameActionData[] {
    return this.debugFlashAndFake();
  }

  private debugFlashAndFake(): GameActionData[] {
    return [
      this.flashAndFake(3000, 8),
    ];
  }

  private debugCombo(): GameActionData[] {
    return [
      { type: 'flash', opts: { origin: { col: 1, row: 1 }, duration: 100 } },
    ];
  }

  private debugRepeatedDown(): GameActionData[] {
    return [
      this.wait(300),
      { type: 'flash', opts: { origin: { col: 1, row: 1 }, duration: 300 } },
      { type: 'flash', opts: { origin: { col: 1, row: 1 }, duration: 300 } },
      { type: 'flash', opts: { origin: { col: 1, row: 1 }, duration: 300 } },
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

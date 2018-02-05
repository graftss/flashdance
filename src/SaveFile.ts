import IO from './IO';

export default class SaveFile {
  public static updateSaveData(update: () => SaveData): void {
    const newSaveData = update();

    IO.writeSave(this.serialize(newSaveData));
  }

  public static loadSaveData(): SaveData {
    const save = IO.readSave();
    return save ? this.deserialize(save) : this.getNewSaveData();
  }

  private static serialize(saveData: SaveData): string {
    const { achievements, highScores, unlocks } = saveData;

    return JSON.stringify({ achievements, highScores, unlocks });
  }

  private static deserialize(save: string): SaveData {
    return JSON.parse(save);
  }

  private static getNewSaveData(): SaveData {
    return {
      achievements: {},
      highScores: {},
      unlocks: {
        tutorial: {},
      },
    };
  }
}

import Game from './Game';
import IO from './IO';

export default class SaveFile {
  private saveData: SaveData;

  constructor() {
    this.initSaveData();
  }

  public update(updater: (SaveData) => SaveData): void {
    const newSaveData = updater(this.saveData);

    IO.writeSave(this.serialize(newSaveData));
  }

  public isCourseCompleted(courseId: number): boolean {
    return Boolean(this.saveData.completedCourses[courseId]);
  }

  private initSaveData(): void {
    const save = IO.readSave();
    this.saveData = save ? this.deserialize(save) : SaveFile.getNewSaveData();
  }

  private serialize(saveData: SaveData): string {
    return JSON.stringify(this.saveData);
  }

  private deserialize(save: string): SaveData {
    return JSON.parse(save);
  }

  private static getNewSaveData(): SaveData {
    return {
      achievements: {},
      completedCourses: {},
      highScores: {},
    };
  }
}

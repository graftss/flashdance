import Game from './Game';
import IO from './IO';

export default class SaveFile {
  private saveData: SaveData;

  constructor() {
    this.initSaveData();
  }

  public update(updater: (SaveData) => SaveData): void {
    const updatedSaveData = updater(this.saveData);

    IO.writeSave(SaveFile.serialize(updatedSaveData));
  }

  public clearSave(): void {
    this.update(SaveFile.getNewSaveData);
  }

  public isCourseCompleted(courseId: number): boolean {
    return Boolean(this.saveData.completedCourses[courseId]);
  }

  private initSaveData(): void {
    const save = IO.readSave();
    this.saveData = save ? SaveFile.deserialize(save) : SaveFile.getNewSaveData();
  }

  private static serialize(saveData: SaveData): string {
    return JSON.stringify(saveData);
  }

  private static deserialize(save: string): SaveData {
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

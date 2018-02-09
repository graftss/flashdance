import courses from './courses';
import Game from './Game';
import IO from './IO';

export default class SaveFile {
  private saveData: SaveData;

  constructor() {
    this.initSaveData();
  }

  public update(updater: (SaveData) => SaveData): void {
    this.set(updater(this.saveData));
  }

  public set(data: SaveData): void {
    this.saveData = data;
    IO.writeSave(SaveFile.serialize(data));
  }

  public clearSave(): void {
    this.update(SaveFile.getNewSaveData);
  }

  public isCourseCompleted(courseId: number): boolean {
    return Boolean(this.saveData.completedCourses[courseId]);
  }

  public isCourseUnlocked(courseId: number): boolean {
    if (courseId === 0) {
      return true;
    }

    return Boolean(this.saveData.completedCourses[courseId - 1]);
  }

  public isTutorialCompleted(): boolean {
    return courses
      .filter(c => c.type === 'tutorial')
      .every(c => this.isCourseCompleted(c.id));
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

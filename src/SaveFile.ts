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

  public getCourseHistory(courseId: number): CourseHistory {
    return this.saveData.courses[courseId];
  }

  public isCourseCompleted(courseId: number): boolean {
    return this.getCourseHistory(courseId).completed;
  }

  public updateCourseHistory(courseId: number, result: CourseResult): void {
    const best = this.getCourseHistory(courseId);

    best.completed = best.completed || result.completed;
    best.difficultyReached = Math.max(best.difficultyReached, result.difficultyReached);
    best.livesLost = Math.min(best.livesLost, result.livesLost);
    best.highestCombo = Math.max(best.highestCombo, result.highestCombo);
  }

  public isCourseUnlocked(courseId: number): boolean {
    if (courseId === 0) {
      return true;
    }

    return Boolean(this.isCourseCompleted(courseId - 1));
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
      courses: {},
    };
  }
}

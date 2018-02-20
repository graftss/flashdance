import courses from './courses';
import Game from './Game';
import IO from './IO';
import { get, maxNum, minNum, set } from './utils';

export default class SaveFile {
  private saveData: SaveData;

  constructor() {
    this.initSaveData();
  }

  public update(updater: (s: SaveData) => SaveData): void {
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
    return get(this.saveData.courses, courseId, this.newCourseHistory());
  }

  public setCourseHistory(courseId: number, history: CourseHistory): void {
    this.update(saveData => {
      set(saveData, ['courses', courseId], history);
      return saveData;
    });
  }

  public updateCourseHistory(courseId: number, result: CourseResult): void {
    const best = this.getCourseHistory(courseId);

    best.completed = best.completed || result.completed;
    best.difficultyReached = maxNum([best.difficultyReached, result.difficultyReached]);
    best.livesLost = minNum([best.livesLost, result.livesLost]);
    best.highestCombo = maxNum([best.highestCombo, result.highestCombo]);

    this.setCourseHistory(courseId, best);
  }

  public isCourseCompleted = (courseData: CourseData): boolean => {
    const { id } = courseData;

    return get(this.getCourseHistory(id), 'completed', false);
  }

  public isCourseUnlocked(courseData: CourseData): boolean {
    const { id, type } = courseData;

    if (id === 0) {
      return true;
    } else if (type === 'debug') {
      return true;
    } else if (PRODUCTION === false) {
      return true;
    }

    const previousCourse = courses.find(c => c.id === id - 1);

    return Boolean(this.isCourseCompleted(previousCourse));
  }

  public isCourseTypeCompleted(type: CourseType): boolean {
    return courses
      .filter(c => c.type === type)
      .every(this.isCourseCompleted);
  }

  private initSaveData(): void {
    const save = IO.readSave();
    this.saveData = save ? SaveFile.deserialize(save) : SaveFile.getNewSaveData();
  }

  private newCourseHistory(): CourseHistory {
    return {
      completed: false,
      difficultyReached: 0,
      highestCombo: 0,
      livesLost: Infinity,
    };
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

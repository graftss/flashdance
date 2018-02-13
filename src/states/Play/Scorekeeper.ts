import Game from '../../Game';
import { clamp } from '../../utils';

export default class Scorekeeper {
  public completed: boolean;

  public minDifficulty: number;
  public maxDifficulty: number;

  public combo: number;
  public difficulty: number;
  public lives: number;
  public round: number;

  public difficultyReached: number;
  public highestCombo: number;
  public livesLost: number;

  constructor(
    private game: Game,
    private courseData: CourseData,
  ) {
    this.minDifficulty = courseData.minDifficulty;
    this.maxDifficulty = courseData.maxDifficulty;

    this.combo = 0;
    this.difficulty = this.minDifficulty;
    this.lives = courseData.lives;
    this.round = 0;

    this.difficultyReached = this.minDifficulty;
    this.highestCombo = 0;
    this.livesLost = 0;
  }

  public isCourseComplete(): boolean {
    return this.completed;
  }

  public failRound(): void {
    this.round += 1;
    this.updateDifficulty(-1);
    this.updateLives(-1);
    this.updateCombo(true);
  }

  public completeRound(): void {
    this.round += 1;
    this.updateDifficulty(1);
    this.updateCombo(false);
  }

  public getCourseResult(): CourseResult {
    return {
      completed: this.isCourseComplete(),
      courseId: this.courseData.id,
      difficultyReached: this.difficultyReached,
      highestCombo: this.highestCombo,
      livesLost: this.livesLost,
    };
  }

  public updateLives(lifeDelta: number): void {
    if (lifeDelta < 0) {
      this.livesLost -= lifeDelta;
    }

    this.lives += lifeDelta;
    this.game.eventBus().play.livesChanged.dispatch(this.lives);
  }

  public updateCombo(comboBroken: boolean): void {
    if (comboBroken) {
      this.combo = 0;
    } else {
      this.combo += 1;
      this.highestCombo = Math.max(this.highestCombo, this.combo);
    }
  }

  public updateDifficulty(difficultyDelta: number): void {
    const difficulty = this.difficulty + difficultyDelta;

    this.completed = difficulty > this.maxDifficulty;

    const newDifficulty = clamp(difficulty, this.minDifficulty, this.maxDifficulty);

    this.difficulty = newDifficulty;
    this.difficultyReached = Math.max(this.difficultyReached, newDifficulty);
    this.game.eventBus().play.difficultyChanged.dispatch(newDifficulty);
  }
}

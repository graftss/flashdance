import * as Phaser from 'phaser-ce';

import TypedSignal from './TypedSignal';

export default class EventBus {
  public inputEnabled: TypedSignal<boolean> = new TypedSignal();
  public inputDragTarget: TypedSignal<RawInput> = new TypedSignal();
  public inputDragStop: TypedSignal<RawInput> = new TypedSignal();
  public inputDown: TypedSignal<RawInput> = new TypedSignal();

  public correctInput: TypedSignal<InputPair> = new TypedSignal();
  public incorrectInput: TypedSignal<InputPair> = new TypedSignal();

  public livesChanged: TypedSignal<number> = new TypedSignal();

  public gameActionStart: TypedSignal<GameActionContext> = new TypedSignal();
  public gameActionComplete: TypedSignal<GameActionContext> = new TypedSignal();
  public gameRoundFail: TypedSignal<number> = new TypedSignal();
  public gameRoundComplete: TypedSignal<number> = new TypedSignal();
  public gameCourseFail: TypedSignal<CourseData> = new TypedSignal();
  public gameCourseComplete: TypedSignal<CourseData> = new TypedSignal();
}

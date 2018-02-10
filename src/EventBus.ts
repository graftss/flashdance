import * as Phaser from 'phaser-ce';

import TypedSignal from './TypedSignal';

export default class EventBus {
  public play = {
    actionComplete: new TypedSignal() as TypedSignal<GameActionContext>,
    actionStart: new TypedSignal() as TypedSignal<GameActionContext>,
    courseComplete: new TypedSignal() as TypedSignal<CourseData>,
    courseFail: new TypedSignal() as TypedSignal<CourseData>,
    courseQuit: new TypedSignal() as TypedSignal<null>,
    inputCorrect: new TypedSignal() as TypedSignal<InputPair>,
    inputDown: new TypedSignal() as TypedSignal<RawInput>,
    inputDragStop: new TypedSignal() as TypedSignal<RawInput>,
    inputDragTarget: new TypedSignal() as TypedSignal<RawInput>,
    inputEnabled: new TypedSignal() as TypedSignal<boolean>,
    inputIncorrect: new TypedSignal() as TypedSignal<InputPair>,
    livesChanged: new TypedSignal() as TypedSignal<number>,
    roundComplete: new TypedSignal() as TypedSignal<number>,
    roundFail: new TypedSignal() as TypedSignal<number>,
  };

  public menu = {
    popMenu: new TypedSignal() as TypedSignal<null>,
    pushMenu: new TypedSignal() as TypedSignal<MenuID>,
    startCourse: new TypedSignal() as TypedSignal<CourseData>,
  };
}

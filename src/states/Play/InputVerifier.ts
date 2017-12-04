import Game from '../../Game';
import { cellTarget, flatten, isEqual, mapJust } from '../../utils';

export default class InputVerifier {
  private targetInput: GameInput[];
  private nextInputIndex: number;
  private checkpointInputIndex: number;

  constructor(
    private game: Game,
  ) {
    this.attachHandlers();
  }

  public startRound(actionDataList: GameActionData[]) {
    this.targetInput = this.actionsToInput(actionDataList);
    this.nextInputIndex = 0;
    this.checkpointInputIndex = 0;

    this.dispatchEnableInput();
  }

  private attachHandlers(): void {
    const { eventBus } = this.game;

    eventBus.inputDown.add(this.onInputDown);
    eventBus.inputDragTarget.add(this.onNewDragTarget);
    eventBus.inputDragStop.add(this.onDragStop);
  }

  private dispatchEnableInput(): void {
    this.game.eventBus.inputEnabled.dispatch(true);
  }

  private dispatchDisableInput(): void {
    this.game.eventBus.inputEnabled.dispatch(false);
  }

  private nextInput(): GameInput {
    return this.targetInput[this.nextInputIndex];
  }

  private onInputDown = (data: InputTarget) => {
    const nextInput = this.nextInput();

    if (nextInput.type === 'down' && isEqual(nextInput.target, data)) {
      console.log('correct input');
      this.checkpointInputIndex = this.nextInputIndex;
      this.advanceNextInput();
    } else {
      this.onIncorrectInput();
    }
  }

  private onNewDragTarget = (data: InputTarget) => {
    const nextInput = this.nextInput();

    if (nextInput.type === 'drag' && isEqual(nextInput.target, data)) {
      console.log('correct DRAG input');
      this.advanceNextInput();
    } else {
      this.onIncorrectInput();
    }
  }

  private onDragStop = (data: InputTarget) => {
    const nextInput = this.nextInput();

    if (nextInput.type === 'drag') {
      this.onIncorrectInput();
    } else {
      this.checkpointInputIndex = this.nextInputIndex;
    }
  }

  private advanceNextInput(): void {
    const nextInputIndex = this.nextInputIndex + 1;

    if (nextInputIndex === this.targetInput.length) {
      this.onCompleteInput();
    } else {
      this.nextInputIndex = nextInputIndex;
    }
  }

  private onIncorrectInput() {
    this.nextInputIndex = this.checkpointInputIndex;
    console.log('wrong input');
    console.log(this.checkpointInputIndex, this.nextInput());
  }

  private onCompleteInput() {
    console.log('input completed');
    this.dispatchDisableInput();
  }

  private actionToInput = (actionData: GameActionData): Array<Maybe<GameInput>> => {
    switch (actionData.type) {
      case 'flash': {
        const { origin } = actionData.opts;

        return [{ type: 'down', target: cellTarget(origin) }];
      }

      case 'path': {
        const { origin, path } = actionData.opts;
        const result: GameInput[] = [{ type: 'down', target: cellTarget(origin) }];

        for (const gridPos of path) {
          result.push({ type: 'drag', target: cellTarget(gridPos) });
        }

        return result;
      }

      default: return null;
    }
  }

  private actionsToInput = (actionDataList: GameActionData[]): GameInput[] => {
    return flatten(mapJust(this.actionToInput, actionDataList));
  }
}

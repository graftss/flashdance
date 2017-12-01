import Game from '../..';
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
      this.advanceNextInput();
      this.updateCheckpointInput();
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

  private updateCheckpointInput(): void {
    const nextInput = this.nextInput();

    switch (nextInput.type) {
      case 'down': this.checkpointInputIndex = this.nextInputIndex;
    }
  }

  private onIncorrectInput() {
    this.nextInputIndex = this.checkpointInputIndex;
    console.log('wrong input');
  }

  private onCompleteInput() {
    console.log('input completed');
    this.dispatchDisableInput();
  }

  private actionToInput = (actionData: GameActionData): Array<Maybe<GameInput>> => {
    switch (actionData.type) {
      case 'flash': {
        const { cell } = actionData.opts;

        return [{ type: 'down', target: cellTarget(cell) }];
      }

      case 'path': {
        const { cells } = actionData.opts;
        const result: GameInput[] = [{ type: 'down', target: cellTarget(cells[0]) }];

        for (let i = 1; i < cells.length; i++) {
          result.push({ type: 'drag', target: cellTarget(cells[i]) });
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

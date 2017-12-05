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

    eventBus.inputDown.add(this.onInput);
    eventBus.inputDragTarget.add(this.onInput);
    eventBus.inputDragStop.add(this.onInput);
  }

  private dispatchEnableInput(): void {
    this.game.eventBus.inputEnabled.dispatch(true);
  }

  private dispatchDisableInput(): void {
    this.game.eventBus.inputEnabled.dispatch(false);
  }

  private dispatchCorrectInput(input: GameInput): void {
    this.game.eventBus.correctInput.dispatch(input);
  }

  private dispatchIncorrectInput(observed: GameInput): void {
    this.game.eventBus.incorrectInput.dispatch({
      expected: this.nextInput(),
      observed,
    });
  }

  private nextInput(): GameInput {
    return this.targetInput[this.nextInputIndex];
  }

  private onInput = (input: GameInput): void => {
    const expected = this.nextInput();

    if (isEqual(expected, input)) {
      this.onCorrectInput(input);
    } else {
      this.onIncorrectInput(input);
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

  private saveInputCheckpoint(): void {
    this.checkpointInputIndex = this.nextInputIndex;
  }

  private onCorrectInput(input: GameInput) {
    switch (input.type) {
      case 'down': {
        this.saveInputCheckpoint();
        break;
      }

      case 'up': {
        this.saveInputCheckpoint();
        break;
      }
    }

    this.advanceNextInput();
    this.dispatchCorrectInput(input);
  }

  private onIncorrectInput(input: GameInput) {
    this.nextInputIndex = this.checkpointInputIndex;
    this.dispatchIncorrectInput(input);
  }

  private onCompleteInput() {
    console.log('input completed');
    this.dispatchDisableInput();
  }

  private actionToInput = (actionData: GameActionData): Array<Maybe<GameInput>> => {
    switch (actionData.type) {
      case 'flash': {
        const { origin } = actionData.opts;

        return [
          { type: 'down', target: cellTarget(origin) },
          { type: 'up', target: cellTarget(origin) },
        ];
      }

      case 'path': {
        const { origin, path } = actionData.opts;
        const result: GameInput[] = [{ type: 'down', target: cellTarget(origin) }];
        let gridPos;

        for (gridPos of path) {
          result.push({ type: 'drag', target: cellTarget(gridPos) });
        }

        // after the for loop, `gridPos` points to the last element of `path`
        result.push({ type: 'up', target: cellTarget(gridPos)});

        return result;
      }

      default: return null;
    }
  }

  private actionsToInput = (actionDataList: GameActionData[]): GameInput[] => {
    return flatten(mapJust(this.actionToInput, actionDataList));
  }
}

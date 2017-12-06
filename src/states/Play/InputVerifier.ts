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

  private dispatchCorrectInput(expected: GameInput, observed: RawInput): void {
    this.game.eventBus.correctInput.dispatch({ expected, observed });
  }

  private dispatchIncorrectInput(expected: GameInput, observed: RawInput): void {
    this.game.eventBus.incorrectInput.dispatch({ expected, observed });
  }

  private nextInput(): GameInput {
    return this.targetInput[this.nextInputIndex];
  }

  private onInput = (observed: RawInput): void => {
    const expected = this.nextInput();

    if (this.verifyRawInput(expected, observed)) {
      this.onCorrectInput(expected, observed);
    } else {
      this.onIncorrectInput(expected, observed);
    }
  }

  private verifyRawInput(expected: GameInput, observed: RawInput): boolean {
    if (!isEqual(expected.target, observed.target)) {
      return false;
    }

    switch (observed.type) {
      case 'down': {
        if (expected.type === 'down' || expected.type === 'down/drag') {
          return true;
        }
      }

      case 'up': {
        if (expected.type === 'up' || expected.type === 'up/drag') {
          return true;
        }
      }

      case 'drag': {
        if (expected.type === 'over/drag') {
          return true;
        }
      }

      default: return false;
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

  private onCorrectInput(expected: GameInput, observed: RawInput) {
    switch (expected.type) {
      case 'down':
      case 'up':
      case 'up/drag': {
        this.saveInputCheckpoint();
        break;
      }
    }

    this.advanceNextInput();
    this.dispatchCorrectInput(expected, observed);
  }

  private onIncorrectInput(expected: GameInput, observed: RawInput) {
    this.nextInputIndex = this.checkpointInputIndex;
    this.dispatchIncorrectInput(expected, observed);
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
        const result: GameInput[] = [{ type: 'down/drag', target: cellTarget(origin) }];
        let gridPos;

        for (gridPos of path) {
          result.push({ type: 'over/drag', target: cellTarget(gridPos) });
        }

        // after the for loop, `gridPos` points to the last element of `path`
        result.push({ type: 'up/drag', target: cellTarget(gridPos)});

        return result;
      }

      default: return null;
    }
  }

  private actionsToInput = (actionDataList: GameActionData[]): GameInput[] => {
    return flatten(mapJust(this.actionToInput, actionDataList));
  }
}

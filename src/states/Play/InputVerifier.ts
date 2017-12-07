import Game from '../../Game';
import { cellTarget, flatten, isEqual, mapJust } from '../../utils';

const logInputPair = (raw: RawInput, game: GameInput, label?: string) => {
  label && console.log('---', label, '---');
  console.log('raw: ', raw.type, raw.target.cell.col, raw.target.cell.row);
  console.log('game: ', game.type, game.target.cell.col, game.target.cell.row);
};

export default class InputVerifier {
  private targetInput: GameInput[];
  private nextInputIndex: number;
  private checkpointInputIndex: number;

  // on incorrect input, we stop verifying input until the player disengages
  // from the screen (i.e. we receive an `up` input)
  private ignoreInputUntilUp: boolean = false;

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

    if (this.ignoreInputUntilUp) {
      console.log('sup')
      if (observed.type === 'up') {
        this.ignoreInputUntilUp = false;
      }

      return;
    }

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
        return expected.type === 'down' || expected.type === 'down/drag';
      }

      case 'up': {
        return expected.type === 'up' || expected.type === 'up/drag';
      }

      case 'drag': {
        return expected.type === 'over/drag';
      }
    }

    return false;
  }

  private advanceNextInput(): void {
    this.nextInputIndex = this.nextInputIndex + 1;
  }

  private isInputComplete(): boolean {
    return this.nextInputIndex === this.targetInput.length;
  }

  private saveInputCheckpoint(): void {
    this.checkpointInputIndex = this.nextInputIndex;
  }

  private onCorrectInput(expected: GameInput, observed: RawInput): void {
    this.advanceNextInput();

    switch (expected.type) {
      case 'up':
      case 'up/drag': {
        this.saveInputCheckpoint();
        break;
      }
    }

    this.dispatchCorrectInput(expected, observed);

    if (this.isInputComplete()) {
      return this.onCompleteInput();
    }

    logInputPair(observed, expected, 'correct');
  }

  private onIncorrectInput(expected: GameInput, observed: RawInput) {
    this.ignoreInputUntilUp = true;
    this.nextInputIndex = this.checkpointInputIndex;
    this.dispatchIncorrectInput(expected, observed);
    logInputPair(observed, expected, 'incorrect');
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

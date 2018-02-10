import Game from '../../Game';
import { cellTarget, flatten, isEqual, mapJust, repeat } from '../../utils';

const logInputPair = (raw: RawInput, game: GameInput, label?: string) => {
  if (label) {
    console.log('---', label, '---');
  }

  console.log('raw: ', raw.type, raw.target.cell.col, raw.target.cell.row);
  console.log('game: ', game.type, game.target.cell.col, game.target.cell.row);
};

export default class InputVerifier {
  public nextInputIndex: number;

  private targetInput: GameInput[];
  private checkpointInputIndex: number;
  private inputEnabled: boolean = false;

  // on incorrect input, we stop verifying input until the player re-engages
  // with the screen via a `down`
  private ignoreInputUntilDown: boolean = false;

  constructor(
    private game: Game,
  ) {
    this.attachHandlers();
  }

  public startRound(actionDataList: GameActionData[]) {
    this.targetInput = this.actionsToInput(actionDataList);
    this.nextInputIndex = 0;
    this.checkpointInputIndex = 0;

    this.enableInput();
  }

  private attachHandlers(): void {
    const eventBus = this.game.eventBus();

    eventBus.inputDown.add(this.onInput);
    eventBus.inputDragTarget.add(this.onInput);
    eventBus.inputDragStop.add(this.onInput);
  }

  private enableInput(): void {
    // if we're freshly enabling input, force the first input to be `down`
    if (!this.inputEnabled) {
      this.ignoreInputUntilDown = true;
    }

    this.inputEnabled = true;
    this.game.eventBus().inputEnabled.dispatch(true);
  }

  private disableInput(): void {
    this.inputEnabled = false;
    this.game.eventBus().inputEnabled.dispatch(false);
  }

  private dispatchCorrectInput(expected: GameInput, observed: RawInput): void {
    this.game.eventBus().correctInput.dispatch({ expected, observed });
  }

  private dispatchIncorrectInput(expected: GameInput, observed: RawInput): void {
    this.game.eventBus().incorrectInput.dispatch({ expected, observed });
  }

  private dispatchRoundFail(): void {
    this.game.eventBus().gameRoundFail.dispatch(0);
  }

  private dispatchRoundComplete(): void {
    this.game.eventBus().gameRoundComplete.dispatch(0);
  }

  private nextInput(): GameInput {
    return this.targetInput[this.nextInputIndex];
  }

  private onInput = (observed: RawInput): void => {
    if (!this.inputEnabled) {
      return;
    }

    const expected = this.nextInput();

    if (this.ignoreInputUntilDown) {
      if (observed.type === 'down') {
        this.ignoreInputUntilDown = false;
      } else {
        return;
      }
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

  private isInputComplete(): boolean {
    return this.nextInputIndex === this.targetInput.length;
  }

  private saveInputCheckpoint(): void {
    this.checkpointInputIndex = this.nextInputIndex;
  }

  private onCorrectInput(expected: GameInput, observed: RawInput): void {
    this.nextInputIndex = this.nextInputIndex + 1;

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
    this.nextInputIndex = this.checkpointInputIndex;

    this.dispatchIncorrectInput(expected, observed);
    this.disableInput();
    this.dispatchRoundFail();
    logInputPair(observed, expected, 'incorrect');
  }

  private onCompleteInput() {
    this.disableInput();
    this.dispatchRoundComplete();
  }

  private actionToInput = (actionData: GameActionData): Maybe<GameInput>[] => {
    switch (actionData.type) {
      case 'flash': {
        const { origin } = actionData.opts;

        return [
          { type: 'down', target: cellTarget(origin) },
          { type: 'up', target: cellTarget(origin) },
        ];
      }

      case 'multiflash': {
        const { count, origin } = actionData.opts;

        const flashInput: GameInput[] = [
          { type: 'down', target: cellTarget(origin) },
          { type: 'up', target: cellTarget(origin) },
        ];

        return repeat(count, flashInput);
      }

      case 'path': {
        const { path } = actionData.opts;
        const [origin, ...rest] = path;

        const posToDragInput = type => (gridPos: GridPos): GameInput => ({
          target: cellTarget(gridPos),
          type,
        });

        return [
          posToDragInput('down/drag')(origin),
          ...rest.map(posToDragInput('over/drag')),
          posToDragInput('up/drag')(rest[rest.length - 1]),
        ];
      }

      default: return null;
    }
  }

  private actionsToInput = (actionDataList: GameActionData[]): GameInput[] => {
    return flatten(mapJust(this.actionToInput, actionDataList));
  }
}

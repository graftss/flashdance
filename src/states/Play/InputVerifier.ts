import Game from '../..';
import { cellTarget, flatten, isEqual, mapJust } from '../../utils';

export default class InputVerifier {
  private targetInput: GameInput[];
  private nextInputIndex: number;

  constructor(
    private game: Game,
  ) {
    this.attachHandlers(game);
  }

  private attachHandlers(game: Game) {
    const { eventBus } = game;

    eventBus.inputDown.add(this.onInputDown);
    eventBus.inputDragTarget.add(this.onNewDragTarget);
  }

  private onInputDown = (data: InputTarget) => {
    const nextInput = this.nextInput();

    if (nextInput.type === 'down' && isEqual(nextInput.target, data)) {
      console.log('correct input');
      this.advanceInput();
    } else {
      this.onIncorrectInput();
    }
  };

  private onNewDragTarget = (data: InputTarget) => {
    const nextInput = this.nextInput();

    if (nextInput.type === 'drag' && isEqual(nextInput.target, data)) {
      console.log('correct DRAG input');
      this.advanceInput();
    } else {
      this.onIncorrectInput();
    }
  };

  private advanceInput(): void {
    const nextInputIndex = this.nextInputIndex + 1;

    if (nextInputIndex === this.targetInput.length) {
      this.onCompleteInput();
    } else {
      this.nextInputIndex = nextInputIndex;
    }
  }

  private onIncorrectInput() {
    console.log('wrong input');
  }

  private onCompleteInput() {
    console.log('input completed');
  }

  private actionToInput = (actionData: GameActionData): Maybe<GameInput>[] => {
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
  };

  private actionsToInput = (actionDataList: GameActionData[]): GameInput[] => {
    return flatten(mapJust(this.actionToInput, actionDataList));
  };

  private nextInput(): GameInput {
    return this.targetInput[this.nextInputIndex];
  }

  public startRound(targetInput: GameActionData[]) {
    this.targetInput = this.actionsToInput(targetInput);
    console.log('input', this.targetInput)
    this.nextInputIndex = 0;
  }
}

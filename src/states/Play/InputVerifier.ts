import Game from '../..';
import { isEqual, mapJust } from '../../utils';

export default class InputVerifier {
  private targetInput: GameInput[];
  private nextInputIndex: number;

  constructor(
    private game: Game,
  ) {
    this.attachHandlers(game);
  }

  public startRound(targetInput: GameActionData[]) {
    this.targetInput = this.actionsToInput(targetInput);
    this.nextInputIndex = 0;
  }

  private nextInput(): GameInput {
    return this.targetInput[this.nextInputIndex];
  }

  private advanceInput(): void {
    this.nextInputIndex += 1;
  }

  private attachHandlers(game: Game) {
    const { eventBus } = game;

    eventBus.inputDown.add(this.onInputDown);
  }

  private onInputDown = (data: InputTarget) => {
    const nextInput = this.nextInput();

    switch (nextInput.type) {
      case 'down': {
        if (isEqual(nextInput.target, data)) {
          console.log('correct input');
          this.advanceInput();
        } else {
          console.log('wrong input');
        }
      }
    }
  };

  private actionToInput = (actionData: GameActionData): Maybe<GameInput> => {
    switch (actionData.type) {
      case 'flash': {
        const { col, row } = actionData.opts;

        return { type: 'down', target: { type: 'cell', col, row } };
      }

      default: return null;
    }
  };

  private actionsToInput = (actionDataList: GameActionData[]): GameInput[] => {
    return mapJust(this.actionToInput, actionDataList);
  };
}

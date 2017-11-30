import Game from '../..';
import { mapJust } from '../../utils';

export default class InputVerifier {
  private targetInput: GameInput[];
  private inputStep: number;

  constructor(
    private game: Game,
  ) {
    this.attachHandlers(game);
  }

  private attachHandlers(game: Game) {
    const { eventBus } = game;

    eventBus.inputDownCell.add(this.onInputDownCell);
  }

  private onInputDownCell = ({ row, col }) => {
    console.log('input down cell:', { row, col });
  };

  public startRound(targetInput: GameActionData[]) {
    this.targetInput = this.actionsToInput(targetInput);
    this.inputStep = 0;
  }

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

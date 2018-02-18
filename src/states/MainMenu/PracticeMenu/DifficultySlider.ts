import * as Phaser from 'phaser-ce';

import DoubleSlider from '../../../ui/DoubleSlider';
import Game from '../../../Game';
import Menu from '../../../ui/Menu';
import MenuTextOption from '../../../ui/MenuTextOption';

export default class DifficultySlider extends Menu {
  private slider: DoubleSlider;

  constructor(
    public game: Game,
  ) {
    super(game, 0, 0, 60, [], undefined);
  }

  public init(minDifficulty: number, maxDifficulty: number): void {
    this.alpha = 1;

    const discreteValues = maxDifficulty - minDifficulty;

    this.initSlider(discreteValues);
    this.setOptionColumns(
      this.getOptionColumnData(minDifficulty, maxDifficulty),
    );
  }

  public hide() {
    this.alpha = 0;
  }

  private initSlider(discreteValues: number): void {
    this.slider = new DoubleSlider(
      this.game,
      this,
      20, 0,
      500, 20,
      discreteValues,
    );

    this.slider.onChange.add(this.onDifficultySliderChange);
  }

  private getOptionColumnData(
    minDifficulty: number,
    maxDifficulty: number,
  ): MenuOptionData[][] {
    return [[
      {
        label: this.getLabel(minDifficulty, maxDifficulty),
        onSelect: () => 0,
        type: 'text',
      },
      {
        group: this.slider,
        type: 'group',
        width: 500,
      },
    ]];
  }
  private resetDifficultySlider(discreteValues: number): void {
    this.slider.reset(discreteValues);
  }

  private onDifficultySliderChange = (data: IDoubleSliderEvent) => {
    const { leftDiscrete: l, rightDiscrete: r } = data;

    this.updateMenuOption(0, 0, (textOption: MenuTextOption) => {
      textOption.text.setText(this.getLabel(l + 1, r + 1));
    });
  }

  private getLabel(low: number, high: number) {
    return `difficulty range: ${low}-${high}`;
  }
}

import * as Phaser from 'phaser-ce';

import DoubleSlider from '../../../ui/DoubleSlider';
import Game from '../../../Game';
import Menu from '../../../ui/Menu';
import MenuTextOption from '../../../ui/MenuTextOption';
import { destroy } from '../../../utils';

export default class DifficultySlider extends Menu {
  private slider: DoubleSlider;

  constructor(
    public game: Game,
  ) {
    super(game, 0, 0, 60, []);
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

  public getValues() {
    return this.eventDataToValues(this.slider.getEventData());
  }

  private initSlider(discreteValues: number): void {
    destroy(this.slider);

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
      this.getTextOptionData(minDifficulty, maxDifficulty),
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
    const { maxDifficulty, minDifficulty } = this.eventDataToValues(data);
    const labelData = this.getTextOptionData(minDifficulty, maxDifficulty);

    this.setOptionColumns([[labelData]], [{ col: 0, row: 1 }]);
  }

  private eventDataToValues(data: IDoubleSliderEvent) {
    const { leftDiscrete: l, rightDiscrete: r } = data;

    return { minDifficulty: l + 1, maxDifficulty: r + 1 };
  }

  private getTextOptionData(low: number, high: number): MenuOptionData {
    return {
      label: this.getLabel(low, high),
      onSelect: () => 0,
      type: 'text',
    };
  }

  private getLabel(low: number, high: number) {
    return `difficulty range: ${low}-${high}`;
  }
}

import 'p2';
import 'pixi';
import 'phaser';
import * as Phaser from 'phaser-ce';

import EventBus from './EventBus';
import MainMenu from './states/MainMenu';
import Play from './states/Play';
import SaveFile from './SaveFile';
import Tweener from './Tweener';
import Unlocker from './Unlocker';

export default class Game extends Phaser.Game {
  public eventBus: EventBus;
  public saveData: SaveData;
  public tweener: Tweener;
  public unlocker: Unlocker;

  constructor(...args) {
    super(...args);

    this.eventBus = new EventBus();
    this.saveData = SaveFile.loadSaveData();
    this.tweener = new Tweener(this);
    this.unlocker = new Unlocker(this);

    this.state.add('MainMenu', MainMenu);
    this.state.add('Play', Play);

    // this.state.start('Play', true, true, { type: 'debug' });
    this.state.start('MainMenu');
  }

  // `update` is a unary function which recieves the current save data
  public updateSaveData(update: (SaveData) => SaveData): void {
    SaveFile.updateSaveData(() => update(this.saveData));
  }
}

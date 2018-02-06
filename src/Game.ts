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
  public saveFile: SaveFile;
  public tweener: Tweener;
  public unlocker: Unlocker;

  constructor(...args) {
    super(...args);

    this.saveFile = new SaveFile();
    this.tweener = new Tweener(this);
    this.unlocker = new Unlocker(this);

    this.state.add('MainMenu', MainMenu);
    this.state.add('Play', Play);

    // this.state.start('Play', true, false, { type: 'debug' });
    this.state.start('MainMenu');
  }
}

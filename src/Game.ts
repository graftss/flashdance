import 'p2';
import 'pixi';
import 'phaser';
import * as Phaser from 'phaser-ce';

import EventBus from './EventBus';
import MainMenu from './states/MainMenu';
import Play from './states/Play';
import SaveFile from './SaveFile';
import Tweener from './Tweener';

export default class Game extends Phaser.Game {
  public saveFile: SaveFile;
  public tweener: Tweener;

  constructor(...args) {
    super(...args);

    this.saveFile = new SaveFile();
    this.tweener = new Tweener(this);

    this.state.add('MainMenu', MainMenu);
    this.state.add('Play', Play);

    // this.state.start('Play', true, false, { type: 'debug' });
    this.state.start('MainMenu');
  }

  public boot() {
    super.boot();
    this.stage.disableVisibilityChange = true;
  }

  public eventBus(): EventBus {
    return (this.state.getCurrentState() as any).eventBus;
  }
}

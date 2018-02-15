import Game from './Game';
import Play from './states/Play';

(window as any).run = () => {
  const game = new Game(800, 600, Phaser.AUTO);
};

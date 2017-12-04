import Game from './Game';
import Play from './states/Play';

const game = new Game(800, 600, Phaser.AUTO);

game.state.add('Play', Play);

game.state.start('Play');

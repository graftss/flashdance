const { join } = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      p2: join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
      pixi: join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
      phaser: join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    loaders: [
      { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
      { test: /p2\.js$/, loader: 'expose-loader?p2' },
      { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
      { test: /\.ts$/, loader: 'ts-loader' },
    ]
  }
};

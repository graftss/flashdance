const { join } = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: join(__dirname, 'build'),
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
      { test: /p2\.js$/, loader: 'expose-loader?p2' },
      { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          configFile: 'tslint.json',
          failOnHint: true,
          formatter: 'verbose',
        },
      },
      { test: /\.ts$/, loader: 'ts-loader' },
    ]
  }
};

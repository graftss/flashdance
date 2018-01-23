import * as Phaser from 'phaser-ce';

import Game from '../Game';

/**
* source:
* https://raw.githubusercontent.com/photonstorm/phaser-ce/master/filters/BlurX.js
*/

export default class FlipX extends Phaser.Filter {
  constructor(
    game: Game,
  ) {
    const uniforms = null;

    const fragmentSrc = `
      precision mediump float;
      varying vec2 vTextureCoord;
      varying vec4 vColor;
      uniform float blur;
      uniform sampler2D uSampler;
      uniform vec2 resolution;

      void main(void) {
        float x1 = resolution.x - vTextureCoord.x;
        float y1 = resolution.y;

        gl_FragColor = texture2D(uSampler, vec2(x1, y1));
      }
    `;

    super(game, uniforms, fragmentSrc);
  }
}

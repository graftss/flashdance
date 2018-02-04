import * as Phaser from 'phaser-ce';

import Game from '../Game';

export default class BlurY extends Phaser.Filter {
  constructor(
    game: Game,
  ) {
    const uniforms = {
      blur: { type: '1f', value: 1 / 512 },
    };

    const fragmentSrc = `
      precision mediump float;
      varying vec2 vTextureCoord;
      varying vec4 vColor;
      uniform float blur;
      uniform sampler2D uSampler;

      void main(void) {
        vec4 sum = vec4(0.0);
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;
        gl_FragColor = sum;
      }
    `;

    super(game, uniforms, fragmentSrc);
  }
}

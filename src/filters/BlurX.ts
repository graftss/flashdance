import * as Phaser from 'phaser-ce';

import Game from '../Game';

export default class BlurX extends Phaser.Filter {
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
        sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;
        sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;
        sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;
        sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * .15;
        sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;
        sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * .15;
        sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;
        sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;
        sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;
        gl_FragColor = sum;
      }
    `;

    super(game, uniforms, fragmentSrc);
  }

  public getBlur(): number {
    return this.uniforms.blur.value * 7000;
  }

  public setBlur(value: number): void {
    this.dirty = true;
    this.uniforms.blur.value = value / 7000;
  }
}

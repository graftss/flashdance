import * as Phaser from 'phaser-ce';

import Game from '../Game';

export default class RetroPlasma extends Phaser.Filter {
  private nuts: boolean;

  constructor(
    game: Game,
  ) {
    const uniforms = {
      pixelSize: { type: '1i', value: 12 },
    };

    const fragmentSrc = `
      precision mediump float;

      uniform float time;
      uniform vec2 resolution;
      uniform int pixelSize;

      void main(void) {
        float x = gl_FragCoord.x / resolution.x * 640.0;
        float y = gl_FragCoord.y / resolution.y * 480.0;

        if (pixelSize > 0) {
          x = float(int(x / float(pixelSize)) * pixelSize);
          y = float(int(y / float(pixelSize)) * pixelSize);
        }

        float mov0 = x + y + sin(time) * 10.0 + sin(x / 90.0) * 70.0 + time * 2.0;
        float mov1 = (mov0 / 5.0 + sin(mov0 / 30.0)) / 10.0 + time * 3.0;
        float mov2 = mov1 + sin(mov1) * 5.0 + time;

        float cl1 = sin(sin(mov1 / 4.0 + time) + mov1);
        float c1 = cl1 + mov2 / 2.0 - mov1 - mov2 + time;

        float c2 = sin(
          c1 + sin(mov0 / 100.0 + time) + sin(y / 57.0 + time/50.0) +
          sin((x + y) / 200.0) * 2.0
        );

        float c3 = abs(sin(
          c2 + cos((mov1 + mov2 + c2) / 10.0) + cos((mov2 / 10.0) + sin(x / 80.0))
        ));

        float dc = float(16 - pixelSize);

        if (pixelSize > 0) {
          cl1 = float(int(cl1 * dc)) / dc;
          c2 = float(int(c2 * dc)) / dc;
          c3 = float(int(c3 * dc)) / dc;
        }

        gl_FragColor = vec4(cl1, c2, c3, 1.0);
      }
    `;

    super(game, uniforms, fragmentSrc);

    this.nuts = false;
  }

  public goNuts() {
    this.nuts = true;
  }

  public update() {
    if (this.nuts) {
      this.uniforms.pixelSize.value += 5;
    }

    super.update();
  }
}

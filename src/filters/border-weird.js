export default `
  precision mediump float;

  varying vec2 vTextureCoord;
  varying vec4 vColor;
  uniform sampler2D uSampler;
  uniform float time;

  float s(float t) {
    return 0.25 * sin(t) + 0.5;
  }

  float c(float t) {
    return 0.25 * cos(t) + 0.5;
  }

  void main(void) {
    float t = time * 5.0;
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;

    vec3 corner0 = vec3(s(t + x), c(t + y), c(t - x));
    vec3 corner1 = vec3(s(t - x), s(t + x), c(t + y));
    vec3 corner2 = vec3(c(t + y), s(t + x), c(t - y));
    vec3 corner3 = vec3(s(t - y), c(t + y), s(t + x));

    gl_FragColor = texture2D(uSampler, vTextureCoord);

    if (gl_FragColor.rgb != vec3(0.0)) {
      gl_FragColor.rgb = mix(
        mix(corner0, corner2, vTextureCoord.y),
        mix(corner1, corner3, vTextureCoord.y),
        vTextureCoord.x
      );
      // gl_FragColor.rgb = mix(corner0, corner1, vTextureCoord.x);
    }
  }
`;

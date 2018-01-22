export default `
  precision mediump float;

  varying vec2 vTextureCoord;
  varying vec4 vColor;
  uniform float width;
  uniform float height;
  uniform sampler2D uSampler;
  uniform float time;

  vec3 UPPER_LEFT = vec3(1.0, 0.0, 0.0);
  vec3 UPPER_RIGHT = vec3(0.0, 1.0, 0.0);
  vec3 LOWER_LEFT = vec3(0.0, 0.3, 1.0);
  vec3 LOWER_RIGHT = vec3(1.0, 0.4, 0.0);

  void setColor(vec3 color) {
    gl_FragColor.rgb = color;
  }

  vec3 getColor(float x, float y) {
    return mix(
      mix(UPPER_LEFT, UPPER_RIGHT, x),
      mix(LOWER_LEFT, LOWER_RIGHT, x),
      y
    );
  }

  vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
  }

  vec2 transform(vec2 pos, vec2 d, float a) {
    vec2 result = pos + d;
    result = rotate(result, a);
    result = result - d;
    return result;
  }

  void main(void) {
    float t = time;
    vec2 pos = vec2(gl_FragCoord.x / width, gl_FragCoord.y / height);
    pos *= 10.0;
    pos = transform(pos, vec2(0), t);

    gl_FragColor = texture2D(uSampler, vTextureCoord);

    // if (gl_FragColor.rgb != vec3(0.0)) {
      setColor(getColor(pos.x, pos.y));
    // }
  }
`;

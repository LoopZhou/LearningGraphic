uniform sampler2D colorTexture;
uniform float time;
varying vec2 vUv;

// uv动画
void main () {
  vec3 tex = texture2D(colorTexture, vec2(fract(vUv.x + time * 0.1), vUv.y)).rgb;
  gl_FragColor = vec4(tex, 1.0);
}
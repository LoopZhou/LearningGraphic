uniform sampler2D colorTexture;

varying vec2 vUv;

// 负片
void main () {
  vec3 tex = texture2D(colorTexture, vUv).rgb;
  vec3 reverse = vec3(1.0) - tex.rgb;
  gl_FragColor = vec4(reverse, 1);
}

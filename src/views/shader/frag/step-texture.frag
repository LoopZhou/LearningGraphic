uniform sampler2D colorTexture;

varying vec2 vUv;

// 黑白
void main () {
  vec3 tex = texture2D(colorTexture, vUv).rgb;
  // 灰度化
  float gray = (tex.r + tex.g + tex.b)/3.0;
  // 取代 if-else 的代码, gray<0.5, 就返回0， 否则返回1
  float bw = step(0.5, gray);
  gl_FragColor = vec4(bw, bw, bw, 1);
}
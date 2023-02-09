uniform sampler2D colorTexture;

varying vec2 vUv;

// 灰度
void main () {
  vec3 tex = texture2D(colorTexture, vUv).rgb;
  // 灰度化
  float gray = (tex.r + tex.g + tex.b)/3.0;
  gl_FragColor = vec4(gray, gray, gray, 1);
}
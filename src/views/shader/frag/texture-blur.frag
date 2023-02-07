uniform sampler2D colorTexture;

varying vec2 vUv;

// 渐变
void main () {
  // texture2D 第三个参数值越大，越模糊
  vec4 tex = texture2D(colorTexture, vUv, 6.0).rgba;
  // 颜色过渡
  gl_FragColor = tex;
}
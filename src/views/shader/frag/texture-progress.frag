uniform sampler2D colorTexture;
uniform float time;
varying vec2 vUv;

// 模拟进度条
void main () {
  float strength = 0.5;
  float progress = fract(time * 0.3);
  vec4 tex = texture2D(colorTexture, vUv, 6.0).rgba;
  vec4 color = vec4(1.0, 0.0, 0.0, 1.0);

  // 从下到上, vUV.x则是从左到右
  if ( vUv.y < progress) {
    gl_FragColor = mix(tex, color, strength);
  } else {
    gl_FragColor = tex;
  }
}
uniform sampler2D colorTexture;
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// 利用uv绘制圆形
void main () {
  // 利用uv把坐标设置成[-0.5, 0.5], [0,0]在中心

  vec2 uv = (gl_FragCoord.xy - resolution.xy) / min(resolution.y, resolution.x);
  /*
  // 上面uv转换相当于：xy轴等比例缩放
  vec2 uv = 2.0 * vUv - 1.0;
  if (resolution.x > resolution.y) {
    uv.x *= resolution.x / resolution.y;
  } else {
    uv.y *= resolution.y / resolution.x;
  }
  */
  // gl_FragColor = vec4(uv, 1.0, 1.0);

  float len = length(uv);
  float r = 0.2;
  float c = step(r, len);
  gl_FragColor = vec4(vec3(1.0 - c), 1.0);
}
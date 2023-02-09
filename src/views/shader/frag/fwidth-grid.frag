uniform vec2 resolution;

varying vec2 vUv;

vec2 fixUV() {
  vec2 uv = (gl_FragCoord.xy - resolution.xy) / min(resolution.y, resolution.x);
  return uv;
}

// 网格
vec3 grid(in vec2 uv) {
  vec3 color = vec3(0.0);

  // 网格使用fract取小数[0,1]
  // 直接使用fract(uv)，假如是0.1， 画面上是0-0.1是白色
  // vec2 cell = fract(uv);
  // 这里平分cell
  vec2 cell = 1.0 - 2.0 * abs(fract(uv) - 0.5 );

  // 配置成0.01数字表示线的宽度，使用fwidth模拟一个像素
  if (abs(uv.y) < fwidth(uv.y)) {
    // x坐标
    color = vec3(1.0, 0.0, 0.0);
  } else if (abs(uv.x) < fwidth(uv.x)) {
    // y坐标
    color = vec3(0.0, 1.0, 0.0);
  } else if (cell.x < fwidth(uv.x)|| cell.y < fwidth(uv.y)) {
    // 网格
    color = vec3(1.0);
  }

  return color;
}

// 网格
void main () {
  // 利用uv把坐标设置成[-3, 3], [0,0]在中心
  vec2 uv = 3.0 * fixUV();
  vec3 color = grid(uv);
  gl_FragColor = vec4(color, 1.0);
}
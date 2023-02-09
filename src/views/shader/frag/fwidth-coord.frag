varying vec2 vUv;

// fwidth函数：相邻点相减
void main () {
  // 利用uv把坐标设置成[-3, 3], [0,0]在中心
  vec2 uv = 3.0 * (-1.0 + 2.0 * vUv);

  vec3 color = vec3(0.0);

  // 网格使用fract取小数[0,1]
  vec2 cell = fract(uv);
  if (cell.x < fwidth(uv.x) || cell.y < fwidth(uv.y)) {
    color = vec3(1.0);
  }

  // 配置成0.01数字表示线的宽度，使用fwidth模拟一个像素
  // x坐标
  if (abs(uv.y) < fwidth(uv.y)) {
    color = vec3(1.0, 0.0, 0.0);
  }

  // y坐标
  if (abs(uv.x) < fwidth(uv.x)) {
    color = vec3(0.0, 1.0, 0.0);
  }

  // 白色圆
  gl_FragColor = vec4(color, 1.0);

}
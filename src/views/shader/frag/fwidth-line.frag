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

// 绘制线段
float segment(in vec2 p, in vec2 a, in vec2 b, in float w) {
  float f = 0.0;
  // a指向b的向量
  vec2 ba = b - a;
  // uv点p
  vec2 pa = p - a;
  // clamp: 限制数值在最小值和最大值之间（0，1），限制线段
  // 点乘算cosθ夹角
  float proj = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  // 不限制是没有限制的线
  // float proj = dot(pa, ba) / dot(ba, ba);
  // 距离
  float d = length(proj * ba - pa);
  if (d <= w) {
    f = 1.0;
  }
  return f;
}

// 网格
void main () {
  // 利用uv把坐标设置成[-3, 3], [0,0]在中心
  vec2 uv = 3.0 * fixUV();
  vec3 color = grid(uv);

  // 绘制线段
  // color += vec3(segment(uv, vec2(1.0, 2.0), vec2(-2.0, -2.0), fwidth(uv.x)));
  // 混合使用mix
  float isLine = segment(uv, vec2(1.0, 2.0), vec2(-2.0, -2.0), fwidth(uv.x));
  // mix混合函数，把color和yellow颜色混合，最后一个参数混合比例，0:全部是color, 1:全部是yellow
  color = mix(color, vec3(0.0, 1.0, 0.0), isLine);
  gl_FragColor = vec4(color, 1.0);
}
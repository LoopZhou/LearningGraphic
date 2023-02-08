#define PI 3.14159

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
  // if (abs(uv.y) < fwidth(uv.y)) {
  //   // x坐标
  //   color = vec3(1.0, 0.0, 0.0);
  // } else if (abs(uv.x) < fwidth(uv.x)) {
  //   // y坐标
  //   color = vec3(0.0, 1.0, 0.0);
  // } else if (cell.x < fwidth(uv.x)|| cell.y < fwidth(uv.y)) {
  //   // 网格
  //   color = vec3(1.0);
  // }

  // 使用smoothstep替换if
  // 网格x
  color = vec3(smoothstep(2.0 * fwidth(uv.x), 1.9 * fwidth(uv.x), cell.x));
  // 网格y (* 是交集，会呈现网格点， + 是并集)
  // color *= vec3(smoothstep(2.0 * fwidth(uv.y), 1.9 * fwidth(uv.y), cell.y));
  color += vec3(smoothstep(2.0 * fwidth(uv.y), 1.9 * fwidth(uv.y), cell.y));
  // y轴(并集，消除b)
  color.rb *= smoothstep(1.9 * fwidth(uv.x), 2.0 * fwidth(uv.x), abs(uv.x));
  // x轴(并集，消除r)
  color.gb *= smoothstep(1.9 * fwidth(uv.y), 2.0 * fwidth(uv.y), abs(uv.y));
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
  // if (d <= w) {
  //   f = 1.0;
  // }
  // 使用smoothstep代替if让变换平滑
  f = smoothstep(w, 0.95*w, d);
  return f;
}

float func(in float x) {
  // 0到1中间数字平缓变化, 左边小，纵坐标是从0变换到1
  return smoothstep(0.0, 1.0, x);
  // 左边大，纵坐标是从1变换到0
  // return smoothstep(1.0, 0.0, x);
}

vec2 fixCoord(in vec2 c) {
  return 3.0 * (2.0 * c  - resolution.xy) / min(resolution.y, resolution.x);
}

float funcPlot(in vec2 uv) {
  float f = 0.0;
  // 从左到右的遍历，画一个线段
  for(float x = 0.0; x <= resolution.x; x += 1.0) {
    // fixed x: x坐标修正
    float fx = fixCoord(vec2(x, 0.0)).x;
    float nfx = fixCoord(vec2(x + 1.0, 0.0)).x;
    f += segment(uv, vec2(fx, func(fx)), vec2(nfx, func(nfx)), fwidth(uv.x));
  }
  
  // 有加法，规整到[0, 1];
  return clamp(f, 0.0, 1.0);
}

// 网格
void main () {
  // 利用uv把坐标设置成[-3, 3], [0,0]在中心
  vec2 uv = 3.0 * fixUV();
  vec3 color = grid(uv);

  // 绘制sin线段
  float isLine = funcPlot(uv);
  // mix混合函数，把color和yellow颜色混合，最后一个参数混合比例，0:全部是color, 1:全部是yellow
  color = mix(color, vec3(0.5, 0.5, 0.0), isLine);
  gl_FragColor = vec4(color, 1.0);
}
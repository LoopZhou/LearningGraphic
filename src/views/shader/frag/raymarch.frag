// z轴的距离
#define TMIN 0.1
#define TMAX 20.
// 最大迭代次数
#define RAYMARCH_TIME 128
// 精度
#define PRECISION .001
// 采样
#define AA 3

uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

// 中心变为(0,0)坐标
vec2 fixUV() {
  vec2 uv = (gl_FragCoord.xy - resolution.xy) / min(resolution.y, resolution.x);
  return uv;
}

float sdfSphere(in vec3 p) {
  // 圆心（0，0，0）， 圆半径0.5
  return length(p) - 0.5;
  // 圆心（0，0，2）， 圆半径1.5
  // return length(p - vec3(0., 0., 2.)) - 1.5;
}

// ro原点， rd射线方向
float rayMarch(in vec3 ro, in vec3 rd) {
  float t = TMIN;
  for(int i = 0; i < RAYMARCH_TIME && t < TMAX; i++) {
	  // 当前位置
    vec3 p = ro + t * rd;
    float d = sdfSphere(p);
    // 小于精度，返回t
    if(d < PRECISION)
      break;

    t += d;
  }
  return t;
}

// https://iquilezles.org/articles/normalsSDF
// 计算法向量
vec3 calcNormal(in vec3 p) {
  const float h = 0.0001;
  const vec2 k = vec2(1, -1);
  return normalize(k.xyy * sdfSphere(p + k.xyy * h) +
      k.yyx * sdfSphere(p + k.yyx * h) +
      k.yxy * sdfSphere(p + k.yxy * h) +
      k.xxx * sdfSphere(p + k.xxx * h));
}

vec3 render(vec2 uv) {
  vec3 color = vec3(0.);
  // 摄像机位置
  vec3 ro = vec3(0., 0., -1.5);
  // 射线方向，屏幕上的点指向摄像机
  vec3 rd = normalize(vec3(uv, 0.) - ro);
  // raymarch获得球的交点
  float t = rayMarch(ro, rd);
  // 小于说明有交点
  if(t < TMAX) {
    // color = vec3(1.);  
    // 交点坐标
    vec3 p = ro + t * rd;
    // 法向量
    vec3 n = calcNormal(p);
    // 光源
    vec3 light = vec3(1., 3., 0.);
    // vec3 light = vec3(2. * cos(time - 2.0), 1., 2. * sin(time - 2.0) + 2.);
    float dif = clamp(dot(normalize(light - p), n), 0., 1.);
    // 环境光
    float amb = 0.5 + 0.5 * dot(n, vec3(0., 1., 0.));
    color = amb * vec3(0.23) + dif * vec3(1.);
  }

  // return color;
  // gamma矫正
  return sqrt(color);
}

vec2 fixCoord(in vec2 c) {
  vec2 uv = (c - resolution.xy) / min(resolution.y, resolution.x);
  return uv;
}

void main () {
  // 利用uv把坐标设置成[-1, 1], [0,0]在中心
  vec2 uv = fixUV();
  // vec3 color = render(uv);
  // gl_FragColor = vec4(color, 1.0);

  // 上下左右平移采样用于平滑边缘
  vec3 color = vec3(0.);
  for(int m = 0; m < AA; m++) {
    for(int n = 0; n < AA; n++) {
      // 偏移量
      vec2 offset = 2. * (vec2(float(m), float(n)) / float(AA) - .5);
      vec2 uv = fixCoord(gl_FragCoord.xy + offset);
      color += render(uv);
    }
  }
  gl_FragColor = vec4(color / float(AA * AA), 1.);
}
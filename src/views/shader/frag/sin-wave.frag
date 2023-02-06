uniform float time;
varying vec2 vUv;

// wave

/*
y = Asin(ωx ± φt) + k

A：「振幅（Amplitude）」，曲线最高点与最低点的差值，表现为曲线的整体高度
ω：「角速度（Angular Velocity）」，控制曲线的周期，表现为曲线的紧密程度
φ：「初相（Initial Phase）」，即当 x = 0 时的相位，表现为曲线在坐标系上的水平位置
k：「偏距（Offset）」，表现为曲线在坐标系上的垂直位置
*/
void main () {
  float amplitude = 0.05;

  float angularVelocity = 10.0;

  float frequency = 10.0;

  float offset = 0.5;

  float initialPhase = frequency * time;

  float y = amplitude * sin((angularVelocity * vUv.x) + initialPhase) + offset;

  vec4 color = vUv.y > y ? vec4(0.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.7, 0.9, 1.0);

  gl_FragColor = color;
}
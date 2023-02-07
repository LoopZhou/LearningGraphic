uniform sampler2D colorTexture;
uniform float time;
varying vec2 vUv;

// 利用uv绘制圆形
void main () {
  // 利用uv把坐标设置成[-0.5, 0.5], [0,0]在中心
  vec2 uv = vUv - vec2(0.5);

  // 中间0， 边缘1渐变效果
  float len = length(uv);
  // gl_FragColor = vec4(vec3(len), 1.0);
  
  float r = 0.2;
  float c = step(r, len);
  // 黑色圆
  // gl_FragColor = vec4(vec3(c), 1.0);
  // 白色圆
  gl_FragColor = vec4(vec3(1.0 - c), 1.0);
}
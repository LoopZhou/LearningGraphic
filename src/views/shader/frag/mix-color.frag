uniform float time;

// 渐变
void main () {
  vec4 red = vec4(1,0,0,1);
  vec4 blue = vec4(0,0,1,1);
  // sin限制在[-1,1],abs限制在[0,1]
  float t = abs(sin(time * 0.5));
  // 颜色过渡
  gl_FragColor = mix(red, blue, t);
}
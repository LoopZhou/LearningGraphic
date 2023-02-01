uniform float time;

uniform sampler2D colorTexture;

varying vec2 vUv;

// 渐变
void main () {
  vec4 tex = texture2D(colorTexture, vUv).rgba;
  vec4 black = vec4(0,0,0,1);
  // sin限制在[-1,1],abs限制在[0,1]
  float t = abs(sin(time * 0.5));
  // 颜色过渡
  gl_FragColor = mix(tex, black, t);
}
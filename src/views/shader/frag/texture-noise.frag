uniform sampler2D colorTexture;
uniform sampler2D noiseTexture;
uniform float time;
varying vec2 vUv;

// noise模拟水流效果
void main () {
  vec3 noise = texture2D(noiseTexture, vec2(fract(vUv.x + time * 0.1), vUv.y)).rgb;
  // noise相当于随机值
  vec2 uv = vUv + noise.gb * 0.1;
  gl_FragColor = texture2D(colorTexture, uv);
}
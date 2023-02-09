uniform sampler2D colorTexture;
uniform sampler2D noiseTexture;
uniform float time;
varying vec2 vUv;

// 溶解效果
void main () {
  vec3 tex = texture2D(colorTexture, vUv).rgb;
  vec3 noise = texture2D(noiseTexture, vUv).rgb;
  float value = abs(sin(time * 0.3));
  gl_FragColor = vec4(tex, step(noise.r, value));
}
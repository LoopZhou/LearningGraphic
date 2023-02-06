uniform sampler2D colorTexture;
uniform sampler2D noiseTexture;
uniform float time;
varying vec2 vUv;

// 马赛克
void main () {
  float m_n = 3.0;
  vec2 pixel_num = vec2(512.0, 512.0) / m_n;
  // floor向下取整： 把某一个范围内的uv坐标映射为一个固定的坐标，这个范围内取到的值相同
  // vec2 pixel_uv = floor(vUv * pixel_num) / pixel_num;
  // round四舍五入，也可以把一个范围坐标映射成一个固定值；round的色块是floor的四分之一
  vec2 pixel_uv = round(vUv * pixel_num) / pixel_num;
  gl_FragColor = texture2D(colorTexture, pixel_uv);

  // vec3 noise = texture2D(noiseTexture, fract(vUv + time * 0.1)).rgb;
  // float noise_value = noise.r;
  // gl_FragColor = texture2D(colorTexture, pixel_uv + noise_value * 0.1);
}
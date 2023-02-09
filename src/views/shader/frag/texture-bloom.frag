uniform sampler2D colorTexture;

varying vec2 vUv;

// 2d texture bloom
void main () {
  // 转换uv坐标，0.5，0.5 为原点，其他四周取距离
  /*
  1    x    1
  x    0    x
  1    x    1
  */
  float value = distance(vUv, vec2(0.5, 0.5));
  

  vec4 tex = texture2D(colorTexture, vUv).rgba;
  vec3 color = vec3(1.0, 1.0, 0.0);
  // 颜色过渡
  vec4 bloom = vec4(color, smoothstep(0.1, 0.7, value));
  // gl_FragColor = bloom;
  gl_FragColor = mix(tex, bloom, smoothstep(0.3, 0.7, value));
}
uniform sampler2D colorTexture;
uniform float time;
varying vec2 vUv;

// mask
void main () {
  vec3 tex = texture2D(colorTexture, vUv).rgb;
  // mask颜色
  vec3 mask_base_color = vec3(0.0, 0.0, 0.0);
  // 灰度化
  float gray = (tex.r + tex.g + tex.b)/3.0;

  vec3 mask_color = gray * mask_base_color;
  float mask_x = vUv.x;
  // |sin(x)|正弦波渐变效果
  // float mask = abs(sin(mask_x + time * 0.5));
  // float mask = step(0.5, abs(sin(mask_x + time * 0.5)));
  float mask = smoothstep(0.4, 0.6, abs(sin(mask_x + time * 0.5)));

  vec3 i = mix(tex, mask_color, mask);

  gl_FragColor = vec4(i, 1);
}
uniform float time;
uniform sampler2D colorTexture;

varying vec2 vUv;

// uniform float v;
// uniform float h;

// 点状特效
void main () {
  float size = 64.0;
  vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
  float v = 512.0;
  float h = 512.0;

  vec2 ratio = vec2(1.0, v/h);
  vec2 pixelated_uv = floor(vUv * size * ratio) / (size * ratio);
  float dots = length(fract(vUv * size * ratio) - vec2(0.5)) * 2.0;
  dots = (1.0 - dots) * 10.0;
  dots = clamp(dots, 0.0, 1.0);

  gl_FragColor = mix(color, texture(colorTexture, pixelated_uv - time * 0.01), dots);
}
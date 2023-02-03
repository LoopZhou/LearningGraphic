uniform sampler2D colorTexture;
uniform sampler2D blendTexture;

varying vec2 vUv;

vec4 multiply(vec4 base, vec4 blend) {
  return base * blend;
}

// 图层混合
void main () {
  vec4 tex = texture2D(colorTexture, vUv);
  vec4 blend = texture2D(blendTexture, vUv);

  gl_FragColor = multiply(tex, blend);
}
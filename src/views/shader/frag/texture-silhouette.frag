uniform sampler2D whiteDocTexture;

varying vec2 vUv;

// 利用alpha完成剪影效果
void main () {
  vec4 tex_color = texture2D(whiteDocTexture, vUv);
  vec3 color = vec3(1.0, 1.0, 0.0);

  gl_FragColor = vec4(color, step(0.01, tex_color.a));
}


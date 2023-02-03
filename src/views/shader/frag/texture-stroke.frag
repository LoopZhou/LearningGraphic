// uniform sampler2D colorTexture;
uniform sampler2D whiteDocTexture;

uniform float v;
uniform float h;

varying vec2 vUv;

// stoke描边
void main () {
  vec4 tex_color = texture2D(whiteDocTexture, vUv);

  float alpha = 4.0*tex_color.a;
  alpha -= texture2D(whiteDocTexture, vUv+vec2(v, 0)).a;
  alpha -= texture2D(whiteDocTexture, vUv+vec2(-v, 0)).a;
  alpha -= texture2D(whiteDocTexture, vUv+vec2(0, h)).a;
  alpha -= texture2D(whiteDocTexture, vUv+vec2(0, h)).a;

  vec4 final_color = mix(tex_color, vec4(0,0,0,1), clamp(alpha, 0.0, 1.0));
  gl_FragColor = vec4(final_color.rgb, clamp(alpha+tex_color.a, 0.0, 1.0));
}


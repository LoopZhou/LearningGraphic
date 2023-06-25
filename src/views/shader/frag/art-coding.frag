// https://www.shadertoy.com/view/mtyGWy
// https://www.bilibili.com/video/BV1DM4y1n7eB/?spm_id_from=333.999.0.0
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

vec2 fixUV() {
  vec2 uv = (gl_FragCoord.xy - resolution.xy) / min(resolution.y, resolution.x);
  return uv;
}

vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263,0.416,0.557);

  return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
  // vec2 uv = (gl_FragCoord * 2.0 - resolution.xy) / resolution.y;
  vec2 uv = fixUV();
  vec2 uv0 = uv;
  vec3 finalColor = vec3(0.0);

  for (float i = 0.0; i < 4.0; i++) {
    uv = fract(uv * 1.5) - 0.5;

    float d = length(uv) * exp(-length(uv0));

    vec3 col = palette(length(uv0) + i*.4 + time*.4);

    d = sin(d*8. + time)/8.;
    d = abs(d);

    d = pow(0.01 / d, 1.2);

    finalColor += col * d;
  }
        
  gl_FragColor = vec4(finalColor, 1.0);
}
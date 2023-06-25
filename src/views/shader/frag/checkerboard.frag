// https://www.shadertoy.com/view/ldBXz3
#define samp 30.
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

float grid(vec2 p) {
  vec2 orient = normalize(vec2(1.0,3.0));
  vec2 perp = vec2(orient.y, -orient.x);
  float g = mod(floor(1. * dot(p, orient)) + floor(1. * dot(p, perp)), 2.);
  return g;
}

void main() {
  vec2 p = gl_FragCoord.xy / 50. + vec2(-time, time);
  vec2 q = (gl_FragCoord.xy - (resolution.xy / 2.)) / resolution.x / 1.5 ;
  vec4 c = vec4(grid(p));

  if (q.x + 0.1 * q.y > 100.) {
    gl_FragColor = c;
  } else {
    vec4 cc = vec4(0.0);
    float total = 0.0;
    
    float radius = length(q) * 100.;
    for (float t = -samp; t <= samp; t++) {
      float percent = t / samp;
      float weight = 1.0 - abs(percent);
	    float u = t / 100.;
      vec2 dir = vec2(fract(sin(537.3 * (u + 0.5)) ) , fract(sin(523.7 * (u + 0.25)) ));
      dir = normalize(dir) * 0.01;
      float skew = percent * radius;
      vec4 samplev = vec4(
          grid(vec2(0.03,0.) + p +  dir * skew),
          grid(radius * vec2(0.005,0.00) + p +  dir * skew),
          grid(radius * vec2(0.007,0.00) + p +  dir * skew),
          1.0);
      cc = cc + samplev * weight;
      total = total + weight;
    }

    gl_FragColor = cc / total - length(q) * vec4(1.,1.,1.,1.) * 1.5;
  }
}

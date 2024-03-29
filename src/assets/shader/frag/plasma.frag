// accoding to https://www.shadertoy.com/view/XsVSDz
uniform float time;

uniform sampler2D colorTexture;

varying vec2 vUv;

void main(void){
  vec2 vp = vec2(320.0, 200.0);
  float t = time * 10.0;
  vec2 p0 = (vUv - 0.5) * vp;
  vec2 hvp = vp * 0.5;

  vec2 p1d = vec2(cos( t / 98.0),  sin( t / 178.0)) * hvp - p0;
	vec2 p2d = vec2(sin(-t / 124.0), cos(-t / 104.0)) * hvp - p0;
	vec2 p3d = vec2(cos(-t / 165.0), cos( t / 45.0))  * hvp - p0;
  
  float sum = 0.5 + 0.5 * (
		cos(length(p1d) / 30.0) +
		cos(length(p2d) / 20.0) +
		sin(length(p3d) / 25.0) * sin(p3d.x / 20.0) * sin(p3d.y / 15.0));
  
  gl_FragColor=texture2D(colorTexture, vec2(fract(sum), 0));
}
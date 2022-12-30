uniform float time;

uniform sampler2D colorTexture;

varying vec2 vUv;

void main(void){
  
  vec2 position=-1.+2.*vUv;
  
  float a=atan(position.y,position.x);
  float r=sqrt(dot(position,position));
  
  vec2 uv;
  uv.x=cos(a)/r;
  uv.y=sin(a)/r;
  uv/=10.;
  uv+=time*.05;
  
  vec3 color=texture2D(colorTexture,uv).rgb;
  
  gl_FragColor=vec4(color*r*1.5,1.);
  
}
uniform float time;

uniform float fogDensity;
uniform vec3 fogColor;

uniform sampler2D texture1;
uniform sampler2D texture2;

uniform vec2 uvScale;

varying vec2 vUv;

void main(void){
  vec2 sUv = uvScale * vUv;
  vec2 position=-1.+2.*sUv;
  
  vec4 noise=texture2D(texture1,sUv);
  vec2 T1=sUv+vec2(1.5,-1.5)*time*.02;
  vec2 T2=sUv+vec2(-.5,2.)*time*.01;
  
  T1.x+=noise.x*2.;
  T1.y+=noise.y*2.;
  T2.x-=noise.y*.2;
  T2.y+=noise.z*.2;
  
  float p=texture2D(texture1,T1*2.).a;
  
  vec4 color=texture2D(texture2,T2*2.);
  vec4 temp=color*(vec4(p,p,p,p)*2.)+(color*color-.1);
  
  if(temp.r>1.){temp.bg+=clamp(temp.r-2.,0.,100.);}
  if(temp.g>1.){temp.rb+=temp.g-1.;}
  if(temp.b>1.){temp.rg+=temp.b-1.;}
  
  gl_FragColor=temp;
  
  float depth=gl_FragCoord.z/gl_FragCoord.w;
  const float LOG2=1.442695;
  float fogFactor=exp2(-fogDensity*fogDensity*depth*depth*LOG2);
  fogFactor=1.-clamp(fogFactor,0.,1.);
  
  gl_FragColor=mix(gl_FragColor,vec4(fogColor,gl_FragColor.w),fogFactor);
  
}
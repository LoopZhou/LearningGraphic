varying vec2 vUv;

uniform float time;

void main(){
  vec2 p=-1.+2.*vUv;
  float a=time*40.;
  float d,e,f,g=1./40.,h,i,r,q;

  e=400.*(p.x*.5+.5);
  f=400.*(p.y*.5+.5);
  i=200.+sin(e*g+a/150.)*20.;
  d=200.+cos(f*g/2.)*18.+cos(e*g)*7.;
  r=sqrt(pow(abs(i-e),2.)+pow(abs(d-f),2.));
  q=f/r;
  e=(r*cos(q))-a/2.;
  f=(r*sin(q))-a/2.;
  d=sin(e*g)*176.+sin(e*g)*164.+r;
  h=((f+d)+a/2.)*g;
  i=cos(h+r*p.x/1.3)*(e+e+a)+cos(q*g*6.)*(r+h/3.);
  h=sin(f*g)*144.-sin(e*g)*212.*p.x;
  h=(h+(f-e)*q+sin(r-(a+h)/7.)*10.+i/4.)*g;
  i+=cos(h*2.3*sin(a/350.-q))*184.*sin(q-(r*4.3+a/12.)*g)+tan(r*g+h)*184.*cos(r*g+h);
  i=mod(i/5.6,256.)/64.;
  if(i<0.)i+=4.;
  if(i>=2.)i=4.-i;
  d=r/350.;
  d+=sin(d*d*8.)*.52;
  f=(sin(a*g)+1.)/2.;
  gl_FragColor=vec4(vec3(f*i/1.6,i/2.+d/13.,i)*d*p.x+vec3(i/1.3+d/8.,i/2.+d/18.,i)*d*(1.-p.x),1.);
}
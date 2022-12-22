var e=Object.defineProperty,t=(t,n,r)=>(((t,n,r)=>{n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r})(t,"symbol"!=typeof n?n+"":n,r),r);import{W as n,S as r,O as a,B as i,a as o,M as s,b as l}from"./three.module.e3b07b69.js";import{_ as d,r as c,g as u,o as g,c as h,p as m,b as v,a as p}from"./index.2102f57e.js";class f{constructor(){t(this,"scene",null),t(this,"camera",null),t(this,"renderer",null),this.init()}init(){this.initRender(),this.initScene(),this.initCamera(),this.initGeometry(),this.render()}initRender(){const e=document.getElementById("three");this.renderer=new n({antialias:!0}),this.renderer.setSize((null==e?void 0:e.clientWidth)||0,(null==e?void 0:e.clientHeight)||0),this.renderer.setClearColor(16777215,1),null==e||e.appendChild(this.renderer.domElement)}initScene(){this.scene=new r}initCamera(){this.camera=new a(-100,100,-100,0,-.1,1e3)}initGeometry(){var e;const t=new i,n=new Float32Array([100,0,0,0,-100,0,-100,0,0]);t.setAttribute("position",new o(n,3));const r=new s({color:16711680}),a=new l(t,r);null==(e=this.scene)||e.add(a)}render(){this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera)}}const w={name:"RenderTriangle",setup(){const e=c("attribute vec4 a_position;\n\nvoid main () {\n  gl_Position = a_position;\n}"),t=c("void main () {\n  gl_FragColor = vec4(1, 0, 0, 1);\n}"),n=(e,t,n)=>{const r=e.createShader(n);return e.shaderSource(r,t),e.compileShader(r),r},r=()=>{if(navigator.gpu)return void(async()=>{const e=await navigator.gpu.requestAdapter(),t=await e.requestDevice(),n=document.getElementById("webgpu").getContext("webgpu");n.configure({device:t,format:"bgra8unorm",compositingAlphaMode:"opaque"});const r={vertex:"\n    @stage(vertex)\n    fn main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {\n      var pos = array<vec2<f32>, 3>(\n        vec2<f32>(0.0, 1.0),\n        vec2<f32>(-1.0, -1.0),\n        vec2<f32>(1.0, -1.0)\n      );\n      return vec4<f32>(pos[VertexIndex], 0.0, 1.0);\n    }\n  ",fragment:"\n    @stage(fragment)\n    fn main() -> @location(0) vec4<f32> {\n      return vec4<f32>(1.0, 0.0, 0.0, 1.0);\n    }\n  "},a=await t.createRenderPipelineAsync({vertex:{module:t.createShaderModule({code:r.vertex}),entryPoint:"main"},fragment:{module:t.createShaderModule({code:r.fragment}),entryPoint:"main",targets:[{format:"bgra8unorm"}]},primitiveTopology:"triangle-list"}),i={colorAttachments:[{view:n.getCurrentTexture().createView(),clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",loadValue:{r:1,g:1,b:1,a:1},storeOp:"store"}]},o=t.createCommandEncoder(),s=o.beginRenderPass(i);s.setPipeline(a),s.draw(3,1,0,0),s.end?s.end():s.endPass();const l=o.finish();t.queue.submit([l])})();const e=document.getElementById("webgpu").getContext("2d");e.font="20px Georgia",e.fillText("Not Support",10,50)};u((()=>{(()=>{const e=document.getElementById("2d").getContext("2d");e.fillStyle="red",e.strokeStyle="red",e.moveTo(0,100),e.lineTo(100,0),e.lineTo(200,100),e.lineTo(0,100),e.stroke(),e.fill()})(),(()=>{const r=document.getElementById("webgl").getContext("webgl2");r.clearColor(1,1,1,1),r.clear(r.COLOR_BUFFER_BIT),r.viewport(0,0,200,100);const a=r.createProgram(),i=n(r,e.value,r.VERTEX_SHADER),o=n(r,t.value,r.FRAGMENT_SHADER);r.attachShader(a,i),r.attachShader(a,o),r.linkProgram(a),r.useProgram(a);const s=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,s),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,0,1]),r.STATIC_DRAW);const l=r.getAttribLocation(a,"a_position");r.vertexAttribPointer(l,2,r.FLOAT,!1,2*Float32Array.BYTES_PER_ELEMENT,0),r.enableVertexAttribArray(l),r.drawArrays(r.TRIANGLES,0,3)})(),r(),new f}))}},b=e=>(m("data-v-50c09080"),e=e(),v(),e),y=[b((()=>p("h3",null,"triange - css",-1))),b((()=>p("div",{class:"triangle-css"},null,-1))),b((()=>p("h3",null,"triange - svg",-1))),b((()=>p("svg",{xmlns:"http://www.w3.org/2000/svg",viewport:"0,0,200,100",width:"200",height:"100"},[p("polygon",{points:"0,100 100,0 200,100",style:{fill:"red"}})],-1))),b((()=>p("h3",null,"triange - canvas",-1))),b((()=>p("canvas",{id:"2d",width:"200",height:"100"},null,-1))),b((()=>p("h3",null,"triange - webgl",-1))),b((()=>p("canvas",{id:"webgl",width:"200",height:"100"},null,-1))),b((()=>p("h3",null,"triange - webgpu",-1))),b((()=>p("canvas",{id:"webgpu",width:"200",height:"100"},null,-1))),b((()=>p("h3",null,"triange - three",-1))),b((()=>p("div",{id:"three",style:{width:"200px",height:"100px"}},null,-1)))];var x=d(w,[["render",function(e,t,n,r,a,i){return g(),h("div",null,y)}],["__scopeId","data-v-50c09080"]]);export{x as default};

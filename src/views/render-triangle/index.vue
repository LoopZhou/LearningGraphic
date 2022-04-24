<template>
  <div>
    <!-- <h2>渲染方式对比: 红色三角形</h2> -->
    <h3>triange - css</h3>
    <div class="triangle-css" />

    <h3>triange - svg</h3>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewport="0,0,200,100"
      width="200"
      height="100"
    >
      <polygon points="0,100 100,0 200,100" style="fill: red" />
    </svg>

    <h3>triange - canvas</h3>
    <canvas id="2d" width="200" height="100" />

    <h3>triange - webgl</h3>
    <canvas id="webgl" width="200" height="100" />

    <h3>triange - webgpu</h3>
    <canvas id="webgpu" width="200" height="100" />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import vertexShader from './shader/basic/basic.vert';
import fragmentShader from './shader/basic/basic.frag';
import { webgpuShader } from './webgpu/shader';

export default {
  name: 'RenderTriangle',
  setup() {
    const vertexSource = ref(vertexShader);
    const fragmentSource = ref(fragmentShader);

    // canvas
    const initCanvas2D = () => {
      const canvas = document.getElementById('2d');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.strokeStyle = 'red';
      ctx.moveTo(0, 100);
      ctx.lineTo(100, 0);
      ctx.lineTo(200, 100);
      ctx.lineTo(0, 100);
      ctx.stroke();
      ctx.fill();
    };

    // webgl
    const loadShader = (gl, source, shaderType) => {
      // 创建由type指定的着色器对象
      const shader = gl.createShader(shaderType);
      // 将 source 指定的字符串形式的代码传入shader指定的着色器
      gl.shaderSource(shader, source);
      // 编译 shader 指定的着色器中的源代码
      gl.compileShader(shader);
      return shader;
    };

    const initWebgl = () => {
      const canvas = document.getElementById('webgl');
      const gl = canvas.getContext('webgl2');

      // init
      gl.clearColor(1, 1, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, 200, 100);

      //shader
      const program = gl.createProgram();
      const vertexShader = loadShader(gl, vertexSource.value, gl.VERTEX_SHADER);
      const fragmentShader = loadShader(
        gl,
        fragmentSource.value,
        gl.FRAGMENT_SHADER
      );
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.useProgram(program);

      // buffer
      const pointPos = [-1, -1, 1, -1, 0, 1];
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(pointPos),
        gl.STATIC_DRAW
      );
      const aPosition = gl.getAttribLocation(program, 'a_position');
      gl.vertexAttribPointer(
        aPosition,
        2,
        gl.FLOAT,
        false,
        Float32Array.BYTES_PER_ELEMENT * 2,
        0
      );
      gl.enableVertexAttribArray(aPosition);

      // 绘制
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const initWebGPU = async () => {
      const adapter = await navigator.gpu.requestAdapter();
      const device = await adapter.requestDevice();

      const canvas = document.getElementById('webgpu');
      const context = canvas.getContext('webgpu');

      // 配置画布
      context.configure({
        // 必选参数
        device,
        // 必选参数
        format: 'bgra8unorm',
        // 可选参数，Chrome 102 开始默认为 'opaque'，即不透明选项
        compositingAlphaMode: 'opaque',
      });

      const shader = webgpuShader();
      const pipeline = await device.createRenderPipelineAsync({
        vertex: {
          module: device.createShaderModule({
            code: shader.vertex,
          }),
          entryPoint: 'main',
        },
        fragment: {
          module: device.createShaderModule({
            code: shader.fragment,
          }),
          entryPoint: 'main',
          targets: [
            {
              format: 'bgra8unorm',
            },
          ],
        },
        primitiveTopology: 'triangle-list',
      });

      // 画布
      const view = context.getCurrentTexture().createView();
      // 类似于图层
      const renderPassDescriptor = {
        colorAttachments: [
          {
            view: view,
            clearValue: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
            // 可选: clear, load
            loadOp: 'clear',
            // 兼容 Chrome 101 之前的版本
            loadValue: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
            // 可选: store, discard
            storeOp: 'store',
          },
        ],
      };

      // 绘制 command 队列
      const commandEncoder = device.createCommandEncoder();
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      // 设置渲染管线配置
      passEncoder.setPipeline(pipeline);
      passEncoder.draw(3, 1, 0, 0);
      // 结束通道绘制，endPass 在 Chrome 101 之后的版本被弃用
      passEncoder.end ? passEncoder.end() : passEncoder.endPass();

      // 结束绘制，得到 commandBuffer
      const commandBuffer = commandEncoder.finish();
      device.queue.submit([commandBuffer]);
    };

    const checkWebGPU = () => {
      if (navigator.gpu) {
        initWebGPU();
        return;
      }

      const canvas = document.getElementById('webgpu');
      const ctx = canvas.getContext('2d');
      ctx.font = '20px Georgia';
      ctx.fillText('Not Support', 10, 50);
    };

    onMounted(() => {
      initCanvas2D();
      initWebgl();
      checkWebGPU();
    });
  },
};
</script>

<style lang="less" scoped>
.triangle-css {
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 100px solid red;
  border-top: 0;
}
</style>

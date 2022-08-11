import { webgpuShader } from './shader';
import * as triangle from './triangle';

export default class WebGPU {
  constructor() {
    this.init();
  }

  init(): void {
    this.checkWebGPU();
  }

  checkWebGPU(): void {
    if (navigator.gpu) {
      this.initWebGPU();
      return;
    }

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
      document.getElementById('webgpu')
    );

    const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>(
      canvas.getContext('2d')
    );

    ctx.font = '20px Georgia';
    ctx.fillText('Not Support', 10, 50);
  }

  async initWebGPU() {
    const adapter: GPUAdapter = <GPUAdapter>(
      await navigator.gpu.requestAdapter()
    );
    const device: GPUDevice = <GPUDevice>await adapter?.requestDevice();

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
      document.getElementById('webgpu')
    );
    const context = canvas.getContext('webgpu');

    // 配置画布
    context?.configure({
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
        buffers: [
          {
            arrayStride: 3 * 4, // 3 float32,
            attributes: [
              {
                // position xyz
                shaderLocation: 0,
                offset: 0,
                format: 'float32x3',
              },
            ],
          },
        ],
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
      // primitiveTopology: 'triangle-list',
      primitive: {
        topology: 'triangle-list',
      },
    });

    // create vertex buffer
    const vertexBuffer = device.createBuffer({
      label: 'GPUBuffer store vertex',
      size: triangle.vertex.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      //mappedAtCreation: true
    });
    device.queue.writeBuffer(vertexBuffer, 0, triangle.vertex);
    // create color buffer
    const colorBuffer = device.createBuffer({
      label: 'GPUBuffer store rgba color',
      size: 4 * 4, // 4 * float32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(colorBuffer, 0, new Float32Array([1, 0.5, 0, 1]));

    // create a uniform group for color
    const uniformGroup = device.createBindGroup({
      label: 'Uniform Group with colorBuffer',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: colorBuffer,
          },
        },
      ],
    });

    // 画布
    const view = context?.getCurrentTexture()?.createView();
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
    // set uniformGroup
    passEncoder.setBindGroup(0, uniformGroup);
    // set vertex
    passEncoder.setVertexBuffer(0, vertexBuffer);

    passEncoder.draw(3, 1, 0, 0);
    // 结束通道绘制，endPass 在 Chrome 101 之后的版本被弃用
    passEncoder.end ? passEncoder.end() : passEncoder.endPass();

    // 结束绘制，得到 commandBuffer
    const commandBuffer = commandEncoder.finish();
    device.queue.submit([commandBuffer]);
  }
}

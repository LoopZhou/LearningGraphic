<template>
  <div class="raytracer">
    <!-- 进度条 -->
    <div class="processbar">
      <div id="processline" class="processline" />
    </div>

    <!-- 绘图区 -->
    <canvas
      id="raytracer-canvas"
      class="canvas"
      :width="imageWidth"
      :height="imageHeight"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRaytracerStore } from '@/store/raytracer';
import Px from './raytracer/px';
import RenderTask from './raytracer/renderTask';
import Worker from './raytracer/task15.worker?worker';

const raytracerStore = useRaytracerStore();
const { imageWidth, imageHeight } = raytracerStore;

onMounted(() => {
  const canvas = document.getElementById('raytracer-canvas');
  canvas.width = imageWidth;
  canvas.height = imageHeight;

  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(imageWidth, imageHeight);
  const bar = document.getElementById('processline');

  const amount = imageWidth * imageHeight;
  let complete = 0;

  const taskMsg: { [key: string]: Function } = {
    partComplete(worker: Worker, task: RenderTask) {
      task.pixels.forEach((v, i) => {
        const position = (v.x + v.y * task.width) * 4;
        image.data[position] = v.r;
        image.data[position + 1] = v.g;
        image.data[position + 2] = v.b;
        image.data[position + 3] = v.a;
      });

      complete += task.pixels.length;
      bar.style.width = (complete / amount) * 100 + '%';

      ctx.putImageData(image, 0, 0);
    },

    allComplete(worker: Worker, task: RenderTask | null) {
      if (task) {
        task.pixels.forEach((v, i) => {
          const position = (v.x + v.y * task.width) * 4;
          image.data[position] = v.r;
          image.data[position + 1] = v.g;
          image.data[position + 2] = v.b;
          image.data[position + 3] = v.a;
        });

        complete += task.pixels.length;
        bar.style.width =
          (complete / amount > 1 ? 1 : complete / amount) * 100 + '%';

        ctx.putImageData(image, 0, 0);
      }

      worker.terminate();
    },
  };

  const performTask = (task: RenderTask) => {
    // task 发送到 work 中执行
    const worker = new Worker();

    worker.postMessage({
      method: 'render3',
      args: [task],
    });

    // 接收 worker 传回来的结果
    worker.onmessage = function (res: {
      data: { method: string; args: any[] };
    }) {
      const { method, args } = res.data;

      if (taskMsg[method]) {
        taskMsg[method](worker, ...args);
      } else {
        alert(`app : can't find method (${method})`);
      }
    };
  };

  const initTasks = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    amount: number
  ) => {
    // canvas像素总数
    const n = width * height;
    // 每个 task 需要处理的像素数量len
    const len = Math.ceil(n / amount);

    let task = new RenderTask([], width, height);

    // 两层循环每个像素点，外层为纵坐标 y，内层为横坐标 x；横向扫描
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        task.pixels.push(new Px(x, y));

        // 每当task 内部的像素数量等于 len 时候或者处理到最后一个像素的时候，执行这个task, 创建新的task
        if (task.pixels.length >= len || y * width + x === n - 1) {
          performTask(task);
          task = new RenderTask([], width, height);
        }
      }
    }
  };

  // 优化：给 worker 随机分配像素
  function initTasks2(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    amount: number
  ) {
    const n = width * height;
    const len = Math.ceil(n / amount);

    // 二维数组来存 pixel
    const pixels: Px[][] = [];
    for (let y = 0; y < height; y++) {
      pixels.push([]);
      for (let x = 0; x < width; x++) {
        pixels[y].push(new Px(x, y));
      }
    }

    let task = new RenderTask([], width, height);
    while (pixels.length) {
      const y = Math.floor(Math.random() * (pixels.length - 0.0001));

      const pxs = pixels[y];

      const x = Math.floor(Math.random() * (pxs.length - 0.0001));

      const px = pxs.splice(x, 1)[0];

      task.pixels.push(px);

      if (pxs.length === 0) {
        pixels.splice(y, 1);
      }

      if (task.pixels.length >= len || pixels.length === 0) {
        performTask(task);
        task = new RenderTask([], width, height);
      }
    }
  }

  initTasks(ctx, imageWidth, imageHeight, 4);
});
</script>

<style lang="less" scoped>
.raytracer {
  background-color: aquamarine;

  .canvas {
    width: 800px;
    height: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 30%);
  }

  .processbar {
    width: 100%;
    height: 2px;
    position: absolute;
    top: 0;
    background: #fff;

    .processline {
      width: 100%;
      height: 100%;
      background-color: #90aeff;
    }
  }
}
</style>

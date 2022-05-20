<template>
  <div class="raytracer">
    <div class="processbar">
      <div class="processline" />
    </div>
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
// import { storeToRefs } from 'pinia';
import { useRaytracerStore } from '@/store/raytracer';
import Px from './raytracer/px';
import RenderTask from './raytracer/renderTask';

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
    const worker = new Worker('./raytracer/task2.worker.js');

    worker.postMessage({
      method: 'render',
      args: [task],
    });

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
    console.log('initTasks', ctx, width, height, amount);
    const n = width * height;
    const len = Math.ceil(n / amount);

    let task = new RenderTask([], width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        task.pixels.push(new Px(x, y));

        if (task.pixels.length >= len || y * width + x === n - 1) {
          performTask(task);
          task = new RenderTask([], width, height);
        }
      }
    }
  };

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

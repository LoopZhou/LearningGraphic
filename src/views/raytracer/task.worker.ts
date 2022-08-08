/**
 * 基本结构
 */

import RenderTask from './renderTask';
import Px from './px';

// 消息类型
const appMsg: { [key: string]: Function } = {
  render,
  render2,
  render3,
};

// 接收到这个消息，并进行计算
onmessage = function (e) {
  const { method, args = [] } = e.data;

  if (appMsg[method]) {
    appMsg[method](...args);
  } else {
    console.log(`taskWorker: can't find method (${method})`);
  }
};

// 设置成单色白色
function renderPixel(v: Px, width: number, height: number) {
  v.r = v.g = v.b = v.a = 255;
}

// 根据像素坐标位置计算当前坐标的颜色
function color(_x: number, _y: number) {
  // 这里之所以将 y 转换为 1-y ，是应为从 canvas 直接得到的坐标 y 轴的正方向是向下的，而我们更为熟悉的是 y 轴正方向向上的坐标系
  const [x, y] = [_x, 1 - _y];
  return [x, y, 0.2];
}

function renderPixel2(v: Px, width: number, height: number) {
  [v.r, v.g, v.b, v.a] = [...color(v.x / width, v.y / height), 1].map((v) =>
    Math.floor(v * 255.9)
  );
}

// 将每个像素拆分分别计算，最后将所有计算结果发送回去

// 方法1: 一次全部返回
function render(task: RenderTask) {
  const { pixels, width, height } = task;

  pixels.forEach((v, i) => {
    renderPixel(v, width, height);
  });
  (<any>postMessage)({
    method: 'allComplete',
    args: [task],
  });
}

// 方法2: 分批返回
function render2(task: RenderTask) {
  const { pixels, width, height } = task;
  // 每400长度返回一次
  const len = 400;

  let res = new RenderTask([], width, height);

  pixels.forEach((v, i) => {
    renderPixel(v, width, height);
    res.pixels.push(v);

    if (res.pixels.length >= len) {
      (<any>postMessage)({
        method: 'partComplete',
        args: [res],
      });

      res = new RenderTask([], width, height);
    }
  });
  (<any>postMessage)({
    method: 'allComplete',
    args: [res],
  });
}

// 计算量大了经常会提示内存不足，用 setTimeout 中断任务
function render3(task: RenderTask) {
  const { pixels, width, height } = task;
  const len = 400;

  let res = new RenderTask([], width, height);

  function doTask(i: number) {
    for (let j = 0; j < len && i + j < pixels.length; j++) {
      renderPixel(pixels[i + j], width, height);
      res.pixels.push(pixels[i + j]);
    }

    (<any>postMessage)({
      method: 'partComplete',
      args: [res],
    });

    res = new RenderTask([], width, height);

    if (i + len < pixels.length) {
      return setTimeout(() => {
        doTask(i + len);
      }, 0);
    }
    (<any>postMessage)({
      method: 'allComplete',
      args: [res],
    });
  }

  doTask(0);
}

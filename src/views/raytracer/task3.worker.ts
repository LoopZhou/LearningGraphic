/**
 * 增加一个Sphere, 增加采样
 */
import RenderTask from './renderTask';
import Px from './px';

import Vec3 from './vec3';
import Camera from './camera';

import Sphere from './sphere';

const camera = new Camera(
  new Vec3(0, 0, 1), //origin
  new Vec3(-2, -1, -1), //leftBottom
  new Vec3(4, 0, 0), //horizontal
  new Vec3(0, 2, 0) //vertical
);

const ball = new Sphere(new Vec3(0, 0, -1), 0.5);

// 采样次数
const n = 50;

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

// 中心为黄色的球
function color(_x: number, _y: number) {
  const [x, y] = [_x, 1 - _y];

  const r = camera.getRay(x, y);

  const hit = ball.hit(r, 0, Infinity);

  let res: Vec3;

  if (hit) {
    res = new Vec3(0, 1, 0);
  } else {
    // 设置背景色
    const unitDirection = r.direction.unitVec(),
      t = (unitDirection.e1 + 1.0) * 0.5;

    res = Vec3.add(new Vec3(1, 1, 1).mul(1 - t), new Vec3(0.3, 0.5, 1).mul(t));
  }

  return [res.e0, res.e1, res.e2];
}

function color2(_x: number, _y: number) {
  const [x, y] = [_x, 1 - _y];

  const r = camera.getRay(x, y);

  const hit = ball.hit(r, 0, Infinity);

  let res: Vec3;

  if (hit) {
    // 用颜色来表现 hit 法线的方向
    res = hit.normal.unitVec().add(1).mul(0.5);
  } else {
    // 设置背景色
    const unitDirection = r.direction.unitVec(),
      t = (unitDirection.e1 + 1.0) * 0.5;

    res = Vec3.add(new Vec3(1, 1, 1).mul(1 - t), new Vec3(0.3, 0.5, 1).mul(t));
  }

  return [res.e0, res.e1, res.e2];
}

function renderPixel(v: Px, width: number, height: number) {
  [v.r, v.g, v.b, v.a] = [...color2(v.x / width, v.y / height), 1].map((v) =>
    Math.floor(v * 255.9)
  );
}

function renderPixelSampler(v: Px, width: number, height: number) {
  [v.r, v.g, v.b, v.a] = new Array(n)
    .fill(0)
    .map((m) =>
      color2((v.x + Math.random()) / width, (v.y + Math.random()) / height)
    )
    .reduce((res, v) => res.map((item, i) => (item += v[i])), [0, 0, 0])
    .map((v) => Math.floor((v / n) * 255.99))
    .concat([255]);
}

// 将每个像素拆分分别计算，最后将所有计算结果发送回去

// 方法1: 一次全部返回
function render(task: RenderTask) {
  const { pixels, width, height } = task;

  pixels.forEach((v, i) => {
    // renderPixel(v, width, height);
    renderPixelSampler(v, width, height);
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

/**
 * Camera优化: 景深
 */
import RenderTask from './renderTask';
import Px from './px';

import Vec3 from './vec3';
import Camera from './camera';
import Sphere from './sphere';
import MovingSphere from './movingSphere';
import HitList from './hitList';

import Hitable from './hitable';
import Ray from './ray';
import Metal from './metal';
import Lambertian from './lambertian';
import Dielectric from './dielectric';

const camera = new Camera(
  new Vec3(9, 1.1, 2),
  new Vec3(0, 0.6, -1),
  new Vec3(0, 1, 0),
  30,
  2,
  0.05,
  0,
  1,
  new Vec3(9, 1.5, 2).sub(new Vec3(0, 0, -1)).length() * 0.5
);

/*
const ball = new Sphere(
  new Vec3(0, 0, -1),
  0.5,
  new Metal(new Vec3(0.8, 0.4, 0), 0.5)
);
const balll = new Sphere(
  new Vec3(1, 0, -1),
  0.5,
  new Metal(new Vec3(0.8, 0, 0.4), 1)
);
const ballll = new Sphere(
  new Vec3(-1, 0, -1),
  0.5,
  new Dielectric(new Vec3(1, 1, 1), 1.5)
);

// 再添加一直径为负数的球，可以将实心球变成空心球?
const ballllInside = new Sphere(
  new Vec3(-1, 0, -1),
  -0.45,
  new Dielectric(new Vec3(1, 1, 1), 1.5)
);
const earth = new Sphere(new Vec3(0, -100.5, -1), 100, new Metal(0.5, 0.2));
*/

// const world = new HitList(ball, balll, ballll, ballllInside, earth);
const world = createSence();

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

function color(_x: number, _y: number) {
  const [x, y] = [_x, 1 - _y];

  const r = camera.getRay(x, y);

  const res = trace(world, r);

  return [res.e0, res.e1, res.e2];
}

// 每次递归 trace 的时候，将反射率添加到衰减里
function trace(sence: Hitable, r: Ray, step = 0): Vec3 {
  if (step > 50) {
    return new Vec3(0, 0, 0);
  }

  const hit = sence.hit(r, 0.0000001, Infinity);

  let res: Vec3;

  if (hit) {
    res = trace(sence, hit[1], ++step).mul(hit[2]);
  } else {
    // 设置背景色
    const unitDirection = r.direction.unitVec(),
      t = (unitDirection.e1 + 1.0) * 0.5;

    res = Vec3.add(new Vec3(1, 1, 1).mul(1 - t), new Vec3(0.3, 0.5, 1).mul(t));
  }
  return res;
}

function renderPixel(v: Px, width: number, height: number) {
  [v.r, v.g, v.b, v.a] = [...color(v.x / width, v.y / height), 1].map((v) =>
    Math.floor(v * 255.9)
  );
}

function renderPixelSampler0(v: Px, width: number, height: number) {
  [v.r, v.g, v.b, v.a] = new Array(n)
    .fill(0)
    .map((m) =>
      color((v.x + Math.random()) / width, (v.y + Math.random()) / height)
    )
    .reduce((res, v) => res.map((item, i) => (item += v[i])), [0, 0, 0])
    .map((v) => Math.floor((v / n) * 255.99))
    .concat([255]);
}

// renderPixel 中将结果开方，可以将渲染结果提亮一点
function renderPixelSampler(v: Px, width: number, height: number) {
  [v.r, v.g, v.b, v.a] = new Array(n)
    .fill(0)
    .map((m) =>
      color((v.x + Math.random()) / width, (v.y + Math.random()) / height)
    )
    .reduce((res, v) => res.map((item, i) => (item += v[i])), [0, 0, 0])
    .map((v) => Math.floor((v / n) ** 0.5 * 255.99))
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
    // renderPixel(v, width, height);
    renderPixelSampler(v, width, height);
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
      // renderPixel(pixels[i + j], width, height);
      renderPixelSampler(pixels[i + j], width, height);
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

// 因为 Math.random 中不支持 seed，而在开发的时候因为可能用了多个 worker，必须保证每个 worker 中数据的一致性，于是需要自己实现一个
function random(seed: number) {
  return parseFloat('0.' + Math.sin(seed).toString().substr(6));
}

// 创建场景
function createSence(): Hitable {
  const list: Hitable[] = new Array(20)
    .fill(0)
    .map((v, _a) =>
      new Array(20).fill(0).map((v, _b) => {
        const a = _a - 11;
        const b = _b - 11;
        const chooseMat = random(a * 310 + b);
        const center = new Vec3(
          a + 0.9 * random(a * 311 + b),
          0.2,
          b + 0.9 * random(a * 312 + b)
        );
        if (center.sub(new Vec3(4, 0.2, 0)).length() > 0.9) {
          if (chooseMat < 0.4) {
            return new MovingSphere(
              center,
              center.add(new Vec3(0, random(a * 316 + b), 0).mul(0.5)),
              0.2,
              new Lambertian(
                new Vec3(
                  random(a * 313 + b) * random(a * 314 + b),
                  random(a * 315 + b) * random(a * 316 + b),
                  random(a * 317 + b) * random(a * 318 + b)
                )
              ),
              camera.time0,
              camera.time1
            );
          } else if (chooseMat < 0.7) {
            return new Sphere(
              center,
              0.2,
              new Metal(
                new Vec3(
                  0.5 * random(a * 319 + b),
                  0.5 * (1 + random(a * 320 + b)),
                  0.5 * (1 + random(a * 321 + b))
                ),
                0.5 * (1 + random(a * 322 + b))
              )
            );
          }
          return new Sphere(
            center,
            0.2,
            new Dielectric(new Vec3(1, 1, 1), 1.5)
          );
        }
      })
    )
    .reduce((a, b) => a.concat(b))
    .filter((i) => i);

  list.push(
    new Sphere(new Vec3(4, 1, 0), 1, new Metal(new Vec3(0.7, 0.6, 0.5), 0))
  );

  list.push(
    new Sphere(new Vec3(-4, 1, 0), 1, new Lambertian(new Vec3(0.4, 0.2, 0.1)))
  );

  list.push(
    new Sphere(new Vec3(0, 1, 0), 1, new Dielectric(new Vec3(1, 1, 1), 1.5))
  );

  list.push(
    new Sphere(
      new Vec3(0, -1000, 0),
      1000,
      new Lambertian(new Vec3(0.5, 0.5, 0.5))
    )
  );

  return new HitList(...list);
}

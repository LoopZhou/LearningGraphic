/**
 * 光线类
 * 光线起始位置的坐标 origin以及一个方向 direction
 */
import Vec3 from './Vec3';
import HitRecord from './hitRecord';

export default class Ray {
  origin: Vec3;
  direction: Vec3;
  time: number;
  constructor(origin: Vec3, direction: Vec3, time: number) {
    this.origin = origin;
    this.time = time;
    this.direction = direction;
  }

  // 在时间参数 t 的时候光线的位置
  getPoint(t: number) {
    return this.origin.add(this.direction.mul(t));
  }

  // 反射
  reflect(hit: HitRecord) {
    return new Ray(
      hit.p,
      reflect(this.direction.unitVec(), hit.normal),
      this.time
    );
  }

  // 折射
  refract0(hit: HitRecord, ref: number) {
    let outWardNormal: Vec3 = hit.normal;
    let niOverNt: number = ref;

    if (Vec3.dot(this.direction, hit.normal) > 0) {
      outWardNormal = outWardNormal.mul(-1);
    } else {
      niOverNt = 1 / niOverNt;
    }

    const res = refract(this.direction, outWardNormal, niOverNt);

    if (res) {
      return new Ray(hit.p, res, this.time);
    }
    return this.reflect(hit);
  }

  refract(hit: HitRecord, ref: number) {
    let outWardNormal: Vec3 = hit.normal;
    let niOverNt: number = ref;
    let consine = 0;

    // 光线方向和折射率计算 consine
    if (Vec3.dot(this.direction, hit.normal) > 0) {
      outWardNormal = outWardNormal.mul(-1);
      consine =
        (ref * Vec3.dot(this.direction, hit.normal)) / this.direction.length();
    } else {
      niOverNt = 1 / niOverNt;
      consine =
        (-1 * Vec3.dot(this.direction, hit.normal)) / this.direction.length();
    }

    const res = refract(this.direction, outWardNormal, niOverNt);

    // 得到的光线本是由折射光线和反射光线叠加而成，这里可以通过计算概率的方式避免出现多条光线的计算，以简化代码优化速度。
    if (res && Math.random() > schlick(consine, niOverNt)) {
      return new Ray(hit.p, res, this.time);
    }
    return this.reflect(hit);
  }
}

// 先求出入射光线延法线方向的分向量，然后入射光线减去两倍这个分向量的值就是反射光方向
function reflect(v: Vec3, n: Vec3) {
  return v.sub(n.mul(Vec3.dot(v, n) * 2));
}

/**
 * 折射函数
 * n=sinγ/sinβ
 * 那我们折射函数的逻辑，基本上是：
根据 n，v 求入射角 cosγ，进而得到入射角 sinγ，
得到折射角 sinβ ，判断是否全反射
不是全反射，则求得折射角 cosβ 进而求得反射光线 （√）
 */
function refract(v: Vec3, n: Vec3, niOverNt: number) {
  const uv = v.unitVec();
  const dt = Vec3.dot(uv, n);
  const discriminant = 1.0 - niOverNt * niOverNt * (1 - dt * dt);

  if (discriminant < 0) {
    return null;
  }
  return uv
    .sub(n.mul(dt))
    .mul(niOverNt)
    .sub(n.mul(discriminant ** 0.5));
}

// 光线反射强度
function schlick(cosine: number, refIdx: number): number {
  let r0 = (1 - refIdx) / (1 + refIdx);
  r0 = r0 * r0;
  return r0 + (1 + r0) * (1 - cosine) ** 5;
}

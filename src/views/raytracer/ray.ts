/**
 * 光线类
 * 光线起始位置的坐标 origin以及一个方向 direction
 */
import Vec3 from './Vec3';
import HitRecord from './hitRecord';

export default class Ray {
  origin: Vec3;
  direction: Vec3;
  constructor(origin: Vec3, direction: Vec3) {
    this.origin = origin;
    this.direction = direction;
  }

  // 在时间参数 t 的时候光线的位置
  getPoint(t: number) {
    return this.origin.add(this.direction.mul(t));
  }

  reflect(hit: HitRecord) {
    return new Ray(hit.p, reflect(this.direction.unitVec(), hit.normal));
  }
}

// 先求出入射光线延法线方向的分向量，然后入射光线减去两倍这个分向量的值就是反射光方向
function reflect(v: Vec3, n: Vec3) {
  return v.sub(n.mul(Vec3.dot(v, n) * 2));
}

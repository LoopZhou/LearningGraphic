/**
 * 运动球
 * 他有两个位置 center0 / center1 ，以及这两个位置对应的时间 time0/time1。而且需要一个 center 方法计算 t 时间上球的位置。
 * 其 hit 方法与原 hit 方法相比，仅是多了通过 ray.time 和 this.center 计算位置
 */
import Hitable, { HitResult } from './hitable';
import Vec3 from './Vec3';
import Material from './material';
import Ray from './Ray';
import HitRecord from './hitRecord';

export default class MovingSphere implements Hitable {
  center0: Vec3;
  center1: Vec3;
  time0: number;
  time1: number;
  radius: number;
  material: Material;

  constructor(
    center0: Vec3,
    center1: Vec3,
    r: number,
    material: Material,
    time0: number,
    time1: number
  ) {
    this.time0 = time0;
    this.time1 = time1;
    this.center0 = center0;
    this.center1 = center1;
    this.radius = r;
    this.material = material;
  }
  center(t: number) {
    return this.center0.add(
      this.center1
        .sub(this.center0)
        .mul((t - this.time0) / (this.time1 - this.time0))
    );
  }

  hit(ray: Ray, tMin: number, tMax: number): HitResult | null {
    const hit = new HitRecord();

    const center = this.center(ray.time);
    const oc = Vec3.sub(ray.origin, center);
    const a = Vec3.dot(ray.direction, ray.direction);
    const b = Vec3.dot(oc, ray.direction) * 2;
    const c = Vec3.dot(oc, oc) - this.radius ** 2;

    const discriminate = b ** 2 - 4 * a * c;

    if (discriminate > 0) {
      let temp;
      temp = (-b - Math.sqrt(discriminate)) / (2 * a);
      if (temp > tMin && temp < tMax) {
        hit.t = temp;
        hit.p = ray.getPoint(temp);
        hit.normal = hit.p.sub(center).div(this.radius);

        const [a, b] = this.material.scatter(ray, hit);
        return [hit, a, b];
      }
      temp = (-b + Math.sqrt(discriminate)) / (2 * a);
      if (temp > tMin && temp < tMax) {
        hit.t = temp;
        hit.p = ray.getPoint(temp);
        hit.normal = hit.p.sub(center).div(this.radius);

        const [a, b] = this.material.scatter(ray, hit);
        return [hit, a, b];
      }
    }
    return null;
  }
}

/**
 * 球体
 * 原点（a，b，c） 和 半径 r
 */
import Ray from './ray';
import HitRecord from './hitRecord';
import Vec3 from './vec3';
import Hitable from './hitable';

export default class Sphere implements Hitable {
  center: Vec3;
  radius: number;

  constructor(center: Vec3, r: number) {
    this.center = center;
    this.radius = r;
  }

  hit(ray: Ray, tMin: number, tMax: number) {
    const hit = new HitRecord();

    const oc = Vec3.sub(ray.origin, this.center);
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
        hit.normal = hit.p.sub(this.center).div(this.radius);

        return hit;
      }
      temp = (-b + Math.sqrt(discriminate)) / (2 * a);
      if (temp > tMin && temp < tMax) {
        hit.t = temp;
        hit.p = ray.getPoint(temp);
        hit.normal = hit.p.sub(this.center).div(this.radius);

        return hit;
      }
    }

    return null;
  }
}

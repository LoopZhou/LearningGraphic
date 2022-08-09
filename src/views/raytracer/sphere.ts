/**
 * 球体
 * 原点（a，b，c） 和 半径 r
 */
import Ray from './ray';
import HitRecord from './hitRecord';
import Vec3 from './vec3';
import Hitable from './hitable';
import { HitResult } from './hitable';
import Material from './material';
export default class Sphere implements Hitable {
  center: Vec3;
  radius: number;
  material: Material;

  constructor(center: Vec3, r: number, material: Material) {
    this.center = center;
    this.radius = r;
    this.material = material;
  }

  hit(ray: Ray, tMin: number, tMax: number): HitResult | null {
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

        const [a, b] = this.material.scatter(ray, hit);
        return [hit, a, b];
      }
      temp = (-b + Math.sqrt(discriminate)) / (2 * a);
      if (temp > tMin && temp < tMax) {
        hit.t = temp;
        hit.p = ray.getPoint(temp);
        hit.normal = hit.p.sub(this.center).div(this.radius);

        const [a, b] = this.material.scatter(ray, hit);
        return [hit, a, b];
      }
    }
    return null;
  }
}

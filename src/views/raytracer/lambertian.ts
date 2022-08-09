/**
 * 漫反射
 */

import Material, { Attenuation } from './material';
import Ray from './ray';
import HitRecord from './hitRecord';
import Vec3 from './vec3';

function randomInUnitSphere() {
  let p: Vec3;
  do {
    p = new Vec3(Math.random(), Math.random(), Math.random())
      .mul(2.0)
      .sub(new Vec3(1, 1, 1));
  } while (p.squaredLength() > 1);

  return p;
}

export default class Lambertian implements Material {
  albedo: Vec3;

  constructor(albedo: Vec3 | number) {
    this.albedo = new Vec3(0, 0, 0).add(albedo);
  }

  // 光线方向就是沿法线方向添加随机偏移, 反射结果和入射光无关，仅仅与 hit 的位置法线方向有关
  scatter(rayIn: Ray, hit: HitRecord): [Ray, Attenuation] {
    const ray = new Ray(hit.p, hit.normal.add(randomInUnitSphere()));
    return [ray, this.albedo];
  }
}

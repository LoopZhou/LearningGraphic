/**
 * 金属类
 * 镜面反射: scatter 方法就是直接调用 ray 的 reflect 方法获取反射光
 */
import Material, { Attenuation } from './Material';
import Ray from './ray';
import HitRecord from './hitRecord';
import Vec3 from './vec3';

export default class Metal implements Material {
  albedo: Vec3;

  constructor(albedo: Vec3 | number) {
    this.albedo = new Vec3(0, 0, 0).add(albedo);
  }

  scatter(rayIn: Ray, hit: HitRecord): [Ray, Attenuation] {
    return [rayIn.reflect(hit), this.albedo];
  }
}

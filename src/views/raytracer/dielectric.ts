/**
 * 透明材质
 */
import Material, { Attenuation } from './material';
import Ray from './ray';
import HitRecord from './hitRecord';
import Vec3 from './vec3';

export default class Dielectric implements Material {
  albedo: Vec3;
  // 折射率参数
  refractivity: number;

  constructor(albedo: Vec3 | number, refractivity: number) {
    this.albedo = new Vec3(0, 0, 0).add(albedo);
    this.refractivity = refractivity;
  }

  scatter(rayIn: Ray, hit: HitRecord): [Ray, Attenuation] {
    return [rayIn.refract(hit, this.refractivity), this.albedo];
  }
}

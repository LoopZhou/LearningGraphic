/**
 * 金属类
 * 镜面反射: scatter 方法就是直接调用 ray 的 reflect 方法获取反射光
 */
import Material, { Attenuation } from './Material';
import Ray from './ray';
import HitRecord from './hitRecord';
import Vec3 from './vec3';

// 反射方向上随机偏移一个向量，而这个向量的范围，控制了材质表面漫反射程度
// 产生随机偏移量的函数
function randomInUnitSphere() {
  let p: Vec3;
  do {
    p = new Vec3(Math.random(), Math.random(), Math.random())
      .mul(2.0)
      .sub(new Vec3(1, 1, 1));
  } while (p.squaredLength() > 1);

  return p;
}

export default class Metal implements Material {
  albedo: Vec3;
  fuzz: number;

  constructor(albedo: Vec3 | number, fuzz = 1) {
    this.albedo = new Vec3(0, 0, 0).add(albedo);
    this.fuzz = fuzz;
  }

  scatter(rayIn: Ray, hit: HitRecord): [Ray, Attenuation] {
    const ray = rayIn.reflect(hit);
    ray.direction = ray.direction.add(randomInUnitSphere().mul(this.fuzz));
    return [ray, this.albedo];
  }
}

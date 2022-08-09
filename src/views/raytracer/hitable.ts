import Ray from './ray';
import HitRecord from './hitRecord';
import Material, { Attenuation } from './material';

// hitable 接口: 根据光线 r ，和 时间参数范围额 tmin/t_max ，返回一个记录 HitRecord
export default interface Hitable {
  material?: Material;
  // hit: (ray: Ray, t_min: number, t_max: number) => HitRecord | null;
  hit: (ray: Ray, tMin: number, tMax: number) => HitResult | null;
}

type HitResult = [HitRecord, Ray, Attenuation];

export { HitResult };

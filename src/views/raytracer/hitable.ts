import Ray from './ray';
import HitRecord from './hitRecord';
// import Vec3 from './vec3';

// hitable 接口: 根据光线 r ，和 时间参数范围额 tmin/t_max ，返回一个记录 HitRecord
export default interface Hitable {
  hit: (ray: Ray, t_min: number, t_max: number) => HitRecord | null;
}

type HitResult = [HitRecord, Ray];

export { HitResult };

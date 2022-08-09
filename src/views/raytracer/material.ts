/**
 * 材质类
 * scatter 方法，计算 hitrecord 和入射光将反射光和光线衰减（在这式反射率）放到结果中，光线衰减为 Vec3 ，分辨对应 rgb 三个颜色的反射率
 */

import Ray from './ray';
import HitRecord from './hitRecord';
import Vec3 from './vec3';

export default interface Material {
  scatter: (rayIn: Ray, hit: HitRecord) => [Ray, Attenuation];
}

type Attenuation = Vec3;

export { Attenuation };

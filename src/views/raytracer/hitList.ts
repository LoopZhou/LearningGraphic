import Ray from './ray';
// import HitRecord from './hitRecord';
import hitable from './hitable';
import { HitResult } from './hitable';

export default class HitList {
  list: hitable[];

  constructor(...arg: hitable[]) {
    this.list = arg;
  }

  hit(ray: Ray, tMin: number, tMax: number) {
    let closest = tMax,
      res: HitResult | null = null;

    this.list.forEach((v) => {
      const _res = v.hit(ray, tMin, tMax);
      if (_res && _res[0].t < closest) {
        res = _res;
        closest = res[0].t;
      }
    });

    return res;
  }
}

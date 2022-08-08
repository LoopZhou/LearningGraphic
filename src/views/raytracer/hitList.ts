import Ray from './ray';
import HitRecord from './hitRecord';
import hitable from './hitable';

export default class HitList {
  list: hitable[];

  constructor(...arg: hitable[]) {
    this.list = arg;
  }

  hit(ray: Ray, tMin: number, tMax: number) {
    let closest = tMax,
      hit: HitRecord | null = null;

    this.list.forEach((v) => {
      const _hit = v.hit(ray, tMin, tMax);
      if (_hit && _hit.t < closest) {
        hit = _hit;
        closest = _hit.t;
      }
    });

    return hit;
  }
}

/**
 * AABB（Axis-aligned minimum bounding box：轴对齐最小边界盒）。何为轴对齐盒子呢，就是所有的边都与轴线平行的盒子
 */
import Hitable, { HitResult } from './hitable';
import HitRecord from './hitRecord';
import Vec3 from './Vec3';
import Material from './material';
import Ray from './Ray';

const compare = {
  minmax(a: number, b: number, c?: number): [number, number] {
    const res: [number, number] = a < b ? [a, b] : [b, a];
    if (!c && c !== 0) {
      return res;
    }
    if (c < res[0]) {
      return (res[0] = c), res;
    }
    if (c > res[1]) {
      return (res[1] = c), res;
    }
    return res;
  },
  min(a: number, b: number, c?: number): number {
    const res: number = a < b ? a : b;
    if (!c && c !== 0) {
      return res;
    }
    if (c < res) {
      return c;
    }
    return res;
  },
  max(a: number, b: number, c?: number): number {
    const res: number = a > b ? a : b;
    if (!c && c !== 0) {
      return res;
    }
    if (c > res) {
      return c;
    }
    return res;
  },
};

export default class AAB implements Hitable {
  // 只需要三个轴上均对称的两个点就够了
  // 构造的时候我们把 xyz 坐标小的放在一起组合成一个新的定点，xyz 坐标大的放在一起组合成一个另一个新的定点，然后用这两个点去描述 AAB
  min: Vec3;
  max: Vec3;
  material: Material;

  constructor(a0: Vec3, a1: Vec3, material: Material) {
    const x = compare.minmax(a0.e0, a1.e0);
    const y = compare.minmax(a0.e1, a1.e1);
    const z = compare.minmax(a0.e2, a1.e2);

    this.min = new Vec3(x[0], y[0], z[0]);
    this.max = new Vec3(x[1], y[1], z[1]);
    this.material = material;
  }

  hit(ray: Ray, tMin: number, tMax: number): HitResult | null {
    const axis: ['e0', 'e1', 'e2'] = ['e0', 'e1', 'e2'];
    const a = <[[number, number], [number, number], [number, number]]>axis.map(
      (v, i) => {
        const m = ray.direction[v];
        const n = ray.origin[v];
        const min = this.min[v];
        const max = this.max[v];

        if (m === 0) {
          //平行于轴线地情况
          if (n >= min && n <= max) {
            return <[number, number]>[-Infinity, Infinity];
          }
          return <[number, number]>[Infinity, -Infinity];
        }
        const a = (min - n) / m;
        const b = (max - n) / m;
        return <[number, number]>(a < b ? [a, b] : [b, a]);
      }
    );

    const min = compare.max(a[0][0], a[1][0], a[2][0]);
    const max = compare.min(a[0][1], a[1][1], a[2][1]);

    const res =
      min > max
        ? null
        : tMin <= min && min <= tMax
        ? min
        : tMin <= max && min <= tMax
        ? max
        : null;

    if (res === null) {
      return null;
    }

    const m: [number, number] = [
      1, // 0 -> min 1-> max
      1, //[0,1,2] -> ['e0', 'e1', 'e2']
    ];

    a.forEach((v, i) =>
      v.forEach((w, j) => {
        if (w === res) {
          m[0] = j;
          m[1] = i;
        }
      })
    );

    const n = new Vec3(0, 0, 0);
    const p = ray.getPoint(res);

    if (p.e0 < -2) {
      console.log(1);
    }

    n[axis[m[1]]] = m[0] === 0 ? 1 : -1;

    const hit = new HitRecord(res, ray.getPoint(res), n);

    const [e, f] = this.material.scatter(ray, hit);

    return [hit, e, f];
  }
}

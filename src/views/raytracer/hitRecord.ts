/**
 * 时间参数t，和发生碰撞的坐标 p ，和发生碰撞时的法线方向 normal
 */
import Vec3 from './vec3';

export default class HitRecord {
  t: number;
  p: Vec3;
  normal: Vec3;
  constructor(
    t = 0,
    p: Vec3 = new Vec3(0, 0, 0),
    normal: Vec3 = new Vec3(0, 0, 0)
  ) {
    this.t = t;
    this.p = p;
    this.normal = normal;
  }
}
/**
 * Camera优化
 */
import Vec3 from './Vec3';
import Ray from './Ray';

export default class Camera {
  origin: Vec3;
  vertical: Vec3;
  horizontal: Vec3;
  leftBottom: Vec3;

  u: Vec3;
  v: Vec3;
  w: Vec3;

  constructor(
    lookfrom: Vec3,
    lookto: Vec3,
    vup: Vec3,
    vfov: number,
    aspect: number
  ) {
    const theta = (vfov * Math.PI) / 180;
    const harfHeight = Math.tan(theta / 2);
    const harfWidth = harfHeight * aspect;

    this.origin = lookfrom;
    this.w = lookfrom.sub(lookto).unitVec();
    this.u = Vec3.cross(vup, this.w).unitVec();
    this.v = Vec3.cross(this.w, this.u).unitVec();

    this.vertical = this.v.mul(harfHeight * 2);
    this.horizontal = this.u.mul(harfWidth * 2);
    this.leftBottom = this.origin
      .sub(this.vertical.mul(0.5))
      .sub(this.horizontal.mul(0.5))
      .sub(this.w);
  }

  getRay(x: number, y: number): Ray {
    return new Ray(
      this.origin,
      this.leftBottom
        .add(this.horizontal.mul(x))
        .add(this.vertical.mul(y))
        .sub(this.origin)
    );
  }
}

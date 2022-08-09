import Vec3 from './Vec3';
import Ray from './Ray';

export default class Camera {
  origin: Vec3;
  vertical: Vec3;
  horizontal: Vec3;
  leftBottom: Vec3;

  constructor(vfov: number, aspect: number) {
    const theta = (vfov * Math.PI) / 180;
    const harfHeight = Math.tan(theta / 2);
    const harfWidth = harfHeight * aspect;

    this.origin = new Vec3(0, 0, 0);
    this.vertical = new Vec3(0, harfHeight * 2, 0);
    this.horizontal = new Vec3(harfWidth * 2, 0, 0);
    this.leftBottom = new Vec3(-harfWidth, -harfHeight, -1);
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

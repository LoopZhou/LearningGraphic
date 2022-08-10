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
  // 景深 模糊的程度适合光圈大小和光圈到感光元件的距离有关，于是我们需要新增这两个属性
  // aspect/focusDist，通过前者得到弥散圆半径 lensRadius = aspect/2
  lensRadius: number;
  focusDist: number;

  u: Vec3;
  v: Vec3;
  w: Vec3;

  constructor(
    lookfrom: Vec3,
    lookto: Vec3,
    vup: Vec3,
    vfov: number,
    aspect: number,
    aperture: number,
    focuDist?: number
  ) {
    const theta = (vfov * Math.PI) / 180;
    const harfHeight = Math.tan(theta / 2);
    const harfWidth = harfHeight * aspect;

    this.lensRadius = aperture / 2;
    this.origin = lookfrom;
    this.w = lookfrom.sub(lookto).unitVec();
    this.u = Vec3.cross(vup, this.w).unitVec();
    this.v = Vec3.cross(this.w, this.u);

    this.focusDist = focuDist ? focuDist : lookfrom.sub(lookto).length();
    this.vertical = this.v.mul(harfHeight * 2).mul(this.focusDist);
    this.horizontal = this.u.mul(harfWidth * 2).mul(this.focusDist);
    this.leftBottom = this.origin
      .sub(this.horizontal.mul(0.5))
      .sub(this.vertical.mul(0.5))
      .sub(this.w.mul(this.focusDist));
  }

  getRay(x: number, y: number): Ray {
    const rd = randomInUnitDist().mul(this.lensRadius);
    const offset = this.u.mul(rd.e0).add(this.v.mul(rd.e1));

    return new Ray(
      this.origin.add(offset),
      this.leftBottom
        .add(this.horizontal.mul(x))
        .add(this.vertical.mul(y))
        .sub(this.origin)
        .sub(offset)
    );
  }
}

// 生成随机平面向量的函数 randomInUnitDist
function randomInUnitDist(): Vec3 {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const p = new Vec3(Math.random(), Math.random(), 0)
      .mul(2)
      .sub(new Vec3(1, 1, 0));
    if (Vec3.dot(p, p) > 1) {
      return p;
    }
  }
}

/*
 * 一个点的坐标信息和 rgba 值
 */
export default class Px {
  r: number;
  g: number;
  b: number;
  a: number;

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.r = this.g = this.b = this.a = 0;
  }
}

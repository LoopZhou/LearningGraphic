/*
 * 记录了图片大小（ width，height ），所有的像素 pixels
 */
import Px from './px';

export default class RenderTask {
  pixels: Px[];
  width: number;
  height: number;

  constructor(pixels: Px[], width: number, height: number) {
    this.pixels = pixels;
    this.height = height;
    this.width = width;
  }
}

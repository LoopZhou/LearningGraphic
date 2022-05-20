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

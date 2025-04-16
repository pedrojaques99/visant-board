declare module 'colorthief' {
  class ColorThief {
    constructor();
    getColor(img: HTMLImageElement): [number, number, number];
    getPalette(img: HTMLImageElement, colorCount: number): Array<[number, number, number]>;
  }
  export = ColorThief;
} 
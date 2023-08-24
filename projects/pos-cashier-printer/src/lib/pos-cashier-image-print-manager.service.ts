import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PosCashierImagePrintManagerService {
  private imageData: ImageData | undefined;
  private invertColors: boolean = true;
  private ESC_INIT = [0x1b, 0x40];
  private ESC_BIT_IMAGE = [0x1b, 0x2a]
  private DOTS_DENSITY = 24
  private LUMINANCE = {
      RED: 0.299,
      GREEN: 0.587,
      BLUE: 0.114
  }
  private LINE_FEED = 0x0a;
  // https://www.sparkag.com.br/wp-content/uploads/2016/06/ESC_POS-AK912-English-Command-Specifications-V1.4.pdf
  private LINE_FEED_AMOUNT = [0x1b, 0x33, 0x18]; // the third parameter is a numeric value where 1 = 0.125mm
  private LINE_FEED_DEFAULT = [0x1b, 0x32];
  // the best print quality is achieved when width and height are both multiples of 8
  constructor() {
    
  }
  init(image: HTMLImageElement, invertColors: boolean, width?: number, height?: number){
    const canvas = document.createElement('canvas');
    canvas.width = width ?? image.width;
    canvas.height = height ?? image.height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not get 2D context for canvas');
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    this.imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    this.invertColors = invertColors;
  }
  private calculateLuminance(pixel: number[]): number {
    let lum = this.LUMINANCE.RED * pixel[0] + this.LUMINANCE.GREEN * pixel[1] + this.LUMINANCE.BLUE * pixel[2];

    return this.invertColors ? 255 - lum : lum;
  }
  private calculateSlice(x: number, y: number): number {
    const threshold = 127;
    let slice = 0;
    
    for (let bit = 0; bit < 8; bit++) {
        if ((y + bit) >= this.imageData!.height)
            continue;

        const index = (this.imageData!.width * (y + bit) + x) * 4;
        const pixel = [
          this.imageData!.data[index],
          this.imageData!.data[index + 1],
          this.imageData!.data[index + 2]
        ];

        const luminance = this.calculateLuminance(pixel);

        slice |= (luminance < threshold ? 1 : 0) << 7 - bit;
    }

    return slice;
  }
  private collectStripe(x: number, y: number): number[] {
    let slices = [];
    let z = y + this.DOTS_DENSITY;

    let i = 0
    while (y < z && i < 3){
      slices.push(this.calculateSlice(x, y));

      y += 8
    }

    return slices;
  }
  private manipulateImage(): number[] {
    let data = [];
    const imageWidth = this.imageData!.width;

    for (let y = 0; y < this.imageData!.height; y += this.DOTS_DENSITY){
        data.push(...this.ESC_BIT_IMAGE, 33, (0x00ff & imageWidth), (0xff00 & imageWidth) >> 8);

        for (let x = 0; x < imageWidth; x++) {
            data.push(...this.collectStripe(x, y));
        }

        data.push(this.LINE_FEED);
    }

    return data;
  }
  public getUint8Array(): Uint8Array {
    let transformedImage = [];

    transformedImage.push(...this.LINE_FEED_AMOUNT);
    transformedImage.push(...this.manipulateImage());
    transformedImage.push(...this.LINE_FEED_DEFAULT);
    return new Uint8Array(transformedImage);
  }
  public resetImage(): void{
    this.imageData = undefined;
  }
}

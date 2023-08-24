import * as i0 from "@angular/core";
export declare class PosCashierImagePrintManagerService {
    private imageData;
    private invertColors;
    private ESC_INIT;
    private ESC_BIT_IMAGE;
    private DOTS_DENSITY;
    private LUMINANCE;
    private LINE_FEED;
    private LINE_FEED_AMOUNT;
    private LINE_FEED_DEFAULT;
    constructor();
    init(image: HTMLImageElement, invertColors: boolean, width?: number, height?: number): void;
    private calculateLuminance;
    private calculateSlice;
    private collectStripe;
    private manipulateImage;
    getUint8Array(): Uint8Array;
    resetImage(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PosCashierImagePrintManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PosCashierImagePrintManagerService>;
}

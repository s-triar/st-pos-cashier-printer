import { PrintBuilder } from './builders/PrintBuilder';
import { BehaviorSubject } from 'rxjs';
import { PrintDriver } from './drivers/PrintDriver';
import * as i0 from "@angular/core";
type symbologyType = 'upca' | 'upce' | 'ean13' | 'ean8' | 'coda39' | 'itf' | 'codabar';
type qrSizeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type qrErrorLevelType = 'l' | 'm' | 'q' | 'h';
type alignType = 'left' | 'center' | 'right';
type verticalAlignType = 'top' | 'bottom';
type styleType = 'single' | 'double';
export declare class PosCashierPrinterService extends PrintBuilder {
    printLanguage: string;
    driver: PrintDriver;
    isConnected: BehaviorSubject<boolean>;
    builder: PrintBuilder;
    private _imagePrintingService;
    private readonly _escEncoder;
    constructor();
    /**
     *
     * @param driver UsbDriver | WebPrintDriver
     * @param printLanguage ESC/POS | StarPRNT | WebPRNT
     */
    setDriver(driver: PrintDriver, printLanguage?: string): PosCashierPrinterService;
    /**
     * Initialize a new print queue
     */
    init(): PosCashierPrinterService;
    /**
     *
     * @param cutType full|partial
     */
    cut(cutType?: string): PosCashierPrinterService;
    /**
     *
     * @param lineCount How many lines to feed
     */
    feed(lineCount?: number): PosCashierPrinterService;
    setInverse(value?: boolean): PosCashierPrinterService;
    setBold(value?: boolean): PosCashierPrinterService;
    setUnderline(value?: boolean): PosCashierPrinterService;
    drawImage(path_image: string, invertColors: boolean, width?: number, height?: number): PosCashierPrinterService;
    drawQRCode(text: string, model?: 1 | 2, size?: qrSizeType, errorLevel?: qrErrorLevelType): PosCashierPrinterService;
    /**
     * This refers to https://github.com/NielsLeenheer/EscPosEncoder#barcode
     * @param text
     * @param model
     * @param height
     * @returns
     */
    drawBarcode(text: string, model: symbologyType, height: number): PosCashierPrinterService;
    drawTextInBox(text: string, options: {
        marginLeft?: number;
        marginRight?: number;
        paddingLeft?: number;
        paddingRight?: number;
        style?: styleType;
        width?: number;
    }): PosCashierPrinterService;
    drawTable(columns: ReadonlyArray<{
        align?: alignType;
        marginLeft?: number;
        marginRight?: number;
        verticalAlign?: verticalAlignType;
        width?: number;
    }>, data: ReadonlyArray<ReadonlyArray<string>>): PosCashierPrinterService;
    /**
     *
     * @param value left|center\right
     */
    setJustification(value?: string): PosCashierPrinterService;
    /**
     *
     * @param value normal|large
     */
    setSize(value?: string): PosCashierPrinterService;
    /**
     *
     * @param text
     */
    writeLine(text?: string): PosCashierPrinterService;
    /**
     * write the current builder value to the driver and clear out the builder
     */
    flush(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PosCashierPrinterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PosCashierPrinterService>;
}
export {};

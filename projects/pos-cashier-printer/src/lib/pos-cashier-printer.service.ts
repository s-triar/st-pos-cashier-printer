import { Injectable, inject } from '@angular/core';
import { StarPrintBuilder } from './builders/StarPrintBuilder';
import { WebPrintBuilder } from './builders/WebPrintBuilder';
import { PrintBuilder } from './builders/PrintBuilder';
import { BehaviorSubject } from 'rxjs';
import { PrintDriver } from './drivers/PrintDriver';
import { EscBuilder } from './builders/EscBuilder';
import { PosCashierImagePrintManagerService } from './pos-cashier-image-print-manager.service';
import EscPosEncoder from 'esc-pos-encoder';

type symbologyType = 'upca' | 'upce' | 'ean13' | 'ean8' | 'coda39' | 'itf' | 'codabar';

type qrSizeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type qrErrorLevelType = 'l' | 'm' | 'q' | 'h';
type alignType = 'left' | 'center' | 'right';
type verticalAlignType = 'top' | 'bottom';
type styleType = 'single' | 'double';

@Injectable({
  providedIn: 'root'
})

export class PosCashierPrinterService extends PrintBuilder{

  public printLanguage!: string;
  public driver!: PrintDriver;
  public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public builder!: PrintBuilder;
  private _imagePrintingService = inject(PosCashierImagePrintManagerService);
  private readonly _escEncoder = new EscPosEncoder();
  constructor() {
    super();
  }

  /**
   *
   * @param driver UsbDriver | WebPrintDriver
   * @param printLanguage ESC/POS | StarPRNT | WebPRNT
   */
  setDriver(driver: PrintDriver, printLanguage: string = 'ESC/POS'): PosCashierPrinterService {
    this.driver = driver;
    this.printLanguage = printLanguage;
    this.driver.connect();

    this.driver.isConnected.subscribe(result => {
      this.isConnected.next(result);
    });

    return this;
  }

  /**
   * Initialize a new print queue
   */
  init(): PosCashierPrinterService {
    if (!this.driver) {
      throw "Cannot initiate the print service.  No connection detected.";
    }

    switch (this.printLanguage) {
      case 'WebPRNT':
        this.builder = new WebPrintBuilder();
        break;
      case 'StarPRNT':
        this.builder = new StarPrintBuilder();
        break;
      default:
        this.builder = new EscBuilder();
        break;
    }

    this.builder.init();
    return this;
  }

  /**
   *
   * @param cutType full|partial
   */
  public cut(cutType: string = 'full'): PosCashierPrinterService {
    this.builder.cut(cutType);
    return this;
  }

  /**
   *
   * @param lineCount How many lines to feed
   */
  public feed(lineCount: number = 1): PosCashierPrinterService {
    this.builder.feed(lineCount);
    return this;
  }

  setInverse(value: boolean = true): PosCashierPrinterService {
    this.builder.setInverse(value);
    return this;

  }

  setBold(value: boolean = true): PosCashierPrinterService {
    this.builder.setBold(value);
    return this;

  }

  setUnderline(value: boolean = true): PosCashierPrinterService {
    this.builder.setUnderline(value);
    return this;

  }

  drawImage(path_image: string, invertColors: boolean, width?: number, height?: number): PosCashierPrinterService{
    const logo = new Image();
    logo.src = path_image;
    logo.onload = () => {
      this._imagePrintingService.init(logo, invertColors, width, height);
      this._escEncoder.raw(this._imagePrintingService.getUint8Array());
      this._imagePrintingService.resetImage();
      this.driver.write(this._escEncoder.encode());
    }
    return this;
  }

  drawQRCode(text: string, model?: 1 | 2, size?: qrSizeType, errorLevel?: qrErrorLevelType): PosCashierPrinterService {
    this._escEncoder.qrcode(text, model, size, errorLevel);
    this.driver.write(this._escEncoder.encode());
    return this;
  }
  /**
   * This refers to https://github.com/NielsLeenheer/EscPosEncoder#barcode
   * @param text 
   * @param model 
   * @param height 
   * @returns 
   */
  drawBarcode(text: string, model: symbologyType, height: number): PosCashierPrinterService{
    this._escEncoder.barcode(text, model, height);
    this.driver.write(this._escEncoder.encode());
    return this;
  }
  drawTextInBox(text: string, options: {
      marginLeft?: number;
      marginRight?: number;
      paddingLeft?: number;
      paddingRight?: number;
      style?: styleType;
      width?: number;
  }): PosCashierPrinterService{
    this._escEncoder.box(options, text);
    this.driver.write(this._escEncoder.encode());
    return this;
  }


  drawTable(columns: ReadonlyArray<{
            align?: alignType;
            marginLeft?: number;
            marginRight?: number;
            verticalAlign?: verticalAlignType;
            width?: number;
        }>,
        data: ReadonlyArray<ReadonlyArray<string>>
  ): PosCashierPrinterService{
    this._escEncoder.table(columns, data);
    this.driver.write(this._escEncoder.encode());
    return this;
  }

  /**
   *
   * @param value left|center\right
   */
  setJustification(value: string = 'left'): PosCashierPrinterService {
    this.builder.setJustification(value);
    return this;
  }

  /**
   *
   * @param value normal|large
   */
  setSize(value: string = 'normal'): PosCashierPrinterService {
    this.builder.setSize(value);
    return this;
  }

  /**
   *
   * @param text
   */
  writeLine(text: string = ''): PosCashierPrinterService {
    this.builder.writeLine(text);
    return this;
  }

  /**
   * write the current builder value to the driver and clear out the builder
   */
  flush() {
    this.driver.write(this.builder.flush());
  }
}

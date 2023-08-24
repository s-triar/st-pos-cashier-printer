import { Injectable, inject } from '@angular/core';
import { StarPrintBuilder } from './builders/StarPrintBuilder';
import { WebPrintBuilder } from './builders/WebPrintBuilder';
import { PrintBuilder } from './builders/PrintBuilder';
import { BehaviorSubject } from 'rxjs';
import { EscBuilder } from './builders/EscBuilder';
import { PosCashierImagePrintManagerService } from './pos-cashier-image-print-manager.service';
import EscPosEncoder from 'esc-pos-encoder';
import * as i0 from "@angular/core";
export class PosCashierPrinterService extends PrintBuilder {
    constructor() {
        super();
        this.isConnected = new BehaviorSubject(false);
        this._imagePrintingService = inject(PosCashierImagePrintManagerService);
        this._escEncoder = new EscPosEncoder();
    }
    /**
     *
     * @param driver UsbDriver | WebPrintDriver
     * @param printLanguage ESC/POS | StarPRNT | WebPRNT
     */
    setDriver(driver, printLanguage = 'ESC/POS') {
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
    init() {
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
    cut(cutType = 'full') {
        this.builder.cut(cutType);
        return this;
    }
    /**
     *
     * @param lineCount How many lines to feed
     */
    feed(lineCount = 1) {
        this.builder.feed(lineCount);
        return this;
    }
    setInverse(value = true) {
        this.builder.setInverse(value);
        return this;
    }
    setBold(value = true) {
        this.builder.setBold(value);
        return this;
    }
    setUnderline(value = true) {
        this.builder.setUnderline(value);
        return this;
    }
    drawImage(path_image, invertColors, width, height) {
        const logo = new Image();
        logo.src = path_image;
        logo.onload = () => {
            this._imagePrintingService.init(logo, invertColors, width, height);
            this._escEncoder.raw(this._imagePrintingService.getUint8Array());
            this._imagePrintingService.resetImage();
            this.driver.write(this._escEncoder.encode());
        };
        return this;
    }
    drawQRCode(text, model, size, errorLevel) {
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
    drawBarcode(text, model, height) {
        this._escEncoder.barcode(text, model, height);
        this.driver.write(this._escEncoder.encode());
        return this;
    }
    drawTextInBox(text, options) {
        this._escEncoder.box(options, text);
        this.driver.write(this._escEncoder.encode());
        return this;
    }
    drawTable(columns, data) {
        this._escEncoder.table(columns, data);
        this.driver.write(this._escEncoder.encode());
        return this;
    }
    /**
     *
     * @param value left|center\right
     */
    setJustification(value = 'left') {
        this.builder.setJustification(value);
        return this;
    }
    /**
     *
     * @param value normal|large
     */
    setSize(value = 'normal') {
        this.builder.setSize(value);
        return this;
    }
    /**
     *
     * @param text
     */
    writeLine(text = '') {
        this.builder.writeLine(text);
        return this;
    }
    /**
     * write the current builder value to the driver and clear out the builder
     */
    flush() {
        this.driver.write(this.builder.flush());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierPrinterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierPrinterService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierPrinterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zLWNhc2hpZXItcHJpbnRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcG9zLWNhc2hpZXItcHJpbnRlci9zcmMvbGliL3Bvcy1jYXNoaWVyLXByaW50ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdkMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQy9GLE9BQU8sYUFBYSxNQUFNLGlCQUFpQixDQUFDOztBQWM1QyxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsWUFBWTtJQVF4RDtRQUNFLEtBQUssRUFBRSxDQUFDO1FBTEgsZ0JBQVcsR0FBNkIsSUFBSSxlQUFlLENBQVUsS0FBSyxDQUFDLENBQUM7UUFFM0UsMEJBQXFCLEdBQUcsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDMUQsZ0JBQVcsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0lBR25ELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsU0FBUyxDQUFDLE1BQW1CLEVBQUUsZ0JBQXdCLFNBQVM7UUFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV0QixJ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QzVCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsQ0FBQyxPQUFlLEVBQUU7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLO1FBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7OEdBbExVLHdCQUF3QjtrSEFBeEIsd0JBQXdCLGNBSHZCLE1BQU07OzJGQUdQLHdCQUF3QjtrQkFKcEMsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0YXJQcmludEJ1aWxkZXIgfSBmcm9tICcuL2J1aWxkZXJzL1N0YXJQcmludEJ1aWxkZXInO1xuaW1wb3J0IHsgV2ViUHJpbnRCdWlsZGVyIH0gZnJvbSAnLi9idWlsZGVycy9XZWJQcmludEJ1aWxkZXInO1xuaW1wb3J0IHsgUHJpbnRCdWlsZGVyIH0gZnJvbSAnLi9idWlsZGVycy9QcmludEJ1aWxkZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBQcmludERyaXZlciB9IGZyb20gJy4vZHJpdmVycy9QcmludERyaXZlcic7XG5pbXBvcnQgeyBFc2NCdWlsZGVyIH0gZnJvbSAnLi9idWlsZGVycy9Fc2NCdWlsZGVyJztcbmltcG9ydCB7IFBvc0Nhc2hpZXJJbWFnZVByaW50TWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL3Bvcy1jYXNoaWVyLWltYWdlLXByaW50LW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgRXNjUG9zRW5jb2RlciBmcm9tICdlc2MtcG9zLWVuY29kZXInO1xuXG50eXBlIHN5bWJvbG9neVR5cGUgPSAndXBjYScgfCAndXBjZScgfCAnZWFuMTMnIHwgJ2VhbjgnIHwgJ2NvZGEzOScgfCAnaXRmJyB8ICdjb2RhYmFyJztcblxudHlwZSBxclNpemVUeXBlID0gMSB8IDIgfCAzIHwgNCB8IDUgfCA2IHwgNyB8IDg7XG50eXBlIHFyRXJyb3JMZXZlbFR5cGUgPSAnbCcgfCAnbScgfCAncScgfCAnaCc7XG50eXBlIGFsaWduVHlwZSA9ICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JztcbnR5cGUgdmVydGljYWxBbGlnblR5cGUgPSAndG9wJyB8ICdib3R0b20nO1xudHlwZSBzdHlsZVR5cGUgPSAnc2luZ2xlJyB8ICdkb3VibGUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcblxuZXhwb3J0IGNsYXNzIFBvc0Nhc2hpZXJQcmludGVyU2VydmljZSBleHRlbmRzIFByaW50QnVpbGRlcntcblxuICBwdWJsaWMgcHJpbnRMYW5ndWFnZSE6IHN0cmluZztcbiAgcHVibGljIGRyaXZlciE6IFByaW50RHJpdmVyO1xuICBwdWJsaWMgaXNDb25uZWN0ZWQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwdWJsaWMgYnVpbGRlciE6IFByaW50QnVpbGRlcjtcbiAgcHJpdmF0ZSBfaW1hZ2VQcmludGluZ1NlcnZpY2UgPSBpbmplY3QoUG9zQ2FzaGllckltYWdlUHJpbnRNYW5hZ2VyU2VydmljZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2VzY0VuY29kZXIgPSBuZXcgRXNjUG9zRW5jb2RlcigpO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBkcml2ZXIgVXNiRHJpdmVyIHwgV2ViUHJpbnREcml2ZXJcbiAgICogQHBhcmFtIHByaW50TGFuZ3VhZ2UgRVNDL1BPUyB8IFN0YXJQUk5UIHwgV2ViUFJOVFxuICAgKi9cbiAgc2V0RHJpdmVyKGRyaXZlcjogUHJpbnREcml2ZXIsIHByaW50TGFuZ3VhZ2U6IHN0cmluZyA9ICdFU0MvUE9TJyk6IFBvc0Nhc2hpZXJQcmludGVyU2VydmljZSB7XG4gICAgdGhpcy5kcml2ZXIgPSBkcml2ZXI7XG4gICAgdGhpcy5wcmludExhbmd1YWdlID0gcHJpbnRMYW5ndWFnZTtcbiAgICB0aGlzLmRyaXZlci5jb25uZWN0KCk7XG5cbiAgICB0aGlzLmRyaXZlci5pc0Nvbm5lY3RlZC5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIHRoaXMuaXNDb25uZWN0ZWQubmV4dChyZXN1bHQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBwcmludCBxdWV1ZVxuICAgKi9cbiAgaW5pdCgpOiBQb3NDYXNoaWVyUHJpbnRlclNlcnZpY2Uge1xuICAgIGlmICghdGhpcy5kcml2ZXIpIHtcbiAgICAgIHRocm93IFwiQ2Fubm90IGluaXRpYXRlIHRoZSBwcmludCBzZXJ2aWNlLiAgTm8gY29ubmVjdGlvbiBkZXRlY3RlZC5cIjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMucHJpbnRMYW5ndWFnZSkge1xuICAgICAgY2FzZSAnV2ViUFJOVCc6XG4gICAgICAgIHRoaXMuYnVpbGRlciA9IG5ldyBXZWJQcmludEJ1aWxkZXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdTdGFyUFJOVCc6XG4gICAgICAgIHRoaXMuYnVpbGRlciA9IG5ldyBTdGFyUHJpbnRCdWlsZGVyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5idWlsZGVyID0gbmV3IEVzY0J1aWxkZXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZGVyLmluaXQoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gY3V0VHlwZSBmdWxsfHBhcnRpYWxcbiAgICovXG4gIHB1YmxpYyBjdXQoY3V0VHlwZTogc3RyaW5nID0gJ2Z1bGwnKTogUG9zQ2FzaGllclByaW50ZXJTZXJ2aWNlIHtcbiAgICB0aGlzLmJ1aWxkZXIuY3V0KGN1dFR5cGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBsaW5lQ291bnQgSG93IG1hbnkgbGluZXMgdG8gZmVlZFxuICAgKi9cbiAgcHVibGljIGZlZWQobGluZUNvdW50OiBudW1iZXIgPSAxKTogUG9zQ2FzaGllclByaW50ZXJTZXJ2aWNlIHtcbiAgICB0aGlzLmJ1aWxkZXIuZmVlZChsaW5lQ291bnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0SW52ZXJzZSh2YWx1ZTogYm9vbGVhbiA9IHRydWUpOiBQb3NDYXNoaWVyUHJpbnRlclNlcnZpY2Uge1xuICAgIHRoaXMuYnVpbGRlci5zZXRJbnZlcnNlKHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcblxuICB9XG5cbiAgc2V0Qm9sZCh2YWx1ZTogYm9vbGVhbiA9IHRydWUpOiBQb3NDYXNoaWVyUHJpbnRlclNlcnZpY2Uge1xuICAgIHRoaXMuYnVpbGRlci5zZXRCb2xkKHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcblxuICB9XG5cbiAgc2V0VW5kZXJsaW5lKHZhbHVlOiBib29sZWFuID0gdHJ1ZSk6IFBvc0Nhc2hpZXJQcmludGVyU2VydmljZSB7XG4gICAgdGhpcy5idWlsZGVyLnNldFVuZGVybGluZSh2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgfVxuXG4gIGRyYXdJbWFnZShwYXRoX2ltYWdlOiBzdHJpbmcsIGludmVydENvbG9yczogYm9vbGVhbiwgd2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlcik6IFBvc0Nhc2hpZXJQcmludGVyU2VydmljZXtcbiAgICBjb25zdCBsb2dvID0gbmV3IEltYWdlKCk7XG4gICAgbG9nby5zcmMgPSBwYXRoX2ltYWdlO1xuICAgIGxvZ28ub25sb2FkID0gKCkgPT4ge1xuICAgICAgdGhpcy5faW1hZ2VQcmludGluZ1NlcnZpY2UuaW5pdChsb2dvLCBpbnZlcnRDb2xvcnMsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgdGhpcy5fZXNjRW5jb2Rlci5yYXcodGhpcy5faW1hZ2VQcmludGluZ1NlcnZpY2UuZ2V0VWludDhBcnJheSgpKTtcbiAgICAgIHRoaXMuX2ltYWdlUHJpbnRpbmdTZXJ2aWNlLnJlc2V0SW1hZ2UoKTtcbiAgICAgIHRoaXMuZHJpdmVyLndyaXRlKHRoaXMuX2VzY0VuY29kZXIuZW5jb2RlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRyYXdRUkNvZGUodGV4dDogc3RyaW5nLCBtb2RlbD86IDEgfCAyLCBzaXplPzogcXJTaXplVHlwZSwgZXJyb3JMZXZlbD86IHFyRXJyb3JMZXZlbFR5cGUpOiBQb3NDYXNoaWVyUHJpbnRlclNlcnZpY2Uge1xuICAgIHRoaXMuX2VzY0VuY29kZXIucXJjb2RlKHRleHQsIG1vZGVsLCBzaXplLCBlcnJvckxldmVsKTtcbiAgICB0aGlzLmRyaXZlci53cml0ZSh0aGlzLl9lc2NFbmNvZGVyLmVuY29kZSgpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogVGhpcyByZWZlcnMgdG8gaHR0cHM6Ly9naXRodWIuY29tL05pZWxzTGVlbmhlZXIvRXNjUG9zRW5jb2RlciNiYXJjb2RlXG4gICAqIEBwYXJhbSB0ZXh0IFxuICAgKiBAcGFyYW0gbW9kZWwgXG4gICAqIEBwYXJhbSBoZWlnaHQgXG4gICAqIEByZXR1cm5zIFxuICAgKi9cbiAgZHJhd0JhcmNvZGUodGV4dDogc3RyaW5nLCBtb2RlbDogc3ltYm9sb2d5VHlwZSwgaGVpZ2h0OiBudW1iZXIpOiBQb3NDYXNoaWVyUHJpbnRlclNlcnZpY2V7XG4gICAgdGhpcy5fZXNjRW5jb2Rlci5iYXJjb2RlKHRleHQsIG1vZGVsLCBoZWlnaHQpO1xuICAgIHRoaXMuZHJpdmVyLndyaXRlKHRoaXMuX2VzY0VuY29kZXIuZW5jb2RlKCkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGRyYXdUZXh0SW5Cb3godGV4dDogc3RyaW5nLCBvcHRpb25zOiB7XG4gICAgICBtYXJnaW5MZWZ0PzogbnVtYmVyO1xuICAgICAgbWFyZ2luUmlnaHQ/OiBudW1iZXI7XG4gICAgICBwYWRkaW5nTGVmdD86IG51bWJlcjtcbiAgICAgIHBhZGRpbmdSaWdodD86IG51bWJlcjtcbiAgICAgIHN0eWxlPzogc3R5bGVUeXBlO1xuICAgICAgd2lkdGg/OiBudW1iZXI7XG4gIH0pOiBQb3NDYXNoaWVyUHJpbnRlclNlcnZpY2V7XG4gICAgdGhpcy5fZXNjRW5jb2Rlci5ib3gob3B0aW9ucywgdGV4dCk7XG4gICAgdGhpcy5kcml2ZXIud3JpdGUodGhpcy5fZXNjRW5jb2Rlci5lbmNvZGUoKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIGRyYXdUYWJsZShjb2x1bW5zOiBSZWFkb25seUFycmF5PHtcbiAgICAgICAgICAgIGFsaWduPzogYWxpZ25UeXBlO1xuICAgICAgICAgICAgbWFyZ2luTGVmdD86IG51bWJlcjtcbiAgICAgICAgICAgIG1hcmdpblJpZ2h0PzogbnVtYmVyO1xuICAgICAgICAgICAgdmVydGljYWxBbGlnbj86IHZlcnRpY2FsQWxpZ25UeXBlO1xuICAgICAgICAgICAgd2lkdGg/OiBudW1iZXI7XG4gICAgICAgIH0+LFxuICAgICAgICBkYXRhOiBSZWFkb25seUFycmF5PFJlYWRvbmx5QXJyYXk8c3RyaW5nPj5cbiAgKTogUG9zQ2FzaGllclByaW50ZXJTZXJ2aWNle1xuICAgIHRoaXMuX2VzY0VuY29kZXIudGFibGUoY29sdW1ucywgZGF0YSk7XG4gICAgdGhpcy5kcml2ZXIud3JpdGUodGhpcy5fZXNjRW5jb2Rlci5lbmNvZGUoKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIGxlZnR8Y2VudGVyXFxyaWdodFxuICAgKi9cbiAgc2V0SnVzdGlmaWNhdGlvbih2YWx1ZTogc3RyaW5nID0gJ2xlZnQnKTogUG9zQ2FzaGllclByaW50ZXJTZXJ2aWNlIHtcbiAgICB0aGlzLmJ1aWxkZXIuc2V0SnVzdGlmaWNhdGlvbih2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIG5vcm1hbHxsYXJnZVxuICAgKi9cbiAgc2V0U2l6ZSh2YWx1ZTogc3RyaW5nID0gJ25vcm1hbCcpOiBQb3NDYXNoaWVyUHJpbnRlclNlcnZpY2Uge1xuICAgIHRoaXMuYnVpbGRlci5zZXRTaXplKHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdGV4dFxuICAgKi9cbiAgd3JpdGVMaW5lKHRleHQ6IHN0cmluZyA9ICcnKTogUG9zQ2FzaGllclByaW50ZXJTZXJ2aWNlIHtcbiAgICB0aGlzLmJ1aWxkZXIud3JpdGVMaW5lKHRleHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIHdyaXRlIHRoZSBjdXJyZW50IGJ1aWxkZXIgdmFsdWUgdG8gdGhlIGRyaXZlciBhbmQgY2xlYXIgb3V0IHRoZSBidWlsZGVyXG4gICAqL1xuICBmbHVzaCgpIHtcbiAgICB0aGlzLmRyaXZlci53cml0ZSh0aGlzLmJ1aWxkZXIuZmx1c2goKSk7XG4gIH1cbn1cbiJdfQ==
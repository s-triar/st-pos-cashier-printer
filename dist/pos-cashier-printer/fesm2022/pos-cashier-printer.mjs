import * as i0 from '@angular/core';
import { Injectable, inject, Component, NgModule } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import EscPosEncoder from 'esc-pos-encoder';

class PrintBuilder {
}

// Hat-tip to Håvard Lian @ https://github.com/haavardlian/escpos
class PrintBuffer {
    constructor(size = 1024) {
        this.buffer = new Uint8Array(size);
        this.size = 0;
    }
    clear() {
        this.size = 0;
    }
    flush() {
        const buffer = new Uint8Array(this.buffer.slice(0, this.size));
        this.size = 0;
        return buffer;
    }
    write(data) {
        this.resize(data.length);
        this.buffer.set(data, this.size);
        this.size += data.length;
        return this;
    }
    writeUInt8(value) {
        this.resize(1);
        this.buffer[this.size++] = value & 0xFF;
        return this;
    }
    resize(need) {
        const remaining = this.buffer.length - this.size;
        if (remaining < need) {
            const oldBuffer = this.buffer;
            const factor = Math.ceil((need - remaining) / oldBuffer.length) + 1;
            this.buffer = new Uint8Array(oldBuffer.length * factor);
            this.buffer.set(oldBuffer, 0);
        }
    }
}

const ESC$1 = 0x1b;
const GS$1 = 0x1D;
class StarPrintBuilder extends PrintBuilder {
    constructor() {
        super();
        this.encoder = new TextEncoder();
    }
    init() {
        this.buffer = new PrintBuffer();
        this.write(ESC$1);
        this.write("@");
        return this;
    }
    flush() {
        return this.buffer.flush();
    }
    feed(lineCount = 1) {
        this.write(ESC$1);
        this.write("a");
        this.write(lineCount);
        return this;
    }
    cut(cutType = 'full') {
        this.write(ESC$1);
        this.write("d");
        this.write(cutType === 'full' ? 2 : 3);
        return this;
    }
    writeLine(value) {
        return this.write(`${value}\n`);
    }
    setInverse(inverse = true) {
        this.write(ESC$1);
        (inverse) ? this.write("4") : this.write("5");
        return this;
    }
    setUnderline(underline = true) {
        this.write(ESC$1);
        this.write("-");
        this.write(underline ? 1 : 0);
        return this;
    }
    setJustification(value) {
        let alignment;
        switch (value) {
            case "center":
                alignment = 1;
                break;
            case "right":
                alignment = 2;
                break;
            default:
                alignment = 0;
                break;
        }
        this.write(ESC$1);
        this.write(GS$1);
        this.write("a");
        this.write(alignment);
        return this;
    }
    setBold(bold = true) {
        this.write(ESC$1);
        (bold) ? this.write("E") : this.write("F");
        return this;
    }
    setSize(size) {
        this.write(ESC$1);
        this.write("i");
        this.write((size === 'normal') ? 0 : 1);
        this.write((size === 'normal') ? 0 : 1);
        return this;
    }
    write(value) {
        if (typeof value === "number") {
            this.buffer.writeUInt8(value);
        }
        else if (typeof value === "string") {
            this.buffer.write(this.encoder.encode(value));
        }
        else {
            this.buffer.write(value);
        }
        return this;
    }
}

//
// StarWebPrintBuilder API
//
// Version 1.1.0
//
// Copyright 2012 STAR MICRONICS CO., LTD. All Rights Reserved.
//
var StarWebPrintBuilder = function () { };
StarWebPrintBuilder.prototype.createAlignmentElement = function (b) {
    var a = "<alignment";
    void 0 != b &&
        (a += this._analysisEnumAttribute("position", b.position, /^(left|center|right)$/));
    return a + "/>";
};
StarWebPrintBuilder.prototype.createBarcodeElement = function (b) {
    var a;
    if (void 0 != b) {
        a =
            "<barcode" +
                this._analysisEnumAttribute("symbology", b.symbology, /^(UPCE|UPCA|JAN8|JAN13|Code39|ITF|Code128|Code93|NW7)$/);
        a += this._analysisEnumAttribute("width", b.width, /^(width[2-4]|width_mode[1-9])$/);
        a += this._analysisEnumAttribute("hri", b.hri, /^(false|true)$/);
        a += this._analysisValueAttribute("height", b.height, 1, 255);
        if (void 0 == b.data)
            throw Error('Argument "data" is undefined.');
        a = a + ">" + this._encodeEscapeSequenceBinary(b.data);
    }
    else
        throw Error("Argument is undefined.");
    return (a += "</barcode>");
};
StarWebPrintBuilder.prototype.createBitImageElement = function (b) {
    var a = "<bitimage";
    if (void 0 != b) {
        var d = 0, e = 0, c = 0, f = 0;
        void 0 != b.x && (d = b.x);
        void 0 != b.y && (e = b.y);
        void 0 != b.width && (c = b.width);
        void 0 != b.height && (f = b.height);
        this._analysisValueAttribute("x", d, 0, 65535);
        this._analysisValueAttribute("y", e, 0, 65535);
        a += this._analysisValueAttribute("width", c, 0, 65535);
        a += this._analysisValueAttribute("height", f, 0, 65535);
        if (void 0 == b.context)
            throw Error('Argument "context" is undefined.');
        a =
            a +
                ">" +
                this._encodeRasterImage(b.context.getImageData(d, e, c, f).data, c, f);
    }
    else
        throw Error("Argument is undefined.");
    return (a += "</bitimage>");
};
StarWebPrintBuilder.prototype.createCutPaperElement = function (b) {
    var a = "<cutpaper";
    void 0 != b &&
        ((a += this._analysisEnumAttribute("feed", b.feed, /^(false|true)$/)),
            (a += this._analysisEnumAttribute("type", b.type, /^(full|partial)$/)));
    return a + "/>";
};
StarWebPrintBuilder.prototype.createFeedElement = function (b) {
    var a;
    if (void 0 != b)
        if (void 0 != b.line || void 0 != b.unit)
            (a = "<feed" + this._analysisValueAttribute("line", b.line, 1, 255)),
                (a += this._analysisValueAttribute("unit", b.unit, 1, 255));
        else
            throw Error('Argument "line / unit" is undefined.');
    else
        throw Error("Argument is undefined.");
    return a + "/>";
};
StarWebPrintBuilder.prototype.createInitializationElement = function (b) {
    var a = "<initialization";
    void 0 != b &&
        ((a += this._analysisEnumAttribute("reset", b.reset, /^(false|true)$/)),
            (a += this._analysisEnumAttribute("print", b.print, /^(false|true)$/)));
    return a + "/>";
};
StarWebPrintBuilder.prototype.createLogoElement = function (b) {
    var a = "<logo";
    void 0 != b &&
        ((a += this._analysisEnumAttribute("width", b.width, /^(single|double)$/)),
            (a += this._analysisEnumAttribute("height", b.height, /^(single|double)$/)),
            (a += this._analysisValueAttribute("number", b.number, 1, 255)));
    return a + "/>";
};
StarWebPrintBuilder.prototype.createPdf417Element = function (b) {
    var a;
    if (void 0 != b) {
        a =
            "<pdf417" +
                this._analysisEnumAttribute("level", b.level, /^(level[0-8])$/);
        void 0 != b.line &&
            (a =
                0 != b.line
                    ? a + this._analysisValueAttribute("line", b.line, 3, 90)
                    : a + ' line="0"');
        a += this._analysisValueAttribute("column", b.column, 0, 30);
        a += this._analysisValueAttribute("module", b.module, 1, 8);
        a += this._analysisValueAttribute("aspect", b.aspect, 1, 8);
        if (void 0 == b.data)
            throw Error('Argument "data" is undefined.');
        a = a + ">" + this._encodeEscapeSequenceBinary(b.data);
    }
    else
        throw Error("Argument is undefined.");
    return (a += "</pdf417>");
};
StarWebPrintBuilder.prototype.createPeripheralElement = function (b) {
    var a = "<peripheral";
    void 0 != b &&
        ((a += this._analysisValueAttribute("channel", b.channel, 1, 2)),
            (a += this._analysisValueAttribute("on", b.on, 1, 65535)),
            (a += this._analysisValueAttribute("off", b.off, 1, 65535)));
    return a + "/>";
};
StarWebPrintBuilder.prototype.createQrCodeElement = function (b) {
    var a;
    if (void 0 != b) {
        a =
            "<qrcode" +
                this._analysisEnumAttribute("model", b.model, /^(model[12])$/);
        a += this._analysisEnumAttribute("level", b.level, /^(level_[lmqh])$/);
        a += this._analysisValueAttribute("cell", b.cell, 1, 8);
        if (void 0 == b.data)
            throw Error('Argument "data" is undefined.');
        a = a + ">" + this._encodeEscapeSequenceBinary(b.data);
    }
    else
        throw Error("Argument is undefined.");
    return (a += "</qrcode>");
};
StarWebPrintBuilder.prototype.createRawDataElement = function (b) {
    if (void 0 != b) {
        if (void 0 == b.data)
            throw Error('Argument "data" is undefined.');
        b = "<rawdata>" + this._encodeBase64Binary(b.data);
    }
    else
        throw Error("Argument is undefined.");
    return b + "</rawdata>";
};
StarWebPrintBuilder.prototype.createRuledLineElement = function (b) {
    var a = "<ruledline";
    void 0 != b &&
        ((a += this._analysisEnumAttribute("thickness", b.thickness, /^(thin|medium|thick|double_(thin|medium|thick))$/)),
            (a += this._analysisValueAttribute("width", b.width, 1, 65535)));
    return a + "/>";
};
StarWebPrintBuilder.prototype.createSoundElement = function (b) {
    var a = "<sound";
    void 0 != b &&
        ((a += this._analysisValueAttribute("channel", b.channel, 1, 2)),
            (a += this._analysisValueAttribute("repeat", b.repeat, 1, 20)));
    return a + "/>";
};
StarWebPrintBuilder.prototype.createTextElement = function (b) {
    var a;
    if (void 0 != b)
        (a =
            "<text" +
                this._analysisEnumAttribute("emphasis", b.emphasis, /^(false|true)$/)),
            (a += this._analysisEnumAttribute("invert", b.invert, /^(false|true)$/)),
            (a += this._analysisEnumAttribute("linespace", b.linespace, /^(24|32)$/)),
            (a += this._analysisEnumAttribute("font", b.font, /^(font_[ab])$/)),
            (a += this._analysisEnumAttribute("underline", b.underline, /^(false|true)$/)),
            (a += this._analysisValueAttribute("characterspace", b.characterspace, 0, 7)),
            (a += this._analysisValueAttribute("width", b.width, 1, 6)),
            (a += this._analysisValueAttribute("height", b.height, 1, 6)),
            (a += this._analysisEnumAttribute("codepage", b.codepage, /^(cp(437|737|772|774|851|852|855|857|858|860|861|862|863|864|865|866|869|874|928|932|998|999|1001|1250|1251|1252|2001|3001|3002|3011|3012|3021|3041|3840|3841|3843|3844|3845|3846|3847|3848)|utf8|blank|utf8|shift_jis|gb18030|gb2312|big5|korea)$/)),
            (a += this._analysisEnumAttribute("international", b.international, /^(usa|france|germany|uk|denmark|sweden|italy|spain|japan|norway|denmark2|spain2|latin_america|korea|ireland|legal)$/)),
            void 0 != b.data
                ? ((a += ">"),
                    (a =
                        !0 == b.binary
                            ? a + this._encodeEscapeSequenceBinary(b.data)
                            : a + this._encodeEscapeSequence(b.data)),
                    (a += "</text>"))
                : (a += "/>");
    else
        throw Error("Argument is undefined.");
    return a;
};
StarWebPrintBuilder.prototype.createHoldPrintElement = function (b) {
    var a = "<holdprint";
    void 0 != b &&
        (a += this._analysisEnumAttribute("type", b.type, /^(valid|invalid|default)$/));
    return a + "/>";
};
StarWebPrintBuilder.prototype._analysisEnumAttribute = function (b, a, d) {
    if (void 0 != a) {
        if (!d.test(a))
            throw Error('Argument "' + b + '" is invalid.');
        return " " + b + '="' + a + '"';
    }
    return "";
};
StarWebPrintBuilder.prototype._analysisValueAttribute = function (b, a, d, e) {
    if (void 0 != a) {
        if (a < d || a > e)
            throw Error('Argument "' + b + '" is invalid.');
        return " " + b + '="' + a + '"';
    }
    return "";
};
StarWebPrintBuilder.prototype._encodeEscapeSequence = function (b) {
    var a = /[\\\x00-\x20\x26\x3c\x3e\x7f]/g;
    a.test(b) &&
        (b = b.replace(a, function (a) {
            return "\\" == a
                ? "\\\\"
                : "\\x" + ("0" + a.charCodeAt(0).toString(16)).slice(-2);
        }));
    return b;
};
StarWebPrintBuilder.prototype._encodeEscapeSequenceBinary = function (b) {
    var a = /[\\\x00-\x20\x26\x3c\x3e\x7f-\xff]/g;
    a.test(b) &&
        (b = b.replace(a, function (a) {
            return "\\" == a
                ? "\\\\"
                : "\\x" + ("0" + a.charCodeAt(0).toString(16)).slice(-2);
        }));
    return b;
};
StarWebPrintBuilder.prototype._encodeBase64Binary = function (b) {
    var a = "", d = b.length;
    b += "\x00\x00";
    for (var e = 0; e < d; e += 3)
        var c = (b.charCodeAt(e) << 16) |
            (b.charCodeAt(e + 1) << 8) |
            b.charCodeAt(e + 2), a = a +
            ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((c >> 18) & 63) +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((c >> 12) & 63) +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((c >> 6) & 63) +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c & 63));
    switch (d % 3) {
        case 1:
            return a.slice(0, -2) + "==";
        case 2:
            return a.slice(0, -1) + "=";
    }
    return a;
};
StarWebPrintBuilder.prototype._encodeRasterImage = function (b, a, d) {
    for (var e = [
        [-254, -126, -222, -94, -246, -118, -214, -86],
        [-62, -190, -30, -158, -54, -182, -22, -150],
        [-206, -78, -238, -110, -198, -70, -230, -102],
        [-14, -142, -46, -174, -6, -134, -38, -166],
        [-242, -114, -210, -82, -250, -122, -218, -90],
        [-50, -178, -18, -146, -58, -186, -26, -154],
        [-194, -66, -226, -98, -202, -74, -234, -106],
        [-2, -130, -34, -162, -10, -138, -42, -170],
    ], c = "", f = 0, g = 0; g < d; g++) {
        for (var h = 0, k = 128, l = 0; l < a; l++)
            if ((((30 * b[f] + 59 * b[f + 1] + 11 * b[f + 2]) * b[f + 3] + 12800) /
                25500 -
                b[f + 3] <
                e[g & 7][l & 7] && (h |= k),
                (f += 4),
                0 == (k >>= 1)))
                (c += String.fromCharCode(h)), (h = 0), (k = 128);
        128 != k && (c += String.fromCharCode(h));
    }
    b = c;
    c = "";
    a = b.length;
    b += "\x00\x00";
    for (g = 0; g < a; g += 3)
        (d =
            (b.charCodeAt(g) << 16) |
                (b.charCodeAt(g + 1) << 8) |
                b.charCodeAt(g + 2)),
            (c +=
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((d >> 18) & 63) +
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((d >> 12) & 63) +
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((d >> 6) & 63) +
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d & 63));
    switch (a % 3) {
        case 1:
            return c.slice(0, -2) + "==";
        case 2:
            return c.slice(0, -1) + "=";
    }
    return c;
};

class WebPrintBuilder extends PrintBuilder {
    constructor() {
        super();
        this.builder = new StarWebPrintBuilder();
    }
    init() {
        this.request += this.builder.createInitializationElement();
        return this;
    }
    setJustification(value = 'left') {
        this.request += this.builder.createAlignmentElement({ position: value });
        return this;
    }
    setBold(value = true) {
        this.request += this.builder.createTextElement({ emphasis: value });
        return this;
    }
    setUnderline(value = true) {
        this.request += this.builder.createTextElement({ underline: value });
        return this;
    }
    setInverse(value = true) {
        this.request += this.builder.createTextElement({ invert: value });
        return this;
    }
    writeLine(value) {
        this.request += this.builder.createTextElement({ data: `${value}\n` });
        return this;
    }
    setSize(size = 'normal') {
        let fontSize;
        switch (size) {
            case 'large':
                fontSize = 2;
                break;
            default:
                fontSize = 1;
                break;
        }
        this.request += this.builder.createTextElement({ width: fontSize, height: fontSize });
        return this;
    }
    cut(type = 'full') {
        this.request += this.builder.createCutPaperElement({ feed: true, type: type });
        return this;
    }
    feed(lines = 1) {
        this.request += this.builder.createFeedElement({ line: lines });
        return this;
    }
    flush() {
        return this.request;
    }
}

const ESC = 0x1b;
const GS = 0x1D;
class EscBuilder extends PrintBuilder {
    constructor() {
        super();
        this.encoder = new TextEncoder();
    }
    init() {
        this.buffer = new PrintBuffer();
        this.write(ESC);
        this.write("@");
        return this;
    }
    flush() {
        return this.buffer.flush();
    }
    feed(lineCount = 1) {
        this.write(ESC);
        this.write("d");
        this.write(lineCount);
        return this;
    }
    cut(cutType = 'full') {
        this.write(GS);
        this.write("V");
        this.write(cutType === 'full' ? 1 : 0);
        return this;
    }
    writeLine(value) {
        return this.write(`${value}\n`);
    }
    setInverse(inverse = true) {
        this.write(GS);
        this.write("B");
        this.write(inverse ? 1 : 0);
        return this;
    }
    setUnderline(value = true) {
        this.write(ESC);
        this.write("-");
        this.write(value ? 1 : 0);
        return this;
    }
    setJustification(value = 'left') {
        let alignment;
        switch (value) {
            case "center":
                alignment = 1;
                break;
            case "right":
                alignment = 2;
                break;
            default:
                alignment = 0;
                break;
        }
        this.write(ESC);
        this.write("a");
        this.write(alignment);
        return this;
    }
    setBold(bold = true) {
        this.write(ESC);
        this.write("E");
        this.write(bold ? 1 : 0);
        return this;
    }
    /**
    @param mode 0, 0x30
    */
    setSize(size = 'normal') {
        this.write(ESC);
        this.write("!");
        this.write((size === 'normal') ? 0 : 0x30);
        return this;
    }
    write(value) {
        if (typeof value === "number") {
            this.buffer.writeUInt8(value);
        }
        else if (typeof value === "string") {
            this.buffer.write(this.encoder.encode(value));
        }
        else {
            this.buffer.write(value);
        }
        return this;
    }
}

class PosCashierImagePrintManagerService {
    // the best print quality is achieved when width and height are both multiples of 8
    constructor() {
        this.invertColors = true;
        this.ESC_INIT = [0x1b, 0x40];
        this.ESC_BIT_IMAGE = [0x1b, 0x2a];
        this.DOTS_DENSITY = 24;
        this.LUMINANCE = {
            RED: 0.299,
            GREEN: 0.587,
            BLUE: 0.114
        };
        this.LINE_FEED = 0x0a;
        // https://www.sparkag.com.br/wp-content/uploads/2016/06/ESC_POS-AK912-English-Command-Specifications-V1.4.pdf
        this.LINE_FEED_AMOUNT = [0x1b, 0x33, 0x18]; // the third parameter is a numeric value where 1 = 0.125mm
        this.LINE_FEED_DEFAULT = [0x1b, 0x32];
    }
    init(image, invertColors, width, height) {
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
    calculateLuminance(pixel) {
        let lum = this.LUMINANCE.RED * pixel[0] + this.LUMINANCE.GREEN * pixel[1] + this.LUMINANCE.BLUE * pixel[2];
        return this.invertColors ? 255 - lum : lum;
    }
    calculateSlice(x, y) {
        const threshold = 127;
        let slice = 0;
        for (let bit = 0; bit < 8; bit++) {
            if ((y + bit) >= this.imageData.height)
                continue;
            const index = (this.imageData.width * (y + bit) + x) * 4;
            const pixel = [
                this.imageData.data[index],
                this.imageData.data[index + 1],
                this.imageData.data[index + 2]
            ];
            const luminance = this.calculateLuminance(pixel);
            slice |= (luminance < threshold ? 1 : 0) << 7 - bit;
        }
        return slice;
    }
    collectStripe(x, y) {
        let slices = [];
        let z = y + this.DOTS_DENSITY;
        let i = 0;
        while (y < z && i < 3) {
            slices.push(this.calculateSlice(x, y));
            y += 8;
        }
        return slices;
    }
    manipulateImage() {
        let data = [];
        const imageWidth = this.imageData.width;
        for (let y = 0; y < this.imageData.height; y += this.DOTS_DENSITY) {
            data.push(...this.ESC_BIT_IMAGE, 33, (0x00ff & imageWidth), (0xff00 & imageWidth) >> 8);
            for (let x = 0; x < imageWidth; x++) {
                data.push(...this.collectStripe(x, y));
            }
            data.push(this.LINE_FEED);
        }
        return data;
    }
    getUint8Array() {
        let transformedImage = [];
        transformedImage.push(...this.LINE_FEED_AMOUNT);
        transformedImage.push(...this.manipulateImage());
        transformedImage.push(...this.LINE_FEED_DEFAULT);
        return new Uint8Array(transformedImage);
    }
    resetImage() {
        this.imageData = undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierImagePrintManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierImagePrintManagerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierImagePrintManagerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class PosCashierPrinterService extends PrintBuilder {
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

class PosCashierPrinterComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierPrinterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.0", type: PosCashierPrinterComponent, selector: "st-pos-cashier-printer", ngImport: i0, template: `
    <p>
      pos-cashier-printer works!
    </p>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierPrinterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'st-pos-cashier-printer', template: `
    <p>
      pos-cashier-printer works!
    </p>
  ` }]
        }] });

class PosCashierPrinterModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierPrinterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: PosCashierPrinterModule, declarations: [PosCashierPrinterComponent], exports: [PosCashierPrinterComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierPrinterModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: PosCashierPrinterModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        PosCashierPrinterComponent
                    ],
                    imports: [],
                    exports: [
                        PosCashierPrinterComponent
                    ]
                }]
        }] });

class PrintDriver {
}

//
// StarWebPrintTrader API
//
// Version 1.1.0
//
// Copyright 2012 STAR MICRONICS CO., LTD. All Rights Reserved.
//
/**
 * @type Class
 */
var StarWebPrintTrader = function (a) {
    this.papertype = this.checkedblock = this.url = null;
    this.timeout = 9e4;
    this.onTimeout = this.onError = this.onReceive = null;
    this.holdprint_timeout = void 0;
    this._json = this._url = null;
    void 0 != a &&
        (void 0 != a.url && (this.url = a.url),
            void 0 != a.checkedblock && (this.checkedblock = a.checkedblock),
            void 0 != a.papertype && (this.papertype = a.papertype),
            void 0 != a.timeout && (this.timeout = a.timeout),
            void 0 != a.holdprint_timeout &&
                (this.holdprint_timeout = a.holdprint_timeout));
}, _handlerCallback = {};
function _onFinish(a) {
    var b = _handlerCallback[a.url], c = a.response;
    _handlerCallback[a.url] = null;
    if (200 == a.htmlCode)
        b.onReceive({
            traderSuccess: c.slice(c.indexOf("&lt;success&gt;") + 15, c.indexOf("&lt;/success&gt;")),
            traderCode: c.slice(c.indexOf("&lt;code&gt;") + 12, c.indexOf("&lt;/code&gt;")),
            traderStatus: c.slice(c.indexOf("&lt;status&gt;") + 14, c.indexOf("&lt;/status&gt;")),
            status: a.htmlCode,
            responseText: c,
        });
    else
        b.onError({ status: a.htmlCode, responseText: c });
}
StarWebPrintTrader.prototype._callMessageHandler = function () {
    var a = this;
    null == _handlerCallback[a._url]
        ? ((_handlerCallback[a._url] = a),
            webkit.messageHandlers.sendMessageHandler.postMessage(a._json))
        : setTimeout(function () {
            a._callMessageHandler();
        }, 500);
};
StarWebPrintTrader.prototype.sendMessage = function (a) {
    var b = "<root";
    void 0 != a.checkedblock
        ? !1 == a.checkedblock && (b += ' checkedblock="false"')
        : !1 == this.checkedblock && (b += ' checkedblock="false"');
    void 0 != a.papertype
        ? "normal" == a.papertype
            ? (b += ' papertype="normal"')
            : "black_mark" == a.papertype
                ? (b += ' papertype="black_mark"')
                : "black_mark_and_detect_at_power_on" == a.papertype &&
                    (b += ' papertype="black_mark_and_detect_at_power_on"')
        : "normal" == this.papertype
            ? (b += ' papertype="normal"')
            : "black_mark" == this.papertype
                ? (b += ' papertype="black_mark"')
                : "black_mark_and_detect_at_power_on" == this.papertype &&
                    (b += ' papertype="black_mark_and_detect_at_power_on"');
    void 0 != a.holdprint_timeout
        ? (b += ' holdprint_timeout="' + a.holdprint_timeout + '"')
        : void 0 != this.holdprint_timeout &&
            (b += ' holdprint_timeout="' + this.holdprint_timeout + '"');
    var b = b + (">" + a.request + "</root>"), c;
    c =
        '<StarWebPrint xmlns="http://www.star-m.jp" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Request>';
    c += this._encodeEscapeSequence(b);
    c += "</Request>";
    c += "</StarWebPrint>";
    b = "";
    b = void 0 != a.url ? a.url : this.url;
    if (/^https?:\/\/(localhost|127\.0\.0\.1):8001\//.test(b.toLowerCase()) &&
        -1 != navigator.userAgent.indexOf("webPRNTSupportMessageHandler"))
        (this._json = JSON.stringify({ url: b, body: c })),
            (this._url = b),
            this._callMessageHandler();
    else {
        var d = null;
        if (window.XMLHttpRequest)
            d = new XMLHttpRequest();
        else if (window.ActiveXObject)
            d = new ActiveXObject("Microsoft.XMLHTTP");
        else {
            if (this.onError)
                this.onError({
                    status: 10001,
                    responseText: "XMLHttpRequest is not supported.",
                });
            return;
        }
        if (-1 != navigator.userAgent.indexOf("iPad;") ||
            -1 != navigator.userAgent.indexOf("iPhone;") ||
            -1 != navigator.userAgent.indexOf("iPod touch;") ||
            -1 != navigator.userAgent.indexOf("Android"))
            if (-1 == navigator.userAgent.indexOf("WebPRNTSupportHTTPS") &&
                (0 == b.toLowerCase().indexOf("https://localhost") ||
                    0 == b.toLowerCase().indexOf("https://127.0.0.1")))
                b = "http://" + b.substring(8);
        try {
            d.open("POST", b, !0);
        }
        catch (f) {
            if (this.onError)
                this.onError({ status: 10002, responseText: f.message });
            return;
        }
        try {
            void 0 != a.timeout
                ? (d.timeout = a.timeout)
                : this.timeout && (d.timeout = this.timeout);
        }
        catch (h) { }
        d.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
        var e = this;
        d.onreadystatechange = function () {
            if (4 == d.readyState)
                try {
                    if (200 == d.status) {
                        var a = d.responseXML.getElementsByTagName("Response");
                        if (0 < a.length) {
                            if (e.onReceive) {
                                var b = a[0].childNodes[0].nodeValue;
                                e.onReceive({
                                    traderSuccess: b.slice(b.indexOf("<success>") + 9, b.indexOf("</success>")),
                                    traderCode: b.slice(b.indexOf("<code>") + 6, b.indexOf("</code>")),
                                    traderStatus: b.slice(b.indexOf("<status>") + 8, b.indexOf("</status>")),
                                    status: d.status,
                                    responseText: d.responseText,
                                });
                            }
                        }
                        else if (e.onError)
                            e.onError({ status: d.status, responseText: d.responseText });
                    }
                    else if (e.onError)
                        e.onError({ status: d.status, responseText: d.responseText });
                }
                catch (c) {
                    if (e.onError)
                        e.onError({
                            status: 0,
                            responseText: "Connection timeout occurred.",
                        });
                }
        };
        try {
            d.ontimeout = function () {
                if (e.onTimeout)
                    e.onTimeout();
            };
        }
        catch (k) { }
        try {
            d.send(c);
        }
        catch (g) {
            if (this.onError)
                this.onError({ status: 10003, responseText: g.message });
        }
    }
};
StarWebPrintTrader.prototype._onHandlerSuccess = function (a) {
    if (trader.onReceive)
        trader.onReceive(a);
};
StarWebPrintTrader.prototype._onHandlerError = function (a) {
    if (trader.onError)
        trader.onError(a);
};
StarWebPrintTrader.prototype.isCoverOpen = function (a) {
    return parseInt(a.traderStatus.substr(4, 2), 16) & 32 ? !0 : !1;
};
StarWebPrintTrader.prototype.isOffLine = function (a) {
    return parseInt(a.traderStatus.substr(4, 2), 16) & 8 ? !0 : !1;
};
StarWebPrintTrader.prototype.isCompulsionSwitchClose = function (a) {
    return parseInt(a.traderStatus.substr(4, 2), 16) & 4 ? !0 : !1;
};
StarWebPrintTrader.prototype.isEtbCommandExecute = function (a) {
    return parseInt(a.traderStatus.substr(4, 2), 16) & 2 ? !0 : !1;
};
StarWebPrintTrader.prototype.isHighTemperatureStop = function (a) {
    return parseInt(a.traderStatus.substr(6, 2), 16) & 64 ? !0 : !1;
};
StarWebPrintTrader.prototype.isNonRecoverableError = function (a) {
    return parseInt(a.traderStatus.substr(6, 2), 16) & 32 ? !0 : !1;
};
StarWebPrintTrader.prototype.isAutoCutterError = function (a) {
    return parseInt(a.traderStatus.substr(6, 2), 16) & 8 ? !0 : !1;
};
StarWebPrintTrader.prototype.isBlackMarkError = function (a) {
    return parseInt(a.traderStatus.substr(8, 2), 16) & 8 ? !0 : !1;
};
StarWebPrintTrader.prototype.isPaperEnd = function (a) {
    return parseInt(a.traderStatus.substr(10, 2), 16) & 8 ? !0 : !1;
};
StarWebPrintTrader.prototype.isPaperNearEnd = function (a) {
    return parseInt(a.traderStatus.substr(10, 2), 16) & 4 ? !0 : !1;
};
StarWebPrintTrader.prototype.isPaperPresent = function (a) {
    return parseInt(a.traderStatus.substr(12, 2), 16) & 2 ? !0 : !1;
};
StarWebPrintTrader.prototype.extractionEtbCounter = function (a) {
    var b = 0;
    parseInt(a.traderStatus.substr(14, 2), 16) & 64 && (b |= 16);
    parseInt(a.traderStatus.substr(14, 2), 16) & 32 && (b |= 8);
    parseInt(a.traderStatus.substr(14, 2), 16) & 8 && (b |= 4);
    parseInt(a.traderStatus.substr(14, 2), 16) & 4 && (b |= 2);
    parseInt(a.traderStatus.substr(14, 2), 16) & 2 && (b |= 1);
    return b;
};
StarWebPrintTrader.prototype._encodeEscapeSequence = function (a) {
    var b = /[<>&]/g;
    b.test(a) &&
        (a = a.replace(b, function (a) {
            switch (a) {
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
            }
            return "&amp;";
        }));
    return a;
};

class WebPrintDriver extends PrintDriver {
    constructor(url, useSecure = false) {
        super();
        this.isConnected = new BehaviorSubject(false);
        this.useSecure = false;
        this.isStarPrinter = false;
        this.url = url;
        this.useSecure = useSecure;
    }
    connect() {
        const useSecure = (this.useSecure) ? 's' : '';
        this.trader = new StarWebPrintTrader({ url: `http${useSecure}://${this.url}/StarWebPRNT/SendMessage` });
        this.trader.onReceive = (response) => {
            this.isConnected.next(true);
        };
        this.trader.onError = (response) => {
            this.isConnected.next(false);
        };
        this.trader.sendMessage('');
    }
    async write(data) {
        this.trader.sendMessage({ request: data });
    }
}

/// <reference types="w3c-web-usb" />
class UsbDriver extends PrintDriver {
    constructor(vendorId, productId) {
        super();
        this.isConnected = new BehaviorSubject(false);
        this.vendorId = vendorId;
        this.productId = productId;
    }
    connect() {
        navigator.usb.getDevices().then((devices) => {
            this.device = devices.find((device) => {
                return device.vendorId === this.vendorId && device.productId === this.productId;
            });
            console.log(this.device);
            return this.device.open();
        })
            .then(() => {
            let result = this.device.selectConfiguration(1);
            return result;
        })
            .then(() => {
            let result = this.device.claimInterface(0);
            return result;
        }).then((result) => {
            const endPoints = this.device.configuration?.interfaces[0].alternate.endpoints;
            this.endPoint = endPoints.find((endPoint) => endPoint.direction === 'out');
            this.isConnected.next(true);
            this.listenForUsbConnections();
        }).catch((result) => {
            this.isConnected.next(false);
        });
    }
    /**
     * Request a USB device through the browser
     * return Observable<USBDevice>
     */
    requestUsb() {
        return new Observable(observer => {
            navigator.usb.requestDevice({ filters: [] })
                .then((result) => {
                this.vendorId = result.vendorId;
                this.productId = result.productId;
                return observer.next(result);
            }).catch((error) => {
                return observer.error(error);
            });
        });
    }
    async write(data) {
        this.device.transferOut(this.endPoint.endpointNumber, data);
    }
    listenForUsbConnections() {
        navigator.usb.addEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.usb.addEventListener('connect', () => {
            this.isConnected.next(true);
        });
    }
}

/// <reference types="web-bluetooth" />
// import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';
class BluetoothLowEnergyDriver extends PrintDriver {
    constructor(vendorId, productId) {
        super();
        this.isConnected = new BehaviorSubject(false);
        this.vendorId = vendorId;
        this.productId = productId;
    }
    convertStringToUUID(s) {
        s = s.toLowerCase();
        if (s.includes('-')) {
            return s;
        }
        else {
            let ss;
            if (s.substring(0, 2).includes('0x')) {
                ss = s.substring(2);
            }
            else {
                ss = s;
            }
            return parseInt(ss, 16);
        }
    }
    requestDevice(serviceUUID, characteristicUUID) {
        if (typeof serviceUUID === 'string') {
            serviceUUID = this.convertStringToUUID(serviceUUID);
        }
        if (typeof characteristicUUID === 'string') {
            characteristicUUID = this.convertStringToUUID(characteristicUUID);
        }
        const serviceUUIDs = [serviceUUID];
        const opt = { optionalServices: serviceUUIDs, acceptAllDevices: true };
        this.serviceUUID = serviceUUID;
        this.characteristicUUID = characteristicUUID;
        return new Observable(observer => {
            navigator.bluetooth.requestDevice(opt)
                .then((device) => {
                this.device = device;
                return observer.next(this.device);
            })
                .catch((error) => {
                return observer.error(error);
            });
        });
    }
    disconnect() {
        this.removeBluetoothConnections();
    }
    connect() {
        this.device.gatt?.connect()
            .then((server) => {
            return server.getPrimaryService(this.serviceUUID);
        })
            .then((service) => {
            return service.getCharacteristic(this.characteristicUUID);
        })
            .then((characteristic) => {
            this.isConnected.next(true);
            this.listenForBluetoothConnections();
            this.characteristic = characteristic;
        });
    }
    write(data) {
        const array_chunks = (array, chunkSize) => {
            const chunks = [];
            for (let i = 0, len = array.length; i < len; i += chunkSize) {
                chunks.push(array.slice(i, i + chunkSize));
            }
            return chunks;
        };
        const chunks = array_chunks(data, 20);
        let index = 1;
        for (const chunk of chunks) {
            setTimeout(() => {
                this.characteristic.writeValue(chunk);
            }, 100 + index * 100);
            index++;
        }
    }
    listenForBluetoothConnections() {
        navigator.bluetooth.addEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.bluetooth.addEventListener('connect', () => {
            this.isConnected.next(true);
        });
    }
    removeBluetoothConnections() {
        navigator.bluetooth.removeEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.bluetooth.removeEventListener('connect', () => {
            this.isConnected.next(false);
        });
    }
}

/// <reference types="w3c-web-serial" />
class BluetoothSerialDriver extends PrintDriver {
    constructor(vendorId, productId) {
        super();
        this.isConnected = new BehaviorSubject(false);
        this.option = {
            baudRate: 9600
        };
        this.vendorId = vendorId;
        this.productId = productId;
    }
    requestPort() {
        return new Observable(observer => {
            navigator.serial.requestPort({ filters: [] })
                .then((result) => {
                this.port = result;
                return observer.next(result);
            })
                .catch((error) => {
                return observer.error(error);
            });
        });
    }
    setOpenOption(option) {
        this.option = { ...this.option, ...option };
    }
    disconnect() {
        // tslint:disable-next-line:no-non-null-assertion
        this.writer.releaseLock();
        this.port.close().then(x => this.removeSerialConnections());
    }
    connect() {
        navigator.serial.getPorts()
            .then((ports) => {
            return ports.find(x => x === this.port);
        })
            .then((p) => {
            return p?.open(this.option);
        })
            .then(() => {
            this.isConnected.next(true);
            this.listenForSerialConnections();
            this.writer = this.port.writable?.getWriter();
        })
            .catch((err) => {
            console.log(err);
            this.isConnected.next(false);
        });
    }
    async write(data) {
        // tslint:disable-next-line:no-non-null-assertion
        await this.writer.write(data);
    }
    listenForSerialConnections() {
        navigator.serial.addEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.serial.addEventListener('connect', () => {
            this.isConnected.next(true);
        });
    }
    removeSerialConnections() {
        navigator.serial.removeEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.serial.removeEventListener('connect', () => {
            this.isConnected.next(false);
        });
    }
}

/*
 * Public API Surface of pos-cashier-printer
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BluetoothLowEnergyDriver, BluetoothSerialDriver, PosCashierPrinterComponent, PosCashierPrinterModule, PosCashierPrinterService, UsbDriver, WebPrintDriver };
//# sourceMappingURL=pos-cashier-printer.mjs.map

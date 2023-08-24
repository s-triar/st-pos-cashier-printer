import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import EscPosEncoder from 'esc-pos-encoder';
import { ImagePrintingService } from './image-printing.service';
import {UsbDriver, BluetoothLowEnergyDriver, BluetoothSerialDriver, WebPrintDriver, PosCashierPrinterService } from "pos-cashier-printer";

export enum PRINTER_CONNECTION {
  Bluetooth = 'Bluetooth',
  USB= 'USB',
  Network= 'Network'
}
export enum BLUETOOTH_CONNECTION{
  BLE = 'Bluetooth Low Energy',
  Serial = 'Bluetooth Serial'
}


type rr = {
  devices: any,
  server: any,
  services: any,
  char: any,
  error: any
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pos-cashier-printer-app';

  @ViewChild('printerConSelected') printerConSelected!: MatSelect;
  @ViewChild('img') imh!: any;
  bluetoothTypeSelected!: string;

  connectionStatus = false;
  printerName = '';
  private readonly escEncoder = new EscPosEncoder();
  printerConnection = PRINTER_CONNECTION;
  bluetoothConnection = BLUETOOTH_CONNECTION;
  usbPrintDriver!: UsbDriver;
  serialPrintDriver!: BluetoothSerialDriver;
  blePrintDriver!: BluetoothLowEnergyDriver;

  webPrintDriver!: WebPrintDriver;
  ip = '';
  bleDescription = this.formBuilder.group({
    service: this.formBuilder.nonNullable.control<string|number>('', Validators.required),
    characteristic: this.formBuilder.nonNullable.control<string|number>('', Validators.required),
  });

  isSerialAvailable = false;
  isBluetoothAvailable = false;
  isUSBAvailable = false;


  port!: SerialPort;
  writer!: any;
  ble: rr = {
    char: null,
    devices: null,
    server: null,
    services: null,
    error: null
  };
  constructor(
    private formBuilder: FormBuilder,
    private printService: PosCashierPrinterService,
    private snackBar: MatSnackBar
    ) {
      if ('serial' in navigator){
        this.isSerialAvailable = true;
      }
      if ('bluetooth' in navigator){
        this.isBluetoothAvailable = true;
      }
      if ('usb' in navigator){
        this.isUSBAvailable = true;
      }
      this.printService.isConnected.subscribe(result => {
          this.connectionStatus = result;
          if (result) {
            console.log('Connected to printer!!!');
          } else {
            console.log('Not connected to printer.');
          }
      });
  }

  ngOnInit(): void {
  }

  connect(): void{
    if (this.printerConSelected.value === this.printerConnection.Bluetooth){
      if (!this.bluetoothTypeSelected){
        this.snackBar.open('Silahkan pilih jenis bluetooth terlebih dahulu.');
      }
      else if (this.bluetoothTypeSelected === this.bluetoothConnection.Serial){
        this.requestSerial();
      }else if (this.bluetoothTypeSelected === this.bluetoothConnection.BLE){
        this.requestBLE();
      }
      else{
        this.snackBar.open('Jenis bluetooth tidak dikenal.');
      }
    }else if (this.printerConSelected.value === this.printerConnection.USB){
      this.requestUsb();
    }else if (this.printerConSelected.value === this.printerConnection.Network){

    }else{
      this.snackBar.open('Silahkan pilih koneksi printer terlebih dahulu.')
    }
  }
  disconnect(): void{
    this.connectionStatus = false;
    this.printService.setDriver(new UsbDriver(undefined, undefined), undefined);
  }

  requestSerial(): void{
    this.serialPrintDriver = new BluetoothSerialDriver();
    this.serialPrintDriver.requestPort().subscribe((result: SerialPort) => {
      console.log(result, result.getInfo());
      this.printerName = 'Tidak diketahui';
      this.printService.setDriver(this.serialPrintDriver, 'ESC/POS');
    });
  }

  requestUsb(): void {
    this.usbPrintDriver = new UsbDriver();
    this.usbPrintDriver.requestUsb().subscribe(result => {
      this.printerName = result.productName! ?? result.manufacturerName!;
      this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
    });
  }

  connectToWebPrint(): void {
      this.webPrintDriver = new WebPrintDriver(this.ip);
      this.printService.setDriver(this.webPrintDriver, 'WebPRNT');
  }
  requestBLE(): void{
    this.blePrintDriver = new BluetoothLowEnergyDriver();
    const s = this.bleDescription.controls.service.value;
    const c = this.bleDescription.controls.characteristic.value;
    this.blePrintDriver.requestDevice(s, c).subscribe(result => {
      this.printerName = result.name! ?? 'Tidak diketahui';
      this.printService.setDriver(this.blePrintDriver, 'ESC/POS');
    });
  }

  private convertDescription(s: string): string|number{
    if (s.includes('-')){
      console.log('- :=>', s);
      return s;
    }else{
      let ss!: any;
      if (s.substr(0, 2).includes('0x')){
        ss = s.substr(2);
        console.log('0x:=>', s, ss);
      }
      else{
        ss = s;
        console.log(':=>', s, ss);
      }
      return parseInt(ss, 16);
    }
  }
  load_log(){
    let logo = new Image();
    logo.src = "assets/a.png";
    logo.onload = () => {
      let imagePrintingService = new ImagePrintingService(logo, true, 320, 300);
      // this.escEncoder.raw(imagePrintingService.getUint8Array())

        this.escEncoder.bold(false)        
        this.escEncoder.line("Download the app!") 
        this.escEncoder.qrcode('124131', undefined, 8)
        // this.escEncoder.qrcode('https://nielsleenheer.com', undefined, 8)
        this.escEncoder.barcode('apapun itu','codabar', 100)
        this.escEncoder.bold(false)
        this.escEncoder.table(
          [
            { width: 36, marginRight: 2, align: 'left' },
            { width: 18, marginRight: 2, align: 'left' },
            { width: 10, align: 'right' }
        ],
                      [
                          ["", "VAT", "EUR"],
                      ]
                  )
      // this.escEncoder.align("left")
      // this.escEncoder.codepage('windows1251');
      // this.escEncoder.text('Iñtërnâtiônàlizætiøn');
      // this.escEncoder.codepage('cp737');
      // this.escEncoder.text('ξεσκεπάζω την ψυχοφθόρα βδελυγμία');
      // console.log(this.escEncoder.encode());
      
      this.serialPrintDriver.write(this.escEncoder.encode())
      this.serialPrintDriver.write(this.escEncoder
        .barcode('123456789012', 'codabar', 400) // itf, dan coda39
        .encode())
    }
  }
  testPrinter(): void {


      this.printService.init()
          .setJustification('center')
          .setBold(true)
          .setSize('large')
          .writeLine('POS CASHIER PRINTER LIBRARY')
          .setBold(true)
          .setSize('normal')
          .writeLine('copy library')
          .setBold(false)
          .setJustification('center')
          .writeLine('1234567890123456789012345678901234567890')
          .feed(2)
          .cut('full')
          .drawTextInBox('hohoho',{})
          .drawTable([
            { align: 'right', width:3 }, 
            { align: 'center', width:1 }, 
            { align:'left', width: 21 }, 
            { align: 'center', width:1 }, 
            {align:'right',width:6}
          ], [['1','','Biskuit Coklat roma gandum baru','', '2.000']])
          .flush();
          this.printService.init().drawBarcode('1241421', 'itf', 400)
          .drawQRCode('hoyaaaa', 1)
          .flush();

  }

  objtostr(obj: any): string{
    let a = '';
    console.log(JSON.stringify(obj));
    // tslint:disable-next-line:forin
    for (const key in obj) {
      if (!key.includes('_')){
        // if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        a = a + `<u>${key}</u> : ${element} <br/>`;
        // }
      }
    }
    console.log(a);
    return a;
  }
}

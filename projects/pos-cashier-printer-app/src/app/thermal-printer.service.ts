// import { Injectable } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import EscPosEncoder from 'esc-pos-encoder';
// import { UsbDriver, BluetoothSerialDriver, PosCashierPrinterService } from 'pos-cashier-printer';
// import { BehaviorSubject, combineLatest } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { ImagePrintingService } from './image-printing.service';
// // import { ConnectThermalPrinterDialogComponent } from '../components/connect-thermal-printer-dialog/connect-thermal-printer-dialog.component';

// enum DeviceType {
//   USB,
//   BLUETOOTH
// }
// @Injectable({
//     providedIn: 'root',
// })
// export class ThermalPrinterService {
//     private readonly AUTO_PRINT_RECEIPT = "auto_print_receipt"
//     private readonly PRINTER_DEVICE = "printer_device"

//     private readonly productsTableFormat = [
//         { width: 18, marginRight: 1, align: 'left' },
//         { width: 4, align: 'right' },
//         { width: 9, align: 'right' }
//     ]

//     private readonly escEncoder = new EscPosEncoder();
//     private usbPrintDriver = new UsbDriver();
//     private bluetoothPrintDriver = new BluetoothSerialDriver();
//     readonly isConnected = new BehaviorSubject<boolean>(false)

//     private codepage = "auto"

//     constructor(private matDialog: MatDialog) {
//       const device = this.getSavedPrinterDevice()
//       if(device != null) {
//         if(device.type == DeviceType.USB) {
//           this.usbPrintDriver = new UsbDriver(device.vendorId, device.productId)
//           this.usbPrintDriver.connect()
//         }
//       }
      
//       const isConnectedObservable = combineLatest([this.usbPrintDriver.isConnected, this.bluetoothPrintDriver.isConnected]).pipe(
//           map(([usb, bluetooth]) => {
//               return usb || bluetooth
//           })
//       )

//       isConnectedObservable.subscribe(this.isConnected)
//     }

//     private savePrinterDevice(type: DeviceType, vendorId: number, productId: number) {
//       localStorage.setItem(this.PRINTER_DEVICE, JSON.stringify({type: type, vendorId: vendorId, productId: productId}));
//     }

//     private getSavedPrinterDevice(): any|null {
//       const deviceData = localStorage.getItem(this.PRINTER_DEVICE)
//       if(deviceData != null) {
//         return JSON.parse(deviceData)
//       }
//       else return null;
//     }

//     private deleteSavedPrinterDevice() {
//       localStorage.removeItem(this.PRINTER_DEVICE)
//     }

//     disconnect() {
//       this.usbPrintDriver = new UsbDriver()
//       this.bluetoothPrintDriver = new BluetoothSerialDriver()
//       this.deleteSavedPrinterDevice()
//       window.location.reload()
//     }

//     connectUsbPrinter() {
//         this.usbPrintDriver.requestUsb().subscribe(
//           (result) => {
//             // HACK to this fucking brand that doesn't support any codepage except chinese
//             if (result.manufacturerName == "GEZHI") {
//                 this.codepage = "cp54936"
//             } else {
//                 this.codepage = "auto"
//             }
//             this.usbPrintDriver.connect()
//             this.savePrinterDevice(DeviceType.USB, result.vendorId, result.productId)
//           },
//           (error) => {
//             console.log(error);
//           }
//         );
//     }

//     connectBluetoothPrinter() {
//         this.bluetoothPrintDriver.requestPort().subscribe(
//             (result) => {
//                 // HACK to this fucking brand that doesn't support any codepage except chinese
//                 if (result.name == "MTP-II") {
//                     this.codepage = "cp54936"
//                 } else {
//                     this.codepage = "auto"
//                 }
//                 this.bluetoothPrintDriver.connect()
//             },
//             (error) => {
//                 console.log(error);
//             }
//         )
//     }

//     get hasPrinterSupport(): boolean {
//         return this.usbPrintDriver.isSupported || this.bluetoothPrintDriver.isSupported
//     }

//     get isBluetoothSupported(): boolean {
//         return this.bluetoothPrintDriver.isSupported   
//     }

//     get isUsbSupported(): boolean {
//         return this.usbPrintDriver.isSupported   
//     }

//     set autoPrintReceipt(value: boolean) {
//         localStorage.setItem(this.AUTO_PRINT_RECEIPT, value ? "1" : "0")
//     }

//     get autoPrintReceipt(): boolean {
//         const value = localStorage.getItem(this.AUTO_PRINT_RECEIPT)
//         if (value == null) {
//             return true
//         } else {
//             return value == "1"
//         }
//     }

//     // connectPrinterDialog() {
//     //     ConnectThermalPrinterDialogComponent.openDialog(this.matDialog, this)
//     // }

//     private endOfPrint() {
//         this.escEncoder.newline()
//         this.escEncoder.newline()
//         this.escEncoder.newline()
//         this.escEncoder.newline()
//         this.escEncoder.cut()
//         this.writeBuffer(this.escEncoder.encode())
//     }

//     // printCheckout(documentId: string, checkhoutDetails: CheckoutDetails) {
//     //     if (this.isConnected.value) {
//     //         this.internalPrintScontrino(documentId, scontrinoDetails)
//     //     } else {
//     //         ConnectThermalPrinterDialogComponent.openDialog(this.matDialog, this).subscribe(result => {
//     //             if (result) {
//     //                 this.internalPrintScontrino(documentId, scontrinoDetails)
//     //             }
//     //         })   
//     //     }
//     // }

//     private async internalPrintCheckout(documentId: string, checkhoutDetails: CheckoutDetails) {
//         this.escEncoder.codepage(this.codepage as any)
//         this.escEncoder.align("left")
//         this.escEncoder.newline()

//         this.escEncoder.bold(true)
//         this.escEncoder.table(
//             this.productsTableFormat,
//             [
//                 ["", "VAT", "EUR"],
//             ]
//         )
//         this.escEncoder.bold(false)
//         this.escEncoder.table(
//             this.productsTableFormat, [[/* your table */]]
//         )

//         this.escEncoder.line(documentId)

//         this.escEncoder.newline()
//         this.escEncoder.line("Thank you, come again!")
//         this.escEncoder.newline()

//         let logo = new Image();
//         logo.src = "assets/logo.svg";
//         logo.onload = () => {
//           let imagePrintingService = new ImagePrintingService(logo, true, 240, 56);
//           this.escEncoder.raw(imagePrintingService.getUint8Array())

//           if(checkoutDetails.referral_link != null) {
//             this.escEncoder.bold(true)        
//             this.escEncoder.line("Download the app!") 
//             this.escEncoder.qrcode(checkoutDetails.referral_link, 1, 8)
//             this.escEncoder.bold(false)
//           }

//           this.escEncoder.align("left")
  
//           this.endOfPrint()
//         }
//     }

//     private writeBuffer(buffer: Uint8Array) {
//         if (this.usbPrintDriver.isConnected.value) {
//             this.usbPrintDriver.write(buffer)
//         } else if (this.bluetoothPrintDriver.isConnected.value) {
//             this.bluetoothPrintDriver.write(buffer)
//         }
//     }
// }
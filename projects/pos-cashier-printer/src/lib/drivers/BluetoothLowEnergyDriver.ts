/// <reference types="web-bluetooth" />

// import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';
import { BehaviorSubject, Observable  } from 'rxjs';
import { PrintDriver } from './PrintDriver';

export class BluetoothLowEnergyDriver extends PrintDriver{
    isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    serviceUUID!: string|number;
    characteristicUUID!: string|number;
    device!: BluetoothDevice;
    characteristic!: BluetoothRemoteGATTCharacteristic;
    private vendorId: number | undefined;
    private productId: number | undefined;
    constructor(vendorId?: number, productId?: number) {
        super();
        this.vendorId = vendorId;
        this.productId = productId;
    }
    private convertStringToUUID(s: string): string|number{
        s = s.toLowerCase();
        if (s.includes('-')){
          return s;
        }else{
          let ss!: any;
          if (s.substring(0, 2).includes('0x')){
            ss = s.substring(2);
          }
          else{
            ss = s;
          }
          return parseInt(ss, 16);
        }
    }
    requestDevice(serviceUUID: string|number, characteristicUUID: string|number): Observable<BluetoothDevice>{
        if (typeof serviceUUID === 'string'){
            serviceUUID = this.convertStringToUUID(serviceUUID);
        }
        if (typeof characteristicUUID === 'string'){
            characteristicUUID = this.convertStringToUUID(characteristicUUID);
        }
        const serviceUUIDs: BluetoothServiceUUID[] = [serviceUUID];
        const opt: RequestDeviceOptions = {optionalServices:  serviceUUIDs, acceptAllDevices: true};
        this.serviceUUID = serviceUUID;
        this.characteristicUUID = characteristicUUID;
        return new Observable(observer => {
            navigator.bluetooth.requestDevice(opt)
                .then((device: BluetoothDevice) => {
                    this.device = device;
                    return observer.next(this.device);
                })
                .catch((error: any) => {
                    return observer.error(error);
                });
        });
    }
    disconnect(): void{
        this.removeBluetoothConnections();
    }
    connect(): void {
        this.device.gatt?.connect()
        .then((server: BluetoothRemoteGATTServer|undefined) => {
            return server!.getPrimaryService(this.serviceUUID);
        })
        .then((service: BluetoothRemoteGATTService) => {
            return service.getCharacteristic(this.characteristicUUID);
        })
        .then((characteristic: BluetoothRemoteGATTCharacteristic) => {
            this.isConnected.next(true);
            this.listenForBluetoothConnections();
            this.characteristic = characteristic;
        });
    }
    write(data: Uint8Array): void {
        const array_chunks = (array: any, chunkSize: number) => {
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
    private listenForBluetoothConnections(): void {
        navigator.bluetooth.addEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.bluetooth.addEventListener('connect', () => {
            this.isConnected.next(true);
        });
    }
    private removeBluetoothConnections(): void{
        navigator.bluetooth.removeEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.bluetooth.removeEventListener('connect', () => {
            this.isConnected.next(false);
        });
    }
}
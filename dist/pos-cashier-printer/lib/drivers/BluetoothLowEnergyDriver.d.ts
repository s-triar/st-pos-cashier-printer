/// <reference types="web-bluetooth" />
import { BehaviorSubject, Observable } from 'rxjs';
import { PrintDriver } from './PrintDriver';
export declare class BluetoothLowEnergyDriver extends PrintDriver {
    isConnected: BehaviorSubject<boolean>;
    serviceUUID: string | number;
    characteristicUUID: string | number;
    device: BluetoothDevice;
    characteristic: BluetoothRemoteGATTCharacteristic;
    private vendorId;
    private productId;
    constructor(vendorId?: number, productId?: number);
    private convertStringToUUID;
    requestDevice(serviceUUID: string | number, characteristicUUID: string | number): Observable<BluetoothDevice>;
    disconnect(): void;
    connect(): void;
    write(data: Uint8Array): void;
    private listenForBluetoothConnections;
    private removeBluetoothConnections;
}

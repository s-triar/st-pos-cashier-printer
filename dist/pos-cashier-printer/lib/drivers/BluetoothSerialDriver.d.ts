/// <reference types="w3c-web-serial" />
import { BehaviorSubject, Observable } from 'rxjs';
import { PrintDriver } from './PrintDriver';
export declare class BluetoothSerialDriver extends PrintDriver {
    isConnected: BehaviorSubject<boolean>;
    port: SerialPort;
    writer: any;
    private vendorId;
    private productId;
    option: SerialOptions;
    constructor(vendorId?: number, productId?: number);
    requestPort(): Observable<SerialPort>;
    setOpenOption(option: SerialOptions): void;
    disconnect(): void;
    connect(): void;
    write(data: Uint8Array): Promise<void>;
    private listenForSerialConnections;
    private removeSerialConnections;
}

/// <reference types="w3c-web-serial" />

import { BehaviorSubject, Observable  } from 'rxjs';
import { PrintDriver } from './PrintDriver';

export class BluetoothSerialDriver extends PrintDriver{
    isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    port!: SerialPort;
    writer!: any;
    private vendorId: number | undefined;
    private productId: number | undefined;
    option: SerialOptions = {
        baudRate: 9600
    };
    constructor(vendorId?: number, productId?: number) {
        super();

        this.vendorId = vendorId;
        this.productId = productId;
    }
    requestPort(): Observable<SerialPort>{
        return new Observable(observer => {
            navigator.serial.requestPort({ filters: [] })
                .then((result: SerialPort) => {
                    this.port = result;
                    return observer.next(result);
                })
                .catch((error: any) => {
                    return observer.error(error);
                });
        });
    }
    setOpenOption(option: SerialOptions): void{
        this.option = {...this.option, ...option};
    }
    disconnect(): void{
        // tslint:disable-next-line:no-non-null-assertion
        this.writer!.releaseLock();
        this.port.close().then(x => this.removeSerialConnections());
    }
    connect(): void {
        navigator.serial.getPorts()
            .then((ports: SerialPort[]) => {
                return ports.find(x => x === this.port);
            })
            .then((p: SerialPort|undefined) => {
                return p?.open(this.option);
            })
            .then(() => {
                this.isConnected.next(true);
                this.listenForSerialConnections();
                this.writer = this.port.writable?.getWriter();
            })
            .catch((err: any) => {
                console.log(err);
                this.isConnected.next(false);
            });
    }
    public async write(data: Uint8Array): Promise<void> {
        // tslint:disable-next-line:no-non-null-assertion
        await this.writer!.write(data);
    }
    private listenForSerialConnections(): void {
        navigator.serial.addEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.serial.addEventListener('connect', () => {
            this.isConnected.next(true);
        });
    }
    private removeSerialConnections(): void{
        navigator.serial.removeEventListener('disconnect', () => {
            this.isConnected.next(false);
        });
        navigator.serial.removeEventListener('connect', () => {
            this.isConnected.next(false);
        });
    }
}
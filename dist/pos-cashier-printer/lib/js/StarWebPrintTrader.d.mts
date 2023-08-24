export class StarWebPrintTrader {
    private constructor();
    _callMessageHandler(): void;
    sendMessage(a: any): void;
    _json: string | undefined;
    _url: string | undefined;
    _onHandlerSuccess(a: any): void;
    _onHandlerError(a: any): void;
    isCoverOpen(a: any): boolean;
    isOffLine(a: any): boolean;
    isCompulsionSwitchClose(a: any): boolean;
    isEtbCommandExecute(a: any): boolean;
    isHighTemperatureStop(a: any): boolean;
    isNonRecoverableError(a: any): boolean;
    isAutoCutterError(a: any): boolean;
    isBlackMarkError(a: any): boolean;
    isPaperEnd(a: any): boolean;
    isPaperNearEnd(a: any): boolean;
    isPaperPresent(a: any): boolean;
    extractionEtbCounter(a: any): number;
    _encodeEscapeSequence(a: any): any;
}

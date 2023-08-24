export abstract class PrintBuilder {
    public abstract init(): any;
    /**
     *
     * @param cutType fill|partial
     */
    public abstract cut(cutType: string): any;
    public abstract flush(): any;
    public abstract feed(lineCount: number): any;
    public abstract setInverse(value: boolean): any;
    public abstract setBold(value: boolean): any;
    /**
     *
     * @param value left\center\right
     */
    public abstract setJustification(value: string): any;
    /**
     *
     * @param value normal\large
     */
    public abstract setSize(value: string): any;
    public abstract setUnderline(value: boolean): any;
    public abstract writeLine(text: string): any;
}


export abstract class Formatter {
    public abstract setValue(val: any): Formatter
    public abstract format(): any
}
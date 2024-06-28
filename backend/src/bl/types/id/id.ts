export class Id {
    private id: string;

    constructor(s: string | number)
    {
        this.id = String(s);
    }

    static isId<T>(obj: T): boolean
    {
        return (
            obj &&
            typeof obj === 'object' &&
            (typeof obj['id'] === 'string' || typeof obj['id'] === 'number')
        );
    }

    isEqual(obj: Id): boolean
    {
        return obj.id == this.id;
    }

    getStringVersion()
    {
       return this.id;
    }
}
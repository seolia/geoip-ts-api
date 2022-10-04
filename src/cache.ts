export class ApiCache<T> {

    private map: Map<string, T> = new Map<string, T>();

    public set = (key: string, val: T) => {
        // if (!this.contains(key)) {
        this.map.set(key, val);
        // }
    }

    public get = (key: string): T | undefined => {
        let entry: any;

        if (this.contains(key)) {
            entry = this.map.get(key);
        }

        return entry;
    }

    public contains = (ip: string): boolean => {
        return this.map.has(ip);
    }

    public size = (): number => {
        return this.map.size;
    }

    public getAll = (): IterableIterator<T> => {
        return this.map.values();
    }

    public flush = () => {
        this.map.clear();
    }
}
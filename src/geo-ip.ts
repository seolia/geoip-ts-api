import * as IpAddress from 'ip-address';

export class geoIP {
    ip: string;
    ipv4!: IpAddress.Address4;
    ipv6!: IpAddress.Address6;
    country_code!: string;
    country_name!: string;
    city!: string;
    latitude!: number;
    longitude!: number;
    origin!: string;
    resolved_at: string;

    constructor(ip: string) {
        this.ip = ip;
        this.resolved_at = new Date().toISOString();

        if (IpAddress.Address4.isValid(ip))
            this.ipv4 = new IpAddress.Address4(ip);
        else if (IpAddress.Address6.isValid(ip))
            this.ipv6 = new IpAddress.Address6(ip);
        else
            throw new Error("Invalid IP address");
    }

    public toString(): string {
        return `${this.ip} ${this.country_code} ${this.country_name} ${this.city} ${this.latitude} ${this.longitude} ${this.origin}`;
    }

    // public toJSON(): string {
    //     return JSON.stringify(this);
    // }

}

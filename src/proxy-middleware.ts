import { geoIP } from "./geo-ip";
import * as dotenv from "dotenv";

enum IpGeoResolver {
    IPStack = 'http://api.ipstack.com/',
    IPAPI = "http://ip-api.com/json/"
};

class IpGeoAPI {
    url: IpGeoResolver;
    apiKey: string;
    counter: number;
    limit: number;

    constructor(resolver: IpGeoResolver, apiKey: string, limit: number) {
        this.url = resolver;
        this.apiKey = apiKey;
        this.limit = limit;
        this.counter = 0;
    }
}

export default class ProxyMiddleWare {

    apis: IpGeoAPI[];
    constructor() {
        dotenv.config();
        this.apis = [new IpGeoAPI(IpGeoResolver.IPStack, process.env.IPStack_key as string, parseInt(process.env.IPStack_limit as string)),
        new IpGeoAPI(IpGeoResolver.IPAPI, "", parseInt(process.env.IPAPI_limit as string))];
        console.debug('ProxyMiddleWare:', this.apis);
    }

    async resolveIP(ip: string): Promise<geoIP> {
        let result: geoIP = new geoIP(ip);

        // get least-used API per its usage limit
        let api = this.apis.reduce((prev, curr) => (prev.limit - prev.counter) > (curr.limit - curr.counter) ? prev : curr);

        if (api?.counter <= api?.limit) {
            api.counter++;
            result.origin = api.url;
            var url = api.url + ip;
            if (api.url == IpGeoResolver.IPStack) {
                url += "?access_key=" + api.apiKey;
            }
            console.debug(`Fetching: ${url} API count: ${api.counter}`);
            // TODO: try/catch fetch
            let resp = await fetch(url);
            let data = await resp.json();
            if (data) {
                console.debug('json:', data);
                result.country_code = data.countryCode ?? data.country_code;
                result.country_name = data.country ?? data.country_name;
                result.latitude = data.lat ?? data.latitude;
                result.longitude = data.lon ?? data.longitude;
                result.city = data.city;
                console.debug('GeoIP:', result);
                Promise.resolve(result);
            }
            return result;

        } else {
            console.error('No API available:' + this.apis);
            return Promise.reject(new Error('No API available: quota exceeded'));
        }
    }

}


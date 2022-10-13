import { Request, Response, NextFunction } from 'express';
import ProxyMiddleWare, { IpGeoAPI } from './proxy-middleware';
import { ApiCache } from "./cache";
import { geoIP } from "./geo-ip";

const ipCache = new ApiCache<geoIP>();
const proxy: ProxyMiddleWare = new ProxyMiddleWare();

const getGeoIP = async (req: Request, res: Response, next: NextFunction) => {
    const ip: string = req.params.ip;
    let geoIP;
    if (ipCache.contains(ip))
        geoIP = ipCache.get(ip);
    else {
        try {
            geoIP = await proxy.resolveIP(ip);
            ipCache.set(ip, geoIP);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    return res.status(200).json({ geoIP });
};

const cache = async (req: Request, res: Response, next: NextFunction) => {
    if (ipCache?.size() > 0) {
        let values: geoIP[] = [];
        for (const value of ipCache.getAll())
            values.push(value);
        return res.status(200).json({ values });
    }
    else
        return res.status(404).json({ message: "Cache is empty" });
};


const resetCache = async (req: Request, res: Response, next: NextFunction) => {
    if (ipCache?.size() > 0) {
        ipCache.flush();
        return res.status(200).json({ message: "Cache is empty" });
    }
    else
        return res.status(404).json({ message: "Cache is empty" });
};

const resetAPIs = async () => {
    proxy.getApiVendors().forEach(api => api.counter = 0);
};

export default { getGeoIP, cache, resetCache, resetAPIs };
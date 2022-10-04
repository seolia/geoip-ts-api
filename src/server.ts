import express, { Request, Response, NextFunction, Application }  from "express";
import {Express} from 'express-serve-static-core'
import * as dotenv from "dotenv";
import router from './routes';
import morgan from 'morgan';
import http from 'http';

var server: http.Server;

export async function createServer(): Promise<Express> {
    dotenv.config();
    const app = express();
    const PORT: number = parseInt(process.env.PORT as string);

    app.use(express.json());

    // logging
    app.use(morgan('dev'));

    // generic error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err.message, err);
        const status = err.statusCode || err.status || 500;
        return res.status(status).json({ error: err.message });
    });

    server = app.listen(PORT, () => {
        console.log(`GEOIP app listening on port ${PORT}`);
    });

    app.use('/', router);
    return app;
}

export function shutdownServer(): void {
    server.close();
}
import request from "supertest";
import { Express } from 'express-serve-static-core'
import { createServer, shutdownServer } from "./server";

let server: Express

beforeAll(async() => {
    server = await createServer()
})

describe('GET /geoip', () => {

    it('jest works', () => {
        expect(1).toBe(1)
    })

    it('should return 200 & Australia', async () => {
        await request(server)
            .get('/geoIP/1.2.3.4')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.geoIP.country_name).toBe('Australia')
            })
    })
    
    it('should return 400 & invalid IP', async () => {
        await request(server)
            .get('/geoIP/1.2.3.4.5')
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
                expect(res.body.error).toBe("Invalid IP address")
            })
    })

    it('should return 500 & quota-reached', async () => {
        await request(server)
            .get('/geoIP/4.5.6.7')
            .expect('Content-Type', /json/)
            .expect(500)
            .then((res) => {
                expect(res.body.error).toBe('No API available: quota exceeded')
            })
    })
})

// closing the server
afterAll(async () => {
    await shutdownServer();
});
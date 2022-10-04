# geoip-ts-api


This is a simple typescript API to resolve IP addresses to countries.

It is built using express — https://ipstack.com/ and http://ip-api.com as the targets of queries.
  

## Usage

Please provide a .env file with the following content:
  
```yaml

IPStack_key=
IPStack_limit=100
IPAPI_limit=100
PORT=7654

```

Then run:

```bash
npm install

npm run start
```

http://localhost:7654/geoIP/1.2.3.4
	
http://localhost:7654/geoIP/4.5.6.7
	
http://localhost:7654/show-cache


## Debug
  
```bash
npm run dev
```

  
## Run Tests

```bash
npm run test
```
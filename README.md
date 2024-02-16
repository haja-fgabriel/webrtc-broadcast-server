# webrtc-smart-signaling
Signaling server made for broadcasting. It is the implementation of my B.Sc. thesis idea.

Linted with ESLint (with standard JS guidelines), transpiled with Babel, tested with Mocha and using Backpack as the build system (supports recompilation at saving).

## Prerequisites
1. Node.js version 14.16.1 (older versions may work too) - make sure you have npm installed

## Installation
1. Clone (or download) the repo wherever you want on your computer
2. ``npm install`` from the root folder of the cloned repo
3. Provide the SSL certificate for making HTTPS work properly, as following:
- ``cert.pem`` - the certificate
- ``chain.pem`` - the intermediate signing authority
- ``privkey.pem`` - the private key
## Usage
- ``npm build`` - compiles the server to old-school JS
- ``npm start`` - starts the server normally (on port 8000). The port can be modified using the PORT environment variable
- ``npm run start-local`` - starts the server as an HTTP server (for local testing of the app)
- ``npm test`` - runs all the tests
- ``npm run coverage`` - runs all the tests and get a coverage log 

## Run with Docker
1. Clone the repo
2. Set up the external URL to the WebSocket server. It should use this pattern:

```
https://<domain-name>/wsapp
```
Please ensure that you provide it under a `SERVER_URL` variable in the `client/.env` file.

3. `docker-compose build --no-cache`. The `--no-cache` argument enforces running all steps, including cloning this repo: https://github.com/haja-fgabriel/webrtc-broadcast-client (TODO add the [frontend]( https://github.com/haja-fgabriel/webrtc-broadcast-client) as a submodule) 

In this step, the JS files are compiled to singular source files.

4. Bring an SSL certificate and put it into a new `certs/` folder. The full-chain certificate should be named `fullchain1.pem` and the private key should be `privkey1.pem`.

You can generate one using Let's Encrypt (certbot). Provide your e-mail address and the domain name.
You can generate a domain name for free using freemyip.com

5. `docker-compose up` - starts all the containers

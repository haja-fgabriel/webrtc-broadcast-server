# webrtc-smart-signaling
Signaling server made for broadcasting. It is the implementation of my B.Sc. thesis idea.

Linted with ESLint (with standard JS guidelines), transpiled with Babel, tested with Mocha and using Backpack as the build system (supports recompilation at saving).

## Prerequisites
1. Node.js version 14.16.1 (older versions may work too) - make sure you have npm installed

## Installation
1. Clone (or download) the repo wherever you want on your computer
2. ``npm install`` from the root folder of the cloned repo
3. Provide the SSL certificates for making HTTPS work properly, as following:
-- ``cert.pem`` - the certificate
-- ``chain.pem`` - the intermediate signing authority
-- ``privkey.pem`` - the private key
## Usage
- ``npm build`` - compiles the server to old-school JS
- ``npm start`` - starts the server normally (on port 8000). The port can be modified using the PORT environment variable
- ``npm run start-local`` - starts the server as an HTTP server (for local testing of the app)
- ``npm test`` - runs all the tests
- ``npm run coverage`` - runs all the tests and get a coverage log 

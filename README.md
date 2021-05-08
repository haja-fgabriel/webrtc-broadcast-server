# webrtc-smart-signaling
Signaling server made for broadcasting. It is the implementation of my B.Sc. thesis idea.
Linted with ESLint (with standard JS guidelines), transpiled with Babel, tested with Mocha and using Backpack as the build system (supports recompilation at saving).

## Prerequisites
1. Node.js version 14.16.1 (older versions may work too) - make sure you have npm installed

## Installation
1. Clone (or download) the repo wherever you want on your computer
2. ``npm install`` from the root folder of the cloned repo

## Usage
- ``npm start`` - starts the server normally (on port 8000). An environment variable will be used in a future commit.
- ``npm test`` - runs all the tests
- ``npm run coverage`` - runs all the tests and get a coverage log 

FROM node:16.15.0-slim

COPY . /root/app

WORKDIR /root/app

RUN npm install
RUN npm run build
CMD node build/main.js
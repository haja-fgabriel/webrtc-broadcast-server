FROM node:16.15.0-slim

RUN apt update && \
    apt install -y git vim

RUN mkdir -p /root/app && \
    cd /root/app && \
    git clone https://github.com/haja-fgabriel/webrtc-broadcast-client.git


WORKDIR /root/app/webrtc-broadcast-client

COPY ./.env ./.env

RUN npm install 
RUN npm run build


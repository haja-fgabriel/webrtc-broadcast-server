import { Socket } from "socket.io-client";
import { RTCService } from "../services/RTCService";
import { Observer, uuidv4 } from "../utils";

export class WebSocketWorker extends Observer {
    /**
     * @param {RTCService} rtcService 
     * @param {Socket} wsClient 
     */
    constructor(uuid, rtcService, wsClient) {
        super(uuid);
        this.rtcService = rtcService;
        this.wsClient = wsClient;
        this.inRoom = undefined;
        this.initialize();
    }

    /**
     * Initializes the event handlers and adds it to the service's 
     * observable list.
     */
    initialize() {
        this.rtcService.addObserver(this.uuid, this);

        // redeclaring variable for ensuring visibility from the event handler
        let wsClient = this.wsClient;
        let service = this.rtcService;
        let uuid = this.uuid;

        // Event handlers that link this worker to the service
        this.wsClient.on('[request]rtc:room:join', function(roomName) {
            if (this.inRoom) {
                wsClient.emit('[error]rtc:room:already-connected');
                return;
            }

            service.addClient(roomName, uuid);
            this.inRoom = roomName;
        });
        
        this.wsClient.on('[webrtc]send-offer', function(to, sdp) {
            service.notify(to, '[webrtc]send-offer', uuid, sdp);
        });

        this.wsClient.on('[webrtc]answer-offer', function(to, sdp) {
            service.notify(to, '[webrtc]answer-offer', uuid, sdp);
        });

        this.wsClient.on('[webrtc]ice-candidate', function(to, iceCandidates) {
            service.notify(to, '[webrtc]ice-candidate', iceCandidates);
        });
    }

    /**
     * Notifies the connected client an emitted message containing arguments.
     * @param {string} message 
     * @param  {...any} args 
     */
    notify(message, ...args) {
        this.wsClient.emit(message, ...args);
    }

    /**
     * Uninitializes the connection of the client to the service.
     */
    close() {
        this.wsClient.removeAllListeners();
        this.rtcService.removeObserver(this.uuid);
    }
}
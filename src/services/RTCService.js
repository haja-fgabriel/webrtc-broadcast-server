import { RTCClientNode, RTCRoom } from "../models";
import { RTCRoomInMemoryRepository } from "../repositories";
import { Observable } from "../utils";

/**
 * Service that handles the business logic of connecting clients and
 * handling call rooms.
 */
export class RTCService extends Observable {
    /**
     * @param {RTCRoomInMemoryRepository} roomRepository 
     */
    constructor(roomRepository) {
        super();
        this.roomRepository = roomRepository;
    }

    /**
     * Adds a client to a given room.
     * @param {string} roomName 
     * @param {*} client 
     */
    addClient(roomName, client) {
        var room = this.roomRepository.get(roomName);
        
        if (this._observers.get(client) === undefined) {
            throw new Error(`Please add the client with ID ${client} to the`
             + ' observers list.');
        }

        if (room === undefined) {
            room = new RTCRoom(roomName);
            this.roomRepository.add(room);            
        } 
        
        if (room.broadcasterID) {
            // adding a viewer
            room.addClient(client);
            super.notify(client, '[response]rtc:joining-as-viewer', undefined);
            let parent = room.getParentForClient(client);
            if (parent) {
                // TODO maybe add more args
                super.notify(parent, '[webrtc]make-offer', client);
            }
        } else {
            room.addClient(client);

            // TODO add parameters too
            super.notify(
                client, '[response]rtc:joining-as-broadcaster', undefined);
        }
        
        // TODO notify observer
    }

    /**
     * Returns a list of clients for the given room.
     * @returns {RTCClientNode[]}
     */
    getClientsForRoom(roomName) {
        var room = this.roomRepository.get(roomName);
        return Array.from(room.clients.values());
    }

    /**
     * Removes a client from the room.
     * @param {string} roomName 
     * @param {string} client 
     */
    removeClient(roomName, client) {
        // TODO notify client for disconnection
    }
}



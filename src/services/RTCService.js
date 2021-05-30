import { RTCRoom } from '../models'
import { Observable } from '../utils'

/**
 * Service that handles the business logic of connecting clients and
 * handling call rooms.
 */
export class RTCService extends Observable {
  /**
     * @param {RTCRoomInMemoryRepository} roomRepository
     */
  constructor (roomRepository) {
    super()
    this.roomRepository = roomRepository
  }

  /**
     * Adds a client to a given room.
     * @param {string} roomName
     * @param {*} client
     * @returns {Promise<void | Error>}
     */
  async joinRoom (roomName, client) {
    let room = this.roomRepository.get(roomName)

    if (this._observers.get(client) === undefined) {
      return Promise.reject(
        new Error(`Please add the client with ID  ${client} to the` +
                    ' observers list.'))
    }

    if (room === undefined) {
      room = new RTCRoom(roomName)
      this.roomRepository.add(room)
    }

    if (room.broadcasterID) {
      // adding a viewer
      room.addClient(client)
      super.notify(client, '[response]rtc:joining-as-viewer', undefined)
      const parent = room.getParentForClient(client)
      if (parent) {
        // TODO maybe add more args
        console.log('send make-offer to parent')
        super.notify(parent, '[webrtc]make-offer', client)
      }
    } else {
      room.addClient(client)

      // TODO add parameters too
      super.notify(
        client, '[response]rtc:joining-as-broadcaster', undefined)
    }

    // TODO notify observer
    return Promise.resolve()
  }

  /**
     * Returns a list of clients for the given room.
     * @returns {RTCClientNode[]}
     */
  getClientsForRoom (roomName) {
    const room = this.roomRepository.get(roomName)
    return Array.from(room.clients.values())
  }

  /**
     * Removes a client from the room.
     * @param {string} roomName
     * @param {string} client
     */
  removeClient (roomName, client) {
    // TODO notify client for disconnection
  }
}

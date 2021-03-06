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
  async joinRoom (roomName, client, connectionProps) {
    let room = this.roomRepository.get(roomName)

    if (this._observers.get(client) === undefined) {
      return Promise.reject(
        new Error(`Please add the client with ID  ${client} to the` +
                    ' observers list.'))
    }

    if (room === undefined) {
      room = new RTCRoom(roomName)
      this.roomRepository.set(room)
    }

    if (room.broadcasterID) {
      // adding a viewer
      room.addClient(client, connectionProps)
      super.notify(client, '[response]rtc:joining-as-viewer', undefined)
      const parent = room.getParentForClient(client)
      const sons = room.getSonsForClient(client)
      console.log(sons)
      if (parent) {
        // TODO maybe add more args
        console.log('send make-offer to parent ' + parent)
        console.log('send remove-peer for sons ' + sons)
        if (sons || sons.length) {
          sons.forEach(son => super.notify(parent, '[webrtc]remove-peer', son))
        }
        super.notify(parent, '[webrtc]make-offer', client)
      }
    } else {
      room.addClient(client, connectionProps)

      // TODO add parameters too
      super.notify(
        client, '[response]rtc:joining-as-broadcaster', undefined)
    }

    // TODO notify observer
    return Promise.resolve()
  }

  /**
   * Makes offer for new sons.
   * @param {string} client
   */
  makeOfferForNewSons (client, roomName) {
    console.log(`client ${client} requesting make-offer for all new sons`)
    const room = this.roomRepository.get(roomName)
    const sons = room.getSonsForClient(client)
    if (sons) {
      sons.forEach(son => super.notify(client, '[webrtc]make-offer', son))
    }
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
  leaveRoom (roomName, client) {
    // TODO notify client for disconnection
    const room = this.roomRepository.get(roomName)
    if (!room) {
      return
    }
    const sons = room.getSonsForClient(client)
    const parent = room.getParentForClient(client)
    if (room.broadcasterID === client) {
      console.log('The boss is leaving')
      room.clients.forEach((node, uuid) => super.notify(uuid, '[webrtc]party-over'))
      this.roomRepository.delete(roomName)
      return
    }
    if (sons) {
      sons.forEach(son => super.notify(client, '[webrtc]remove-peer', son))
    }
    if (parent) {
      console.log(`notifying ${parent} to remove ${client}`)
      super.notify(parent, '[webrtc]remove-peer', client)
      console.log(`notifying ${parent} to make offer for ${JSON.stringify(sons)}`)
      if (sons) {
        sons.forEach(son => super.notify(parent, '[webrtc]make-offer', son))
      }
    }
    room.removeClient(client)
  }
}

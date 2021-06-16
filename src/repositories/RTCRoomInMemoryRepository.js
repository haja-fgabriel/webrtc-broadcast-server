/* eslint-disable no-unused-vars */
import { RTCRoom } from '../models'

/**
 * Repository for room instances.
 */
export function RTCRoomInMemoryRepository () {
  this.rooms = new Map()

  /**
     * Add a room to the repository.
     * @param {RTCRoom} room
     */
  this.set = function (room) {
    this.rooms.set(room.name, room)
  }

  /**
     * Get a room.
     * @param {string} roomName
     * @returns {RTCRoom}
     */
  this.get = function (roomName) {
    return this.rooms.get(roomName)
  }

  /**
   * Deletes a room.
   * @param {string} roomName
   */
  this.delete = function (roomName) {
    this.rooms.delete(roomName)
  }
}

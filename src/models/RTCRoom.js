import { RTCClientNode } from '.'
import { RTCClientTopologyFactory } from '../factories'

const detectMocha = require('detect-mocha')

/**
 * A model of a broadcasting room, including the connected clients in their
 * topology.
 * @param {string} name
 */
export default function RTCRoom (name) {
  this.name = name
  // TODO complete implemenation of object
  this.topologyType = (!detectMocha() && process.env.CLIENT_TOPOLOGY) || 'tree'
  this.factory = new RTCClientTopologyFactory()
  this.broadcasterID = undefined
  this.topology = this.factory.create(this.topologyType)
  this.clients = new Map()
}

/**
 * Adds a new client to the room.
 * @param {string} clientID
 * @param {*} props
 */
RTCRoom.prototype.addClient = function (clientID, props) {
  const node = new RTCClientNode(clientID, null, props)
  if (this.clients.size === 0) {
    this.broadcasterID = clientID
  }
  this.topology.add(node, props)
  this.clients.set(clientID, node)
}

/**
 * Returns the properties of the given client.
 * @param {string} clientID
 * @returns {}
 */
RTCRoom.prototype.getPropsForClient = function (clientID) {
  const node = this.clients.get(clientID)
  return node.props
}

/**
 * Returns the ID for the client's parent.
 * @param {string} clientID
 * @returns {string | undefined}
 */
RTCRoom.prototype.getParentForClient = function (clientID) {
  const node = this.clients.get(clientID)
  if (node && node.parent) {
    return node.parent.key
  }
  return undefined
}

/**
 * Returns the list of client IDs of the connected sons.
 * @param {string} clientID - the client ID
 * @returns {string[] | undefined} - undefined when the given client is missing
 */
RTCRoom.prototype.getSonsForClient = function (clientID) {
  const node = this.clients.get(clientID)
  if (node) {
    return node.sons.map(son => son.key)
  }
  return undefined
}

/**
 * Removes a client from the room
 * @param {string} clientID
 */
RTCRoom.prototype.removeClient = function (clientID) {
  this.topology.remove(clientID)
  this.clients.delete(clientID)
}
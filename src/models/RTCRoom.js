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
RTCRoom.prototype.addClient = function (clientID, props = null) {
  const node = new RTCClientNode(clientID, props)
  if (this.clients.size === 0) {
    this.broadcasterID = clientID
  }
  this.topology.add(node)
  this.clients.set(clientID, node)
}

/**
 * Returns the properties of the given client.
 * @param {string} clientID
 * @returns {}
 */
RTCRoom.prototype.getPropsForClient = function (clientID) {
  const node = this.clients.get(clientID)
  return node.value
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

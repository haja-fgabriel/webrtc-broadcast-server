import { RTCClientNode } from './RTCClientNode'

/**
 * A structure representing the linked list topology of all the connected
 * clients to a room.
 * @export
 */
export class RTCClientLinkedList {
  constructor () {
    this.root = null
    this.size = 0
  }

  /**
   * Adds a node to the tree.
   * @param {RTCClientNode} node
   */
  add (node) {
    this.size++
    if (this.root === null) {
      this.root = node
      return
    }
    let currentNode = this.root
    // mock tree taller than 2 nodes
    while (currentNode && currentNode.sons.length &&
        currentNode.sons.length >= 1) {
      currentNode = currentNode.sons[0]
    }
    currentNode.sons.push(node)
    node.parent = currentNode
  }
}
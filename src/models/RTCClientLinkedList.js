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
    console.log(node.props)
    if (!node.props || node.props.downloadSpeed === undefined) {
      throw new Error('Node is missing the connection properties!')
    }
    function isWorse (node, current) {
      return node.props.downloadSpeed <= current.props.downloadSpeed
    }
    this.size++
    if (this.root === null) {
      this.root = node
      return
    }
    let currentNode = this.root
    // mock tree taller than 2 nodes
    while (currentNode && currentNode.sons.length &&
      isWorse(node, currentNode.sons[0]) && currentNode.sons.length >= 1) {
      currentNode = currentNode.sons[0]
    }
    for (let i = 0; i < currentNode.sons.length; i++) {
      currentNode.sons[i].parent = node
    }
    node.sons = currentNode.sons
    currentNode.sons = [node]
    node.parent = currentNode
  }
}

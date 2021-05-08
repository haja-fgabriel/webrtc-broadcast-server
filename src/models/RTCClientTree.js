/* eslint-disable no-unused-vars */
import RTCClientNode from './RTCClientNode'

/**
 * A structure for representing the tree topology for all the connected
 * clients to a room.
 * @export
 */
export default class RTCClientTree {
  constructor () {
    // TODO complete implemenation of tree
    this.root = null
    this.size = 0
  }

  /**
    * Appends a node to the tree.
    * @param {RTCClientNode} node
    * @returns
    */
  add (node) {
    // TODO logic for checking optimality of adding new son on top ot
    // TODO maybe combining heaps with maximum flow in a graph?

    this.size++
    if (this.root === null) {
      this.root = node
      return
    }
    let currentNode = this.root
    // mock tree taller than 2 nodes
    while (currentNode && currentNode.sons.length &&
        currentNode.sons.length >= 2) {
      currentNode = currentNode.sons[0]
    }
    currentNode.sons.push(node)
    node.parent = currentNode
  }

  remove () {

  }

  search () {

  }

  update () {

  }
}

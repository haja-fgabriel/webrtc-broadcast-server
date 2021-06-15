/**
 * A node in the tree used for the used networking topology.
 * @const @param {*} key
 * @param {*} value
 * @param {ClientConnectionProps} props
 * @param {RTCClientNode} parent
 * @param {RTCClientNode[]} sons
 */
export default function RTCClientNode (key, value, props = null, parent = null, sons = []) {
  this.key = key
  this.value = value
  this.props = props
  this.parent = parent
  this.sons = sons
}

/**
 * Adds a RTCClientNode instance as the son of this node.
 * @param {RTCClientNode} son
 */
RTCClientNode.prototype.addSon = function (son) {
  this.sons.push(son)
}

import { RTCClientTree } from '../models'
import { RTCClientLinkedList } from '../models/RTCClientLinkedList'

/**
 * Factory class for creating various data structures according to the
 * desired topology.
 */
export class RTCClientTopologyFactory {
  create (topology) {
    switch (topology) {
      case 'tree': return new RTCClientTree()
      case 'list':
      case 'chain': return new RTCClientLinkedList()
      default: return undefined
    }
  }
}

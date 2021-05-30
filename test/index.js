/* eslint-env mocha */
import { RTCClientNode, RTCClientTree, RTCRoom } from '../src/models'
import assert from 'assert'
import { RTCRoomInMemoryRepository } from '../src/repositories'
import { RTCService } from '../src/services/RTCService'
import { WebSocketServer } from '../src/ws/WebSocketServer'
import openSocket from 'socket.io-client'
import { Observer } from '../src/utils'

describe('RTCClientNode', function () {
  let node

  before(function () {
    node = new RTCClientNode(1, 1)
  })

  it('initiation', function () {
    assert(node.key === 1)
    assert(node.value === 1)
    assert(node.sons.length === 0)
  })

  it('add two sons', function () {
    const newSon = new RTCClientNode(0, 123)
    node.sons.push(newSon)
    assert(newSon.key === 0)
    assert(newSon.value === 123)
    assert(newSon.sons.length === 0)

    const otherNewSon = new RTCClientNode(2, 125)
    node.sons.push(otherNewSon)
    assert(otherNewSon.key === 2)
    assert(otherNewSon.value === 125)
    assert(otherNewSon.sons.length === 0)

    assert(node.sons.length === 2)
  })
})

// TODO rewrite tests for actual tree implementation
describe('RTCClientTree', function () {
  let tree

  before(function () {
    tree = new RTCClientTree()
  })

  it('initiation', function () {
    assert(tree.root === null)
    assert(tree.size === 0)
  })

  it('add root', function () {
    tree.add(new RTCClientNode(1, 1))
  })

  it('add two sons', function () {
    assert(tree.root !== null)
    const son = new RTCClientNode(22, 2)
    const otherSon = new RTCClientNode(32, 5)
    tree.add(son)
    tree.add(otherSon)
    assert(tree.size === 3)
    assert(son.parent === tree.root)
    assert(otherSon.parent === tree.root)
    assert(tree.root.sons.length === 2)
    assert(tree.root.sons[0] === son)
    assert(tree.root.sons[1] === otherSon)
  })

  it('add more sons', function () {
    assert(tree.root !== null)
    const sons = []
    for (let i = 0; i < 3; i++) {
      const son = new RTCClientNode()
      sons.push(son)
      tree.add(son)
      if (i === 2) {
        assert(tree.size === 6)
        assert(tree.root.sons.length === 2)
        assert(tree.root.sons[0].sons.length === 2)
        assert(tree.root.sons[0].sons[0].sons.length === 1)
      }
    }
  })
})

describe('RTCRoom', function () {
  let room
  beforeEach(function () {
    room = new RTCRoom('default-room')
  })

  it('add one client', function () {
    room.addClient('123445', { k: 8 })
    const props = room.getPropsForClient('123445')
    assert(room.broadcasterID === '123445')
    assert(props)
    assert(props.k === 8)
  })

  // TODO rewrite tests for getParent as soon as you reimplement the tree
  it('getParent with 1 client', function () {
    room.addClient('123445', { k: 8 })
    const parent = room.getParentForClient('123445')
    assert(parent === undefined)
  })

  it('getParent with 3 clients', function () {
    for (let i = 1; i <= 3; i++) {
      room.addClient('client' + i)
    }
    assert(room.getParentForClient('client2') === 'client1')
    assert(room.getParentForClient('client3') === 'client1')
  })

  it('getParent with 7 clients', function () {
    for (let i = 1; i <= 7; i++) {
      room.addClient('client' + i)
    }
    assert(room.getParentForClient('client2') === 'client1')
    assert(room.getParentForClient('client3') === 'client1')
    assert(room.getParentForClient('client4') === 'client2')
  })
})

describe('RTCRoomInMemoryRepository', function () {
  let repository

  beforeEach(function () {
    repository = new RTCRoomInMemoryRepository()
  })

  it('add 1 room', function () {
    repository.add(new RTCRoom('default-room'))
    assert(repository.get('default-room'))
  })
})

describe('RTCService', function () {
  let repository
  let service

  before(function () {
    repository = new RTCRoomInMemoryRepository()
    service = new RTCService(repository)
  })

  it('add client with no observer', function (done) {
    try {
      service.joinRoom('default-room', '12222')
      assert(false)
    } catch (e) {
      done()
    }
  })

  it('add default observer', function (done) {
    try {
      service.addObserver('aaaaa', new Observer('aaaaa'))
      assert(false)
    } catch (e) {
      done()
    }
  })

  it('add client', function (done) {
    service.addObserver('12333', mockObserver(done))
    service.joinRoom('default-room', '12333')
    assert(service.getClientsForRoom('default-room').length === 1)
  })

  // TODO add tests for client removal
  // it('remove client', function(done) {
  //     service.addObserver('giorno', mockObserver(() => {}));
  //     service.joinRoom('default-room', 'giorno');

  //     service.removeObserver('giorno');
  //     try {
  //         service.joinRoom('default-room', 'giorno');
  //         assert(false);
  //     } catch(e) {
  //         done();
  //     }
  // });

  function mockObserver (done) {
    return new class extends Observer {
      notify (message, content) {
        assert(message === '[response]rtc:joining-as-broadcaster')
        done()
      }
    }()
  }
})

describe('RTC WebSockets', function () {
  let repository
  let service
  let server
  let clients = []

  before(function () {
    repository = new RTCRoomInMemoryRepository()
    service = new RTCService(repository)
    server = new WebSocketServer(8001, service)
    server.start()
  })

  after(function () {
    server.close()
    // console.log(server.workers.size);
    assert(service._observers.size === 0)
    assert(server.workers.size === 0)
    assert(clients.length === 0)
  })

  describe('With 5 clients', function () {
    before(function (done) {
      let isDoneHit = false
      for (let i = 0; i < 5; i++) {
        const sock = openSocket('http://localhost:8001')
        sock.on('connection_error', (err) => {
          console.log(`not working: ${err.message}`)
        })
        sock.on('connect', function () {
          clients.push(sock)
          if (clients.length === 5) {
            if (!isDoneHit) {
              isDoneHit = true
              done()
            }
          }
        })
      }
    })

    it('connection', function () {
      for (let i = 0; i < 5; i++) {
        assert(clients[i].id !== '')
      }
      assert(service._observers.size === 5)
      assert(server.workers.size === 5)
      assert(clients.length === 5)
    })

    it('connect 2 clients', function (done) {
      twoClientsCommunication('first-room', clients[0], clients[1], done)
    })

    it('connect 2 other clients',
      function (done) {
        twoClientsCommunication(
          'second-room', clients[2], clients[3], done)
      })

    it('try to connect to another room 1 already connected client',
      function (done) {
        tryConnectingAgain('third-room', clients[2], done)
      })

    it('try to connect to the same room 1 already connected client',
      function (done) {
        tryConnectingAgain('second-room', clients[2], done)
      })

    it('connect 3rd client',
      function (done) {
        connectClientToAlreadyConnectedParent(
          'first-room', clients[0], clients[4], done)
      })

    function tryConnectingAgain (room, client, done) {
      client.emit('[request]rtc:room:join', room)
      client.removeAllListeners()
      client.on('[response]rtc:joining-as-broadcaster',
        () => assert(false))
      client.on('[response]rtc:joining-as-viewer', () => assert(false))
      client.on('[error]rtc:room:already-connected', function () {
        done()
      })
    }

    function connectClientToAlreadyConnectedParent (
      room, first, second, done) {
      first.removeAllListeners()
      second.removeAllListeners()
      second.emit('[request]rtc:room:join', room)
      second.on('[response]rtc:joining-as-broadcaster',
        () => assert(false))
      second.on('[response]rtc:joining-as-viewer', function () {
        const roomInstance = repository.get(room)
        assert(roomInstance.topology.root.sons[0].parent ===
                    roomInstance.topology.root)
        first.on('[webrtc]make-offer', function (to) {
          first.emit('[webrtc]send-offer', to, '12312421312')
          second.on('[webrtc]send-offer', function (from, _sdp) {
            second.emit('[webrtc]answer-offer', from, '3231222')
            first.on('[webrtc]answer-offer',
              function (from, localMockSdp) {
                first.emit(
                  '[webrtc]ice-candidate', from, '123')
                second.on('[webrtc]ice-candidate',
                  function (ice) {
                    done()
                  })
              })
          })
        })
      })
    }

    function twoClientsCommunication (room, first, second, done) {
      first.removeAllListeners()
      second.removeAllListeners()
      first.emit('[request]rtc:room:join', room)
      first.on('[response]rtc:joining-as-broadcaster', function () {
        connectClientToAlreadyConnectedParent(
          room, first, second, done)
      })
    }

    after(function (done) {
      let connected = 5
      for (let i = 0; i < 5; i++) {
        const sock = clients[i]
        sock.on('disconnect', function () {
          connected--
          if (connected === 0) {
            clients = []
            done()
          }
        })
        assert(sock === clients[i])
        sock.close()
      }
    })
  })
})

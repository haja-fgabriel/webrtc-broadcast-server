/* eslint-disable no-unused-vars */
import { Socket } from 'socket.io-client'
import { RTCService } from '../services/RTCService'
import { Observer } from '../utils'

/**
 * A class that wraps the signals receipt from each client. It can receive
 * notifications from an Observable object (RTCService in this case)
 */
export class WebSocketWorker extends Observer {
  /**
   * @param {RTCService} rtcService
   * @param {Socket} wsClient
   */
  constructor (uuid, rtcService, wsClient) {
    super(uuid)
    this.rtcService = rtcService
    this.wsClient = wsClient
    this.inRoom = undefined
    this.initialize()
  }

  /**
   * Initializes the event handlers and adds it to the service's
   * observable list.
   */
  initialize () {
    this.rtcService.addObserver(this.uuid, this)

    // redeclaring variable for ensuring visibility from the event handler
    const wsClient = this.wsClient
    const service = this.rtcService
    const uuid = this.uuid

    const self = this

    // Event handlers that link this worker to the service
    this.wsClient.on('[request]rtc:room:join', function (roomName, connProps) {
      console.log(`client ${uuid} requesting to join room '${roomName}' with connection props ${JSON.stringify(connProps)}`)
      if (self.inRoom) {
        wsClient.emit('[error]rtc:room:already-connected', this.inRoom)
        return
      }
      service.joinRoom(roomName, uuid, connProps)
        .then(() => { self.inRoom = roomName })
        .catch((e) => {
          console.log(`Error for client ${uuid}: ${e}\n${e.stack}`)
          wsClient && wsClient.emit('[error]rtc:room', e)
        })
    })

    this.wsClient.on('[request]rtc:room:leave', function () {
      console.log(`client ${uuid} requesting to leave room '${this.inRoom}'`)
      if (!this.inRoom) {
        wsClient.emit('[error]rtc:room:not-connected')
        return
      }
      service.leaveRoom(this.inRoom, uuid)
      this.inRoom = undefined
    })

    // TODO add handler for removing client

    this.wsClient.on('[webrtc]offer-new-sons', function () {
      service.makeOfferForNewSons(uuid, self.inRoom)
    })

    this.wsClient.on('[webrtc]send-offer', function (to, sdp) {
      service.notify(to, '[webrtc]send-offer', uuid, sdp)
    })

    this.wsClient.on('[webrtc]answer-offer', function (to, sdp) {
      service.notify(to, '[webrtc]answer-offer', uuid, sdp)
    })

    this.wsClient.on('[webrtc]ice-candidate', function (to, iceCandidates) {
      service.notify(to, '[webrtc]ice-candidate', uuid, iceCandidates)
    })
  }

  /**
   * Notifies the connected client an emitted message containing arguments.
   * @param {string} message
   * @param {...any} args
   */
  notify (message, ...args) {
    this.wsClient.emit(message, ...args)
  }

  /**
   * Uninitializes the connection of the client to the service.
   */
  close () {
    console.log(`closing WebSocketWorker instance of ${this.uuid}`)
    if (this.inRoom) {
      console.log(`client ${this.uuid} requesting to leave room '${this.inRoom}'`)
      this.rtcService.leaveRoom(this.inRoom, this.uuid)
    }
    this.wsClient.removeAllListeners()
    this.rtcService.removeObserver(this.uuid)
    this.wsClient.disconnect && this.wsClient.disconnect()
  }
}

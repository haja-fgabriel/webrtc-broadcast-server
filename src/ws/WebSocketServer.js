/* eslint-disable no-unused-vars */
import { RTCService } from '../services/RTCService'
import { uuidv4 } from '../utils'
import { WebSocketWorker } from './WebSocketWorker'

export class WebSocketServer {
  /**
     * @param {number} port
     * @param {RTCService} rtcService
     */
  constructor (port, rtcService) {
    this._workers = new Map()

    this.io = require('socket.io')({
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    this.rtcService = rtcService
    this.port = port
  }

  /**
     * Sets up the initial handlers.
     */
  initialize () {
    this.io.on('connection', client => {
      const uuid = uuidv4()
      const workers = this._workers
      const newWorker = new WebSocketWorker(uuid, this.rtcService, client)
      workers.set(uuid, newWorker)

      client.on('disconnect', function () {
        newWorker.close()
        workers.delete(uuid)
      })
    })
    this.io.on('disconnect', () => {
      this._workers.clear()
    })
  }

  /**
     * Starts the server for listening for client requests.
     */
  start () {
    this.initialize()
    this.io.listen(this.port)
    console.log('Listening on port ' + this.port)
  }

  /**
     * Closes the server.
     */
  close () {
    this.io.close()
  }

  /**
     * Gets the list of current workers.
     */
  get workers () {
    return new Map(this._workers)
  }
}

/* eslint-disable no-unused-vars */
import { RTCService } from '../services/RTCService'
import { uuidv4 } from '../utils'
import { WebSocketWorker } from './WebSocketWorker'

const fs = require('fs')
const https = require('https')
const http = require('http')
const cors = require('cors')
const app = require('express')()

app.use(cors())

export class WebSocketServer {
  /**
     * @param {number} port
     * @param {RTCService} rtcService
     */
  constructor (port, rtcService) {
    this._workers = new Map()

    if (process.env.HTTPS === 'true') {
      this.server = https.createServer({
        key: fs.readFileSync('cert/privkey.pem', 'utf-8'),
        cert: fs.readFileSync('cert/cert.pem', 'utf-8'),
        ca: fs.readFileSync('cert/chain.pem', 'utf-8'),
        requestCert: false,
        requestUnauthorized: false
      }, app)
    } else {
      this.server = http.createServer({}, app)
    }
    this.io = require('socket.io')(this.server, {
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
      console.log('new client with uuid ' + uuid + ', real uuid: ' + client.id)
      const workers = this._workers
      const newWorker = new WebSocketWorker(uuid, this.rtcService, client)
      workers.set(uuid, newWorker)

      client.on('disconnect', function () {
        console.log('disconnecting client with uuid ' + uuid)
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
    this.server.listen(this.port)
    this.io.listen(this.server)
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

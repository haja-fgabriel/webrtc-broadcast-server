import { RTCRoomInMemoryRepository } from './repositories'
import { RTCService } from './services/RTCService'
import { WebSocketServer } from './ws/WebSocketServer'

const port = process.env.PORT || 8000

const roomRepository = new RTCRoomInMemoryRepository()
const rtcService = new RTCService(roomRepository)
const websocketServer = new WebSocketServer(port, rtcService)

websocketServer.start()

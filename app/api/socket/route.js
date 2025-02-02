import { Server } from 'socket.io'
import { NextResponse } from 'next/server'

const ioHandler = (req) => {
  if (!global.io) {
    console.log('New Socket.io server...')
    global.io = new Server({
      path: '/api/socket',
    })

    global.io.on('connection', (socket) => {
      console.log('Client connected')

      socket.on('driverLocation', (data) => {
        socket.broadcast.emit('driverLocation', data)
      })

      socket.on('bookingRequest', (data) => {
        socket.broadcast.emit('newRideRequest', data)
      })

      socket.on('bookingStatusUpdate', (data) => {
        socket.broadcast.emit('bookingStatusUpdate', data)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }

  return NextResponse.json({ message: 'Socket server running' })
}

export const GET = ioHandler
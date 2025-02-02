import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import Driver from '@/models/Driver'

export async function POST(req) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { pickupLocation, dropoffLocation } = await req.json()

    await connectDB()

    // Calculate estimated price based on distance
    const price = calculatePrice(pickupLocation, dropoffLocation)

    // Find nearest available driver
    const nearestDriver = await Driver.findOne({
      isAvailable: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupLocation.coordinates[0], pickupLocation.coordinates[1]]
          },
          $maxDistance: 10000 // 10km radius
        }
      }
    })

    const booking = await Booking.create({
      customerId: session.user.id,
      driverId: nearestDriver?._id,
      pickupLocation,
      dropoffLocation,
      price,
      status: 'requested'
    })

    // Notify driver through Socket.IO
    if (nearestDriver) {
      global.io.emit('newRideRequest', {
        bookingId: booking._id,
        pickupLocation,
        dropoffLocation,
        price
      })
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

function calculatePrice(pickup, dropoff) {
  // Basic price calculation based on distance
  const basePrice = 5
  const pricePerKm = 2
  const distance = calculateDistance(
    pickup.coordinates[0],
    pickup.coordinates[1],
    dropoff.coordinates[0],
    dropoff.coordinates[1]
  )
  return basePrice + (distance * pricePerKm)
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
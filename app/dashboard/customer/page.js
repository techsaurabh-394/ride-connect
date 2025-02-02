'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { MapPin, Clock, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSocket } from '@/lib/socket'

export default function CustomerDashboard() {
  const { data: session } = useSession()
  const [activeBooking, setActiveBooking] = useState(null)
  const [bookingHistory, setBookingHistory] = useState([])
  const [map, setMap] = useState(null)
  const [pickupLocation, setPickupLocation] = useState(null)
  const [dropoffLocation, setDropoffLocation] = useState(null)

  useEffect(() => {
    // Initialize Socket.IO connection
    const socket = getSocket()

    socket.on('driverLocation', (data) => {
      if (activeBooking && data.bookingId === activeBooking._id) {
        // Update driver marker on map
        updateDriverMarker(data.location)
      }
    })

    socket.on('bookingStatusUpdate', (data) => {
      if (data.bookingId === activeBooking?._id) {
        setActiveBooking((prev) => ({ ...prev, status: data.status }))
        toast.info(`Booking status updated to: ${data.status}`)
      }
    })

    // Load booking history
    fetchBookingHistory()

    return () => {
      socket.off('driverLocation')
      socket.off('bookingStatusUpdate')
    }
  }, [session])

  const fetchBookingHistory = async () => {
    try {
      const response = await fetch('/api/bookings/history')
      const data = await response.json()
      setBookingHistory(data)
    } catch (error) {
      toast.error('Failed to load booking history')
    }
  }

  const handleBooking = async () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.error('Please select pickup and dropoff locations')
      return
    }

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLocation,
          dropoffLocation,
        }),
      })

      const data = await response.json()
      setActiveBooking(data)
      toast.success('Booking created successfully')
    } catch (error) {
      toast.error('Failed to create booking')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Book a Ride</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="map" className="h-[400px] rounded-lg bg-gray-100" />
            <div className="mt-4 space-y-4">
              <Button
                onClick={handleBooking}
                className="w-full"
                disabled={!pickupLocation || !dropoffLocation}
              >
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Booking */}
        {activeBooking && (
          <Card>
            <CardHeader>
              <CardTitle>Current Ride</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span>Status: {activeBooking.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Pickup: {activeBooking.pickupLocation.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Dropoff: {activeBooking.dropoffLocation.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingHistory.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{booking.dropoffLocation.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${booking.price}</div>
                    <div className="text-sm text-gray-500">{booking.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
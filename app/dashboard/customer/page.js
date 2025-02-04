'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { MapPin, Clock, Car, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSocket } from '@/lib/socket'
import { Badge } from '@/components/ui/badge'

export default function CustomerDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login')
    }
  })

  const [activeBooking, setActiveBooking] = useState(null)
  const [bookingHistory, setBookingHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only proceed if session is loaded and user is a customer
    if (status === 'authenticated' && session?.user?.role !== 'customer') {
      redirect('/auth/login')
    }

    // Initialize Socket.IO connection
    const socket = getSocket()

    const handleDriverLocation = (data) => {
      if (activeBooking && data.bookingId === activeBooking._id) {
        // Update driver marker on map
        updateDriverMarker(data.location)
      }
    }

    const handleBookingStatusUpdate = (data) => {
      if (data.bookingId === activeBooking?._id) {
        setActiveBooking((prev) => ({ ...prev, status: data.status }))
        toast.info(`Booking status updated to: ${data.status}`)
      }
    }

    socket.on('driverLocation', handleDriverLocation)
    socket.on('bookingStatusUpdate', handleBookingStatusUpdate)

    // Load booking history
    fetchBookingHistory()

    return () => {
      socket.off('driverLocation', handleDriverLocation)
      socket.off('bookingStatusUpdate', handleBookingStatusUpdate)
    }
  }, [session, status])

  const fetchBookingHistory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/bookings/history')
      const data = await response.json()
      setBookingHistory(data)
    } catch (error) {
      toast.error('Failed to load booking history')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Booking cancelled successfully')
        fetchBookingHistory()
        setActiveBooking(null)
      } else {
        toast.error('Failed to cancel booking')
      }
    } catch (error) {
      toast.error('An error occurred while cancelling the booking')
    }
  }

  const getBookingStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>
      case 'completed':
        return <Badge variant="default">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Placeholder function for booking creation
  const handleBooking = async () => {
    // Implement booking logic 
    toast.info('Booking functionality to be implemented')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Greeting and User Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Welcome, {session?.user?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Ready to start your journey? Book a ride or check your ride history.
            </p>
          </CardContent>
        </Card>

        {/* Booking Section */}
        <Card>
          <CardHeader>
            <CardTitle>Book a Ride</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={handleBooking} 
                className="w-full" 
                variant="primary"
              >
                <Navigation className="mr-2 h-4 w-4" /> 
                Create New Booking
              </Button>
              {activeBooking && (
                <Button 
                  onClick={() => handleCancelBooking(activeBooking._id)} 
                  className="w-full" 
                  variant="destructive"
                >
                  Cancel Current Booking
                </Button>
              )}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-primary" />
                    <span>Status: </span>
                    {getBookingStatusBadge(activeBooking.status)}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCancelBooking(activeBooking._id)}
                  >
                    Cancel
                  </Button>
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
              {bookingHistory.length > 0 ? (
                bookingHistory.map((booking) => (
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
                      {getBookingStatusBadge(booking.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No ride history available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
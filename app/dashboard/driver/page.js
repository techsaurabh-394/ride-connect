'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { MapPin, Clock, User, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { getSocket } from '@/lib/socket'

export default function DriverDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login')
    }
  })

  const [isAvailable, setIsAvailable] = useState(false)
  const [currentRide, setCurrentRide] = useState(null)
  const [rideHistory, setRideHistory] = useState([])
  const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not a driver
    if (status === 'authenticated' && session?.user?.role !== 'driver') {
      redirect('/auth/login')
    }

    const socket = getSocket()

    socket.on('newRideRequest', (data) => {
      if (isAvailable && !currentRide) {
        toast.info('New ride request!', {
          action: {
            label: 'Accept',
            onClick: () => handleAcceptRide(data.bookingId),
          },
        })
      }
    })

    // Load driver stats and history
    Promise.all([
      fetchDriverStats(),
      fetchRideHistory()
    ]).finally(() => setIsLoading(false))

    return () => {
      socket.off('newRideRequest')
    }
  }, [session, status])

  const fetchDriverStats = async () => {
    try {
      const response = await fetch('/api/driver/stats')
      const data = await response.json()
      setEarnings(data.earnings)
    } catch (error) {
      toast.error('Failed to load driver statistics')
    }
  }

  const fetchRideHistory = async () => {
    try {
      const response = await fetch('/api/driver/rides')
      const data = await response.json()
      setRideHistory(data)
    } catch (error) {
      toast.error('Failed to load ride history')
    }
  }

  const handleAvailabilityToggle = async () => {
    try {
      const response = await fetch('/api/driver/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      })

      if (response.ok) {
        setIsAvailable(!isAvailable)
        toast.success(
          `You are now ${!isAvailable ? 'available' : 'unavailable'} for rides`
        )
      }
    } catch (error) {
      toast.error('Failed to update availability')
    }
  }

  const handleAcceptRide = async (bookingId) => {
    try {
      const response = await fetch('/api/driver/accept-ride', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })

      const data = await response.json()
      setCurrentRide(data)
      toast.success('Ride accepted successfully')
    } catch (error) {
      toast.error('Failed to accept ride')
    }
  }

  const handleUpdateRideStatus = async (status) => {
    try {
      const response = await fetch('/api/driver/update-ride-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId: currentRide._id, 
          status 
        }),
      })

      if (response.ok) {
        toast.success(`Ride ${status} successfully`)
        setCurrentRide(null)
        fetchRideHistory()
      }
    } catch (error) {
      toast.error('Failed to update ride status')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading driver dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Available for rides</span>
              <Switch
                checked={isAvailable}
                onCheckedChange={handleAvailabilityToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Earnings Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Today</span>
                <span className="font-semibold">${earnings.today.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>This Week</span>
                <span className="font-semibold">${earnings.week.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>This Month</span>
                <span className="font-semibold">${earnings.month.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Ride */}
        {currentRide && (
          <Card>
            <CardHeader>
              <CardTitle>Current Ride</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>{currentRide.customer.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Pickup: {currentRide.pickupLocation.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Dropoff: {currentRide.dropoffLocation.address}</span>
                </div>
                <Button
                  onClick={() => handleUpdateRideStatus('completed')}
                  className="w-full"
                >
                  Complete Ride
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ride History */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rideHistory.length > 0 ? (
                rideHistory.map((ride) => (
                  <div
                    key={ride._id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-primary" />
                        <span>{ride.customer.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{ride.rating || 'No rating'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${ride.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">{ride.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No recent rides
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
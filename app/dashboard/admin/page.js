'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import {
  Users,
  Car,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login')
    }
  })

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    activeRides: 0,
    totalEarnings: 0,
  })
  const [pendingDrivers, setPendingDrivers] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not an admin
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      redirect('/auth/login')
    }

    // Load all data
    Promise.all([
      fetchAdminStats(),
      fetchPendingDrivers(),
      fetchRecentBookings()
    ]).finally(() => setIsLoading(false))
  }, [session, status])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast.error('Failed to load admin statistics')
    }
  }

  const fetchPendingDrivers = async () => {
    try {
      const response = await fetch('/api/admin/pending-drivers')
      const data = await response.json()
      setPendingDrivers(data)
    } catch (error) {
      toast.error('Failed to load pending drivers')
    }
  }

  const fetchRecentBookings = async () => {
    try {
      const response = await fetch('/api/admin/recent-bookings')
      const data = await response.json()
      setRecentBookings(data)
    } catch (error) {
      toast.error('Failed to load recent bookings')
    }
  }

  const handleDriverVerification = async (driverId, status) => {
    try {
      const response = await fetch('/api/admin/verify-driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, status }),
      })

      if (response.ok) {
        toast.success(`Driver ${status === 'approved' ? 'approved' : 'rejected'}`)
        fetchPendingDrivers()
        fetchAdminStats()
      }
    } catch (error) {
      toast.error('Failed to update driver status')
    }
  }

  const getBookingStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.totalUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.totalDrivers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.activeRides}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalEarnings.toFixed(2)}
            </div>
          </CardContent>
        </Card>

         {/* Pending Drivers */}
         <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Pending Driver Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDrivers.map((driver) => (
                <div
                  key={driver._id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <div className="font-semibold">{driver.name}</div>
                    <div className="text-sm text-gray-500">{driver.email}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleDriverVerification(driver._id, 'approved')
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleDriverVerification(driver._id, 'rejected')
                      }
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-mono">
                      {booking._id.slice(-6)}
                    </TableCell>
                    <TableCell>{booking.customer.name}</TableCell>
                    <TableCell>{booking.driver?.name || 'Unassigned'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell>${booking.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
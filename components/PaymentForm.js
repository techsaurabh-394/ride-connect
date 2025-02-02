'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function PaymentForm({ booking, onPaymentComplete }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    try {
      setIsProcessing(true)

      const stripe = await stripePromise
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking._id }),
      })

      const { clientSecret } = await response.json()

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            name: booking.customer.name,
          },
        },
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Payment successful!')
        onPaymentComplete()
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span>Ride Fare</span>
              <span>${booking.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Service Fee</span>
              <span>${(booking.price * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t mt-2 pt-2 font-semibold flex justify-between">
              <span>Total</span>
              <span>${(booking.price * 1.1).toFixed(2)}</span>
            </div>
          </div>

          <div id="card-element" className="border rounded-lg p-4" />

          <Button
            onClick={handlePayment}
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
  try {
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    if (event.type === 'payment_intent.succeeded') {
      const { bookingId } = event.data.object.metadata

      await connectDB()
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'completed',
        status: 'completed'
      })

      // Notify through Socket.IO
      global.io.emit('bookingStatusUpdate', {
        bookingId,
        status: 'completed',
        paymentStatus: 'completed'
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
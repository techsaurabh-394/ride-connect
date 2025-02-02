import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Car,
  Shield,
  Clock,
  MapPin,
  CreditCard,
  PhoneCall,
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <Car className="h-6 w-6" />,
      title: 'Comfortable Rides',
      description: 'Travel in style with our fleet of modern vehicles.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Safe & Secure',
      description: 'Verified drivers and real-time tracking for your safety.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Quick Pickup',
      description: 'Get picked up within minutes of booking.',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Easy Navigation',
      description: 'Efficient routes to your destination.',
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Cashless Payments',
      description: 'Secure and convenient payment options.',
    },
    {
      icon: <PhoneCall className="h-6 w-6" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance.',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Journey, Our Priority
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg">
              Book reliable rides instantly. Connect with trusted drivers and enjoy
              safe, comfortable journeys to your destination.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose RideConnect?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Experience the best in ride-sharing with our premium features and
              services.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl px-6 py-16 sm:p-16">
            <div className="mx-auto max-w-xl text-center text-white">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg">
                Join thousands of satisfied users who trust RideConnect for their
                daily commute and travel needs.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
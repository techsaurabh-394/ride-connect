"use client";
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Car,
  Shield,
  Clock,
  MapPin,
  CreditCard,
  PhoneCall,
  ArrowRight,
  Star,
  CarTaxiFront,
  Users,
  Calculator,
  Navigation
} from 'lucide-react'

export default function EnhancedHomePage() {
  const features = [
    {
      icon: <Car className="h-8 w-8" />,
      title: 'Comfortable Rides',
      description: 'Travel in style with our fleet of modern vehicles.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Safe & Secure',
      description: 'Verified drivers and real-time tracking for your safety.',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Quick Pickup',
      description: 'Get picked up within minutes of booking.',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Easy Navigation',
      description: 'Efficient routes to your destination.',
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Cashless Payments',
      description: 'Secure and convenient payment options.',
    },
    {
      icon: <PhoneCall className="h-8 w-8" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance.',
    },
  ]

  const vehicleTypes = [
    {
      icon: <CarTaxiFront className="h-12 w-12" />,
      name: 'Economy',
      description: 'Affordable rides for daily commute',
      price: 'from $10'
    },
    {
      icon: <Car className="h-12 w-12" />,
      name: 'Premium',
      description: 'Luxury vehicles for comfort',
      price: 'from $20'
    },
    {
      icon: <Users className="h-12 w-12" />,
      name: 'Family',
      description: 'Spacious cars for groups',
      price: 'from $25'
    }
  ]

  return (
    <div className="bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/20 opacity-75"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 z-10">
          <div className="text-center relative">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in-up">
              Your Journey, Our Priority
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90 animate-fade-in-delay">
              Book reliable rides instantly. Connect with trusted drivers and enjoy
              safe, comfortable journeys to your destination.
            </p>
            <div className="mt-10 flex justify-center gap-4 animate-fade-in-delay">
              <Link href="/book-ride">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 group flex items-center"
                >
                  Book a Ride
                  <Navigation className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/driver/register">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 group flex items-center"
                >
                  Become a Driver
                  <Car className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white"></div>
      </section>

      {/* Quick Booking Section */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicleTypes.map((vehicle, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    {vehicle.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{vehicle.name}</h3>
                    <p className="text-gray-600">{vehicle.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-primary">{vehicle.price}</span>
                  <Link href={`/book-ride?type=${vehicle.name.toLowerCase()}`}>
                    <Button size="sm">Select</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose RideConnect?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Experience the best in ride-sharing with our premium features and services.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-6 text-center 
                           shadow-lg hover:shadow-xl transition-all duration-300 
                           transform hover:-translate-y-2 hover:border-primary/20"
              >
                <div className="flex h-20 w-20 mx-auto items-center justify-center 
                                rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fare Calculator Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold">Estimate Your Fare</h2>
              <p className="text-gray-600 mt-2">Get an instant fare estimate for your journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/fare-calculator">
                <Button 
                  className="w-full h-16 text-lg"
                  variant="outline"
                >
                  Calculate Fare
                </Button>
              </Link>
              <Link href="/book-ride">
                <Button className="w-full h-16 text-lg">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Driver CTA Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl px-6 py-16 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 opacity-90"></div>
            <div className="mx-auto max-w-xl text-center text-white relative z-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Join Our Driver Network
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
                Earn money on your schedule. Join thousands of drivers partnering with RideConnect.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/driver/register">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-gray-100 group flex items-center"
                  >
                    Become a Driver
                    <Car className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/driver/requirements">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 group flex items-center"
                  >
                    Learn More
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
import Link from 'next/link'
import { Car, Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8" />
              <span className="text-xl font-bold">RideConnect</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Your trusted ride-sharing platform connecting passengers with reliable
              drivers for safe and comfortable journeys.
            </p>
            <div className="mt-4 flex items-center space-x-4 text-gray-400">
              <Phone className="h-4 w-4" />
              <span className="text-sm">1-800-RIDE-NOW</span>
            </div>
            <div className="mt-2 flex items-center space-x-4 text-gray-400">
              <Mail className="h-4 w-4" />
              <span className="text-sm">support@rideconnect.com</span>
            </div>
          </div>

          {/* Riders Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              For Riders
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/book-ride" className="text-gray-400 hover:text-white transition">
                  Book a Ride
                </Link>
              </li>
              <li>
                <Link href="/customer/dashboard" className="text-gray-400 hover:text-white transition">
                  My Rides
                </Link>
              </li>
              <li>
                <Link href="/customer/payments" className="text-gray-400 hover:text-white transition">
                  Payment Options
                </Link>
              </li>
              <li>
                <Link href="/fare-calculator" className="text-gray-400 hover:text-white transition">
                  Fare Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Drivers Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              For Drivers
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/driver/register" className="text-gray-400 hover:text-white transition">
                  Become a Driver
                </Link>
              </li>
              <li>
                <Link href="/driver/requirements" className="text-gray-400 hover:text-white transition">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="/driver/earnings" className="text-gray-400 hover:text-white transition">
                  Earnings
                </Link>
              </li>
              <li>
                <Link href="/driver/safety" className="text-gray-400 hover:text-white transition">
                  Safety Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Connect With Us
            </h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} RideConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
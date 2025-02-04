'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Menu, X, UserCircle, MapPin, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Book Ride', href: '/book' },
    { name: 'Driver Portal', href: '/driver/requirements' },
    { name: 'Customer Dashboard', href: '/dashboard/customer' },
  ]

  const isCustomerRoute = pathname?.startsWith('/customer')
  const isDriverRoute = pathname?.startsWith('/driver/register')

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">RideConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {!isCustomerRoute && !isDriverRoute ? (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="mr-2">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Bell className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer" />
                <MapPin className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer" />
                <Link href={isDriverRoute ? "/driver/profile" : "/customer/profile"}>
                  <UserCircle className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium ${
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isCustomerRoute && !isDriverRoute ? (
                <div className="mt-4 space-y-2 px-3">
                  <Link href="/auth/login" className="block">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              ) : (
                <div className="mt-4 flex justify-around px-3">
                  <Bell className="h-6 w-6 text-gray-500" />
                  <MapPin className="h-6 w-6 text-gray-500" />
                  <Link href={isDriverRoute ? "/driver/profile" : "/customer/profile"}>
                    <UserCircle className="h-6 w-6 text-gray-500" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
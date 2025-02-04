"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Car, Clock, Navigation, AlertTriangle, DollarSign } from 'lucide-react';
import { cn } from "@/lib/utils";

const vehicleTypes = [
  { id: 'economy', name: 'Economy', basePrice: 5, pricePerKm: 1.5 },
  { id: 'premium', name: 'Premium', basePrice: 8, pricePerKm: 2.5 },
  { id: 'suv', name: 'SUV', basePrice: 10, pricePerKm: 3 }
];

export default function EnhancedBookingComponent() {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const mapRef = useRef(null);

  // Map initialization code remains the same as your original component

  useEffect(() => {
    if (pickupLocation && dropoffLocation && selectedVehicle) {
      calculateRouteDetails();
      findNearbyDrivers();
    }
  }, [pickupLocation, dropoffLocation, selectedVehicle]);

  const calculateRouteDetails = async () => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['geometry']
    });

    const google = await loader.load();
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: new google.maps.LatLng(pickupLocation.lat, pickupLocation.lng),
        destination: new google.maps.LatLng(dropoffLocation.lat, dropoffLocation.lng),
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          const route = result.routes[0];
          const distanceInKm = route.legs[0].distance.value / 1000;
          const duration = route.legs[0].duration.text;
          
          setDistance(distanceInKm);
          setEstimatedTime(duration);
          
          const vehicle = vehicleTypes.find(v => v.id === selectedVehicle);
          const price = vehicle.basePrice + (distanceInKm * vehicle.pricePerKm);
          setEstimatedPrice(price);
        }
      }
    );
  };

  const findNearbyDrivers = async () => {
    try {
      const response = await fetch('/api/drivers/nearby', {
        method: 'POST',
        body: JSON.stringify({
          latitude: pickupLocation.lat,
          longitude: pickupLocation.lng,
          vehicleType: selectedVehicle
        })
      });
      const drivers = await response.json();
      setNearbyDrivers(drivers);
    } catch (error) {
      console.error('Failed to fetch nearby drivers', error);
    }
  };

  const createBooking = async () => {
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        body: JSON.stringify({
          pickupLocation: {
            type: 'Point',
            coordinates: [pickupLocation.lng, pickupLocation.lat],
            name: pickupLocation.name
          },
          dropoffLocation: {
            type: 'Point',
            coordinates: [dropoffLocation.lng, dropoffLocation.lat],
            name: dropoffLocation.name
          },
          vehicleType: selectedVehicle,
          estimatedPrice,
          estimatedTime,
          distance,
          paymentMethod
        })
      });
      const booking = await response.json();
      setBookingStatus('success');
    } catch (error) {
      console.error('Booking creation failed', error);
      setBookingStatus('error');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-1/2 p-6 space-y-6">
        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <Select onValueChange={(value) => setSelectedVehicle(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <input 
                ref={pickupRef}
                placeholder="Pickup Location" 
                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <input 
                ref={dropoffRef}
                placeholder="Dropoff Location" 
                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <Select onValueChange={(value) => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>

            {estimatedPrice && estimatedTime && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Car className="text-primary" />
                  <span>${estimatedPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="text-primary" />
                  <span>{estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-primary" />
                  <span>{distance?.toFixed(1)} km</span>
                </div>
              </div>
            )}

            <Button 
              onClick={createBooking} 
              disabled={!pickupLocation || !dropoffLocation || !selectedVehicle}
              className={cn(
                "w-full",
                bookingStatus === 'success' && "bg-green-500 hover:bg-green-600",
                bookingStatus === 'error' && "bg-red-500 hover:bg-red-600"
              )}
            >
              {bookingStatus === 'success' ? 'Booking Confirmed' : 
               bookingStatus === 'error' ? 'Booking Failed' : 
               'Book Ride'}
            </Button>
          </div>
        </Card>
        
        {nearbyDrivers.length > 0 && (
          <Card className="p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Available Drivers</h3>
            {nearbyDrivers.map(driver => (
              <div 
                key={driver._id} 
                className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Car className="text-primary" />
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <p className="text-sm text-gray-500">{driver.vehicleModel}</p>
                  </div>
                </div>
                <span className="text-gray-500">{driver.distance.toFixed(1)} km away</span>
              </div>
            ))}
          </Card>
        )}
      </div>
      <div className="w-1/2 p-6">
        <div 
          ref={mapRef} 
          style={{ height: '100%', borderRadius: '16px' }} 
          className="shadow-xl"
        />
      </div>
    </div>
  );
}
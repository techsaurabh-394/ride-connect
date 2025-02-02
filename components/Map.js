'use client'

import { useEffect, useRef, useState } from 'react'
import { createMap, addMarker, updateMarkerPosition } from '@/lib/maps'

export default function Map({
  center,
  onLocationSelect,
  showDriverLocation,
  driverLocation,
}) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState({
    pickup: null,
    dropoff: null,
    driver: null,
  })

  useEffect(() => {
    if (!mapRef.current) return

    const initMap = async () => {
      const newMap = await createMap('map', center)
      setMap(newMap)

      // Add click listener for location selection
      if (onLocationSelect) {
        newMap.addListener('click', (e) => {
          const location = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          }
          onLocationSelect(location)
        })
      }
    }

    initMap()
  }, [center, onLocationSelect])

  useEffect(() => {
    if (!map || !showDriverLocation || !driverLocation) return

    if (!markers.driver) {
      const driverMarker = addMarker(map, driverLocation, {
        icon: {
          url: '/car-marker.png',
          scaledSize: new google.maps.Size(32, 32),
        },
      })
      setMarkers((prev) => ({ ...prev, driver: driverMarker }))
    } else {
      updateMarkerPosition(markers.driver, driverLocation)
    }
  }, [map, showDriverLocation, driverLocation])

  return <div id="map" ref={mapRef} className="w-full h-full rounded-lg" />
}
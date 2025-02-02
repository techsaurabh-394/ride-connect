import { Loader } from '@googlemaps/js-api-loader'

let googleMapsLoader

export const initGoogleMaps = () => {
  if (!googleMapsLoader) {
    googleMapsLoader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places']
    })
  }
  return googleMapsLoader
}

export const createMap = async (elementId, center = { lat: 0, lng: 0 }) => {
  const loader = initGoogleMaps()
  const google = await loader.load()
  
  const map = new google.maps.Map(document.getElementById(elementId), {
    center,
    zoom: 15,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  })

  return map
}

export const addMarker = (map, position, options = {}) => {
  return new google.maps.Marker({
    map,
    position,
    ...options
  })
}

export const updateMarkerPosition = (marker, position) => {
  marker.setPosition(position)
}

export const initPlacesAutocomplete = (inputElement) => {
  const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    types: ['address'],
    componentRestrictions: { country: 'US' }
  })

  return autocomplete
}

export const calculateRoute = async (map, origin, destination) => {
  const directionsService = new google.maps.DirectionsService()
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: true
  })

  const request = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING
  }

  const result = await directionsService.route(request)
  directionsRenderer.setDirections(result)

  return {
    distance: result.routes[0].legs[0].distance.text,
    duration: result.routes[0].legs[0].duration.text,
    path: result.routes[0].overview_path
  }
}
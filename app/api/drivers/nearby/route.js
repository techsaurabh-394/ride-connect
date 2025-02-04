import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Driver from '@/models/Driver';

export async function POST(req) {
  try {
    await connectDB();
    const { latitude, longitude, vehicleType } = await req.json();

    const nearbyDrivers = await Driver.find({
      isAvailable: true,
      vehicleType,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    })
    .select('name vehicleModel location rating')
    .limit(5);

    const driversWithDistance = nearbyDrivers.map(driver => {
      const distance = calculateDistance(
        latitude,
        longitude,
        driver.location.coordinates[1],
        driver.location.coordinates[0]
      );
      
      return {
        _id: driver._id,
        name: driver.name,
        vehicleModel: driver.vehicleModel,
        rating: driver.rating,
        distance
      };
    });

    return NextResponse.json(driversWithDistance);
  } catch (error) {
    console.error('Error finding nearby drivers:', error);
    return NextResponse.json({ error: 'Failed to find nearby drivers' }, { status: 500 });
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
}
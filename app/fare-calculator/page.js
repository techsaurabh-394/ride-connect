"use client";
import { useState } from 'react'
import { MapPin, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'

export default function FareCalculator() {
  const [distance, setDistance] = useState('')
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Fare Calculator</h1>
      
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle Type</label>
            <Select>
              <option value="economy">Economy</option>
              <option value="premium">Premium</option>
              <option value="family">Family</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Estimated Distance (km)</label>
            <Input 
              type="number" 
              placeholder="Enter distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>

          {distance && (
            <Card className="p-4 bg-primary/5">
              <h3 className="text-xl font-semibold">Estimated Fare</h3>
              <p className="text-3xl font-bold text-primary mt-2">
                ${(Number(distance) * 2).toFixed(2)}
              </p>
            </Card>
          )}

          <Button className="w-full">Book Now</Button>
        </div>
      </Card>
    </div>
  )
}

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function DriverRegister() {
  const [vehicleType, setVehicleType] = useState("");
  const [numSeats, setNumSeats] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  // Passenger and Commercial vehicle options
  const passengerVehicles = [
    "Toyota Camry", "Honda Accord", "Tesla Model 3", "Ford Focus", "Chevrolet Malibu",
    "BMW 3 Series", "Audi A4", "Hyundai Sonata", "Mercedes C-Class", "Volkswagen Jetta",
    "Nissan Altima", "Kia Optima", "Mazda 6", "Subaru Legacy", "Lexus ES"
  ];

  const commercialVehicles = [
    "Ford Transit Van", "Mercedes Sprinter", "Chevrolet Express", "Isuzu NPR",
    "Freightliner Cascadia", "Kenworth T680", "Mack Anthem", "Volvo VNL",
    "Peterbilt 579", "Ram ProMaster", "GMC Savana", "Nissan NV Cargo"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Become a Driver</h1>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input placeholder="Enter last name" />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="Enter email" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input type="tel" placeholder="Enter phone number" />
          </div>

          {/* Vehicle Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle Type</label>
            <Select onValueChange={setVehicleType}>
              <SelectTrigger>Select Vehicle Type</SelectTrigger>
              <SelectContent>
                <SelectItem value="passenger">Passenger</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Passenger - Number of Seats */}
          {vehicleType === "passenger" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Seats</label>
              <Select onValueChange={setNumSeats}>
                <SelectTrigger>Select Number of Seats</SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2-Seater</SelectItem>
                  <SelectItem value="4">4-Seater</SelectItem>
                  <SelectItem value="6">6-Seater</SelectItem>
                  <SelectItem value="8">8-Seater</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Vehicle Model Selection Based on Type */}
          {vehicleType && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Vehicle Model</label>
              <Select onValueChange={setVehicleModel}>
                <SelectTrigger>Select Vehicle Model</SelectTrigger>
                <SelectContent>
                  {vehicleType === "passenger"
                    ? passengerVehicles.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))
                    : commercialVehicles.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Vehicle Registration Document */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle Registration Document</label>
            <Input type="file" />
          </div>

          {/* License Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium">License Number</label>
            <Input placeholder="Enter license number" />
          </div>

          {/* Submit Button */}
          <Button className="w-full">Submit Application</Button>
        </div>
      </Card>
    </div>
  );
}

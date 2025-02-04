import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Driver from '@/models/Driver';

export async function POST(req) {
  try {
    const { name, email, password, phone, role, licenseNumber } = await req.json()

    if (!name || !email || !password || !phone || !role || (role === 'driver' && !licenseNumber)) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    })

    // If registering as a driver, create driver profile
    if (role === 'driver') {
      await Driver.create({
        userId: user._id,
        licenseNumber, // Add licenseNumber to the driver profile
        verificationStatus: 'pending',
      })
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
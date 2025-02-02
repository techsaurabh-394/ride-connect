"use client";  // Make this file a Client Component

import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'RideConnect - Your Trusted Ride-Sharing Platform',
//   description: 'RideConnect connects passengers with reliable drivers for safe and comfortable rides. Book your ride now!',
//   keywords: 'ride-sharing, taxi, car booking, transportation, RideConnect',
//   openGraph: {
//     title: 'RideConnect - Your Trusted Ride-Sharing Platform',
//     description: 'Book reliable rides with RideConnect',
//     images: ['/og-image.jpg'],
//   },
// };

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}

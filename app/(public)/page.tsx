'use client';

import Silk from '@/components/Silk';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Silk
          speed={5}
          scale={1}
          color="#2e85fe"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
        <Image
          src="/logo_white.png"
          alt="Mument Logo"
          width={200}
          height={100}
          className="object-contain"
        />
        <button
          className="absolute bottom-10 px-6 py-3 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-200 transition"
          onClick={() => {
            window.location.href = '/login';
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
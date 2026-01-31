'use client';

import Silk from '@/components/Silk';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Silk
          speed={5}
          scale={1}
          color="#2e85fe"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-auto px-4 text-center">
        {/* Brand / Version */}
        <div className="mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Logo Icon or Text */}
          <span className="text-white text-2xl md:text-3xl font-bold tracking-tight">μment</span>
          <span className="h-6 w-px bg-white/40 mx-2"></span>
          <span className="text-white/80 text-xl md:text-2xl font-light">2.0</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-12 drop-shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          where curiosity meets <br className="hidden md:block" />
          <span className="block mt-2">action</span>
        </h1>

        <button
          className="px-8 py-3 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95 animate-in fade-in zoom-in duration-700 delay-300"
          onClick={() => {
            window.location.href = '/login';
          }}
        >
          Get Started
        </button>

        <div className="absolute bottom-6 text-white/40 text-xs text-center">
          © 2026 μment. All rights reserved.
        </div>
      </div>
      <footer className="absolute bottom-4 w-full text-center text-white text-sm z-10">
        &copy; {new Date().getFullYear()} µment. All rights reserved.
      </footer>
    </div>
  )
}
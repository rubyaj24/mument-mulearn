// This page is reserved for µday

'use client';

import Lanyard from './components/Lanyard'



export default function LanyardPage() {

  return (
    <div className='relative w-full h-screen overflow-hidden pointer-events-auto'>
      {/* Lanyard Background - Full Screen */}
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      
      {/* Content Overlay */}
      <div className='absolute inset-0 pointer-events-none flex flex-col lg:flex-row drop-shadow-lg'>
        {/* Content Section - Left */}
        <div className='flex-1 flex flex-col items-center justify-center p-8 lg:p-12'>
          <h1 className='text-5xl font-black mb-4 text-blue-500'>Congrats!!</h1>
          <h1 className='text-5xl font-black text-blue-500 text-center'>You are invited to µday</h1>
          <p className='mt-4 text-xl text-black mask-b-from-black mix-blend-lighten drop-shadow-lg text-center max-w-md'>Join us for a day of fun, learning, and community!</p>
        </div>
        
        {/* Right Side - Passes through pointer events to Lanyard */}
        <div className='flex-1 pointer-events-none'></div>
      </div>
    </div>
  )
}
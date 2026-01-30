"use client"

import React from "react"

export default function Skeleton({ className = "", children, rounded = true }: { className?: string; children?: React.ReactNode; rounded?: boolean }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${rounded ? 'rounded-xl' : ''} ${className}`}>
      {children}
    </div>
  )
}

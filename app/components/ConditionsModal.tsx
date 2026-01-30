"use client"

import React from "react"

export default function ConditionsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-2 text-blue-500">Welcome — Rules & Regulations</h2>
        <p className="text-sm text-slate-700 mb-4">Please read and follow these rules while using the platform.</p>

        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 mb-4">
          <li>Be respectful to other participants and coordinators.</li>
          <li>Do not share personal login credentials.</li>
          <li>Report issues through the Feedback Inbox promptly.</li>
          <li>Follow campus-specific guidelines provided by coordinators.</li>
        </ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

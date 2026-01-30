"use client"

import React, { createContext, useContext, useState } from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"

type ToastOptions = {
  title?: string
  description?: string
  duration?: number
}

type ToastItem = ToastOptions & { id: string }

const ToastContext = createContext<{ show: (opts?: ToastOptions) => void } | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return { show: () => {} }
  }
  return ctx
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  function show(opts?: ToastOptions) {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto as { randomUUID: () => string }).randomUUID()
        : String(Date.now())
    const item: ToastItem = { id, title: opts?.title, description: opts?.description, duration: opts?.duration ?? 4000 }
    setToasts((t) => [...t, item])
  }

  function handleOpenChange(open: boolean, id: string) {
    if (!open) setToasts((t) => t.filter((x) => x.id !== id))
  }

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastContext.Provider value={{ show }}>
        {children}

        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            open={true}
            onOpenChange={(open) => handleOpenChange(open, t.id)}
            duration={t.duration}
            className="bg-white border shadow-md rounded-lg p-4 max-w-sm"
          >
            {t.title && <div className="font-semibold text-sm text-slate-900">{t.title}</div>}
            {t.description && <div className="text-sm text-slate-700 mt-1">{t.description}</div>}
            <ToastPrimitive.Close aria-label="Close" className="sr-only">
              Close
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}

        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 z-50" />
      </ToastContext.Provider>
    </ToastPrimitive.Provider>
  )
}

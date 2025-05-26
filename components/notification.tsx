"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface NotificationProps {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
}

export function Notification({ message, type, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow fade out animation
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type]

  const icon = {
    success: "✓",
    error: "⚠",
    info: "ℹ",
  }[type]

  return (
    <div
      className={`fixed top-4 right-4 z-[10000] transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <span className="text-lg">{icon}</span>
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { InteractiveMap } from "@/components/interactive-map"

export default function WealthMapPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    redirect("/signin")
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Wealth Map</h1>
        <p className="text-gray-600">Explore verified property ownership and real estate intelligence</p>
      </div>

      {/* Map Container */}
      <div className="flex-1">
        <InteractiveMap />
      </div>
    </div>
  )
}

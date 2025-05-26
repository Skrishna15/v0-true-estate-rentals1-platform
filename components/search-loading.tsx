"use client"

import { Search, MapPin } from "lucide-react"

export function SearchLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <Search className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Searching Properties</h3>
          <p className="text-sm text-gray-600">Finding verified properties and owners...</p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>Scanning ATTOM & Zillow databases</span>
          </div>
        </div>
      </div>
    </div>
  )
}

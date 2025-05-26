"use client"

import { useRef, useState } from "react"

interface Property {
  id: string
  coordinates: [number, number]
  owner: string
  value: string
  trustScore: number
  address: string
}

interface InteractiveMapProps {
  properties: Property[]
  onPropertySelect?: (property: Property) => void
}

export function InteractiveMap({ properties, onPropertySelect }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // Fallback to a static map visualization for now
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
    onPropertySelect?.(property)
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Static Map Placeholder with Interactive Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Simple map grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Property Markers */}
        <div className="absolute inset-0">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${20 + ((index * 15) % 60)}%`,
                top: `${30 + ((index * 12) % 40)}%`,
              }}
              onClick={() => handlePropertyClick(property)}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-125 ${
                  property.trustScore >= 90
                    ? "bg-green-500"
                    : property.trustScore >= 80
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />

              {/* Tooltip */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <h4 className="font-semibold text-sm">{property.owner}</h4>
                <p className="text-xs text-gray-600 mb-1">{property.address}</p>
                <p className="text-xs font-medium text-green-600">{property.value}</p>
                <p className="text-xs">Trust Score: {property.trustScore}%</p>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Labels */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-sm mb-2">San Francisco Bay Area</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>90%+ Trust Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>80-89% Trust Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Below 80% Trust</span>
            </div>
          </div>
        </div>

        {/* Selected Property Info */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{selectedProperty.owner}</h4>
                <p className="text-sm text-gray-600">{selectedProperty.address}</p>
                <p className="text-sm font-medium text-green-600">{selectedProperty.value}</p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    selectedProperty.trustScore >= 90
                      ? "bg-green-500"
                      : selectedProperty.trustScore >= 80
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="text-sm font-medium">{selectedProperty.trustScore}% Trust</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Interactive Features Notice */}
        <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
          <p className="text-xs text-blue-800">
            <strong>Interactive Map:</strong> Click property markers to view owner details and trust scores. Full Mapbox
            integration available in production.
          </p>
        </div>
      </div>
    </div>
  )
}

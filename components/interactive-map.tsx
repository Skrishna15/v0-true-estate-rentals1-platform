"use client"

import { useState } from "react"
import { MapPin, Building, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property.id)
    onPropertySelect?.(property)
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow text-sm z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>San Francisco Bay Area</span>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded shadow text-xs z-10">
        <h4 className="font-semibold mb-2">Trust Score</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>90%+ (Safe)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>80-89% (Caution)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>&lt;80% (Risk)</span>
          </div>
        </div>
      </div>

      {/* Simulated Map Background */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative">
        {/* Grid lines to simulate map */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-gray-400" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-gray-400" style={{ left: `${i * 10}%` }} />
          ))}
        </div>

        {/* Property Markers */}
        {properties.map((property, index) => {
          const trustColor =
            property.trustScore >= 90 ? "bg-green-500" : property.trustScore >= 80 ? "bg-yellow-500" : "bg-red-500"

          // Simulate different positions on the map
          const positions = [
            { top: "25%", left: "30%" },
            { top: "45%", left: "60%" },
            { top: "65%", left: "25%" },
            { top: "35%", left: "75%" },
            { top: "55%", left: "45%" },
            { top: "75%", left: "70%" },
          ]

          const position = positions[index % positions.length]

          return (
            <div
              key={property.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ top: position.top, left: position.left }}
              onClick={() => handlePropertyClick(property)}
            >
              {/* Property Marker */}
              <div
                className={`w-6 h-6 ${trustColor} rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform`}
              >
                <Building className="w-3 h-3 text-white m-auto mt-0.5" />
              </div>

              {/* Property Info Popup */}
              {selectedProperty === property.id && (
                <Card className="absolute top-8 left-1/2 transform -translate-x-1/2 w-64 z-20 shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{property.owner}</h3>
                      <Badge className={`${trustColor} text-white text-xs`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {property.trustScore}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{property.address}</p>
                    <p className="text-sm font-medium text-green-600">{property.value}</p>
                    <div className="mt-3 pt-2 border-t">
                      <button className="text-xs text-blue-600 hover:underline">View Full Details →</button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded shadow hover:bg-gray-50 text-lg font-bold">+</button>
        <button className="bg-white p-2 rounded shadow hover:bg-gray-50 text-lg font-bold">−</button>
      </div>

      {/* Click anywhere to close popup */}
      {selectedProperty && <div className="absolute inset-0 z-10" onClick={() => setSelectedProperty(null)} />}
    </div>
  )
}

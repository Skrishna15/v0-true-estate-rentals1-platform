"use client"

import { useEffect, useRef, useState } from "react"

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
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    // For demo purposes, we'll create a static map visualization
    // In production, this would use a server-side API to initialize the map
    if (mapContainer.current) {
      // Create a simple grid-based visualization of properties
      const container = mapContainer.current
      container.innerHTML = ""

      // Create a simple map-like interface
      const mapDiv = document.createElement("div")
      mapDiv.className =
        "relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden"

      // Add a map-like background pattern
      mapDiv.style.backgroundImage = `
        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
      `
      mapDiv.style.backgroundSize = "20px 20px"

      // Add properties as markers
      properties.forEach((property, index) => {
        const marker = document.createElement("div")
        marker.className =
          "absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
        marker.style.backgroundColor =
          property.trustScore >= 90 ? "#10b981" : property.trustScore >= 80 ? "#f59e0b" : "#ef4444"

        // Position markers in a grid pattern for demo
        const x = 20 + (index % 4) * 25 + Math.random() * 10
        const y = 20 + Math.floor(index / 4) * 25 + Math.random() * 10
        marker.style.left = `${x}%`
        marker.style.top = `${y}%`

        // Add click handler
        marker.addEventListener("click", () => {
          onPropertySelect?.(property)

          // Show popup
          const popup = document.createElement("div")
          popup.className = "absolute bg-white p-3 rounded-lg shadow-lg border z-10 min-w-48"
          popup.style.left = `${x}%`
          popup.style.top = `${y - 15}%`
          popup.innerHTML = `
            <div class="text-sm">
              <h3 class="font-semibold">${property.owner}</h3>
              <p class="text-gray-600 text-xs">${property.address}</p>
              <p class="text-green-600 font-medium">${property.value}</p>
              <p class="text-xs">Trust Score: ${property.trustScore}%</p>
            </div>
          `

          // Remove existing popups
          container.querySelectorAll(".popup").forEach((p) => p.remove())
          popup.classList.add("popup")
          mapDiv.appendChild(popup)

          // Remove popup after 3 seconds
          setTimeout(() => {
            popup.remove()
          }, 3000)
        })

        mapDiv.appendChild(marker)
      })

      // Add map controls overlay
      const controls = document.createElement("div")
      controls.className = "absolute top-4 left-4 bg-white p-2 rounded shadow text-sm"
      controls.innerHTML = `
        <div class="font-medium">Interactive Property Map</div>
        <div class="text-xs text-gray-600">Click markers to view details</div>
      `
      mapDiv.appendChild(controls)

      // Add legend
      const legend = document.createElement("div")
      legend.className = "absolute bottom-4 left-4 bg-white p-3 rounded shadow text-xs"
      legend.innerHTML = `
        <div class="font-medium mb-2">Trust Score Legend</div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <span>90%+ Trust (Highly Verified)</span>
        </div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>80-89% Trust (Verified)</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Below 80% (Caution)</span>
        </div>
      `
      mapDiv.appendChild(legend)

      container.appendChild(mapDiv)
    }
  }, [properties, onPropertySelect])

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">Map Temporarily Unavailable</h3>
          <p className="text-gray-600 mb-4">Showing property data in list format</p>
          <div className="space-y-2">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white p-3 rounded border cursor-pointer hover:bg-gray-50"
                onClick={() => onPropertySelect?.(property)}
              >
                <div className="font-medium">{property.owner}</div>
                <div className="text-sm text-gray-600">{property.address}</div>
                <div className="text-sm text-green-600">{property.value}</div>
                <div className="text-xs">Trust Score: {property.trustScore}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  )
}

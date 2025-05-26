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
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return
    initializeMap()
  }, [properties])

  const initializeMap = () => {
    if (!mapContainer.current) return

    const container = mapContainer.current
    container.innerHTML = ""

    // Create enhanced OpenStreetMap-style visualization
    const mapDiv = document.createElement("div")
    mapDiv.className = "relative w-full h-full bg-gray-50 rounded-lg overflow-hidden"

    // Add realistic map background with multiple layers
    mapDiv.style.backgroundImage = `
      radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      linear-gradient(rgba(156, 163, 175, 0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(156, 163, 175, 0.2) 1px, transparent 1px),
      linear-gradient(rgba(156, 163, 175, 0.1) 2px, transparent 2px),
      linear-gradient(90deg, rgba(156, 163, 175, 0.1) 2px, transparent 2px)
    `
    mapDiv.style.backgroundSize = "400px 400px, 400px 400px, 25px 25px, 25px 25px, 100px 100px, 100px 100px"
    mapDiv.style.backgroundColor = "#f8fafc"

    // Add major streets and highways
    const majorStreets = [
      { x: 15, y: 0, width: 3, height: 100, direction: "vertical", type: "highway" },
      { x: 45, y: 0, width: 2, height: 100, direction: "vertical", type: "major" },
      { x: 75, y: 0, width: 2, height: 100, direction: "vertical", type: "major" },
      { x: 0, y: 25, width: 100, height: 3, direction: "horizontal", type: "highway" },
      { x: 0, y: 55, width: 100, height: 2, direction: "horizontal", type: "major" },
      { x: 0, y: 75, width: 100, height: 2, direction: "horizontal", type: "major" },
    ]

    // Add minor streets
    const minorStreets = [
      { x: 25, y: 0, width: 1, height: 100, direction: "vertical", type: "minor" },
      { x: 35, y: 0, width: 1, height: 100, direction: "vertical", type: "minor" },
      { x: 55, y: 0, width: 1, height: 100, direction: "vertical", type: "minor" },
      { x: 65, y: 0, width: 1, height: 100, direction: "vertical", type: "minor" },
      { x: 85, y: 0, width: 1, height: 100, direction: "vertical", type: "minor" },
      { x: 0, y: 15, width: 100, height: 1, direction: "horizontal", type: "minor" },
      { x: 0, y: 35, width: 100, height: 1, direction: "horizontal", type: "minor" },
      { x: 0, y: 45, width: 100, height: 1, direction: "horizontal", type: "minor" },
      { x: 0, y: 65, width: 100, height: 1, direction: "horizontal", type: "minor" },
      { x: 0, y: 85, width: 100, height: 1, direction: "horizontal", type: "minor" },
    ]

    const allStreets = [...majorStreets, ...minorStreets]

    allStreets.forEach((street) => {
      const streetElement = document.createElement("div")
      const colorClass =
        street.type === "highway" ? "bg-gray-400" : street.type === "major" ? "bg-gray-300" : "bg-gray-200"

      streetElement.className = `absolute ${colorClass} opacity-80`
      streetElement.style.left = `${street.x}%`
      streetElement.style.top = `${street.y}%`
      streetElement.style.width = `${street.width}${street.direction === "horizontal" ? "%" : "px"}`
      streetElement.style.height = `${street.height}${street.direction === "vertical" ? "%" : "px"}`
      mapDiv.appendChild(streetElement)
    })

    // Add parks and green spaces
    const parks = [
      { x: 18, y: 28, width: 15, height: 12, name: "Central Park" },
      { x: 50, y: 45, width: 18, height: 15, name: "Riverside Park" },
      { x: 78, y: 15, width: 12, height: 10, name: "City Square" },
      { x: 25, y: 78, width: 20, height: 8, name: "Waterfront Park" },
    ]

    parks.forEach((park) => {
      const parkElement = document.createElement("div")
      parkElement.className = "absolute bg-green-200 rounded-lg border border-green-300"
      parkElement.style.left = `${park.x}%`
      parkElement.style.top = `${park.y}%`
      parkElement.style.width = `${park.width}%`
      parkElement.style.height = `${park.height}%`
      parkElement.title = park.name
      mapDiv.appendChild(parkElement)
    })

    // Add water features
    const waterFeatures = [
      { x: 0, y: 88, width: 100, height: 12, name: "San Francisco Bay" },
      { x: 70, y: 60, width: 25, height: 8, name: "Lake Merced" },
    ]

    waterFeatures.forEach((water) => {
      const waterElement = document.createElement("div")
      waterElement.className = "absolute bg-blue-200 border border-blue-300"
      waterElement.style.left = `${water.x}%`
      waterElement.style.top = `${water.y}%`
      waterElement.style.width = `${water.width}%`
      waterElement.style.height = `${water.height}%`
      waterElement.title = water.name
      mapDiv.appendChild(waterElement)
    })

    // Add neighborhoods/districts
    const districts = [
      { x: 10, y: 10, width: 25, height: 20, name: "Financial District", color: "rgba(59, 130, 246, 0.1)" },
      { x: 40, y: 15, width: 30, height: 25, name: "Mission District", color: "rgba(34, 197, 94, 0.1)" },
      { x: 60, y: 40, width: 25, height: 20, name: "Castro District", color: "rgba(168, 85, 247, 0.1)" },
      { x: 15, y: 50, width: 35, height: 25, name: "SOMA", color: "rgba(249, 115, 22, 0.1)" },
    ]

    districts.forEach((district) => {
      const districtElement = document.createElement("div")
      districtElement.className = "absolute border border-dashed border-gray-400 rounded-lg"
      districtElement.style.left = `${district.x}%`
      districtElement.style.top = `${district.y}%`
      districtElement.style.width = `${district.width}%`
      districtElement.style.height = `${district.height}%`
      districtElement.style.backgroundColor = district.color
      districtElement.title = district.name
      mapDiv.appendChild(districtElement)
    })

    // Add property markers with enhanced positioning
    properties.forEach((property, index) => {
      const marker = document.createElement("div")
      marker.className =
        "absolute w-10 h-10 rounded-full border-3 border-white shadow-xl cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all duration-200 z-20 flex items-center justify-center"

      const trustColor = property.trustScore >= 90 ? "#10b981" : property.trustScore >= 80 ? "#f59e0b" : "#ef4444"

      marker.style.backgroundColor = trustColor

      // Add trust score text inside marker
      const scoreText = document.createElement("span")
      scoreText.className = "text-white text-xs font-bold"
      scoreText.textContent = property.trustScore.toString()
      marker.appendChild(scoreText)

      // Enhanced positioning based on coordinates or smart grid
      let x, y
      if (property.coordinates && property.coordinates[0] && property.coordinates[1]) {
        // Convert real coordinates to map percentage with better distribution
        const lng = property.coordinates[0]
        const lat = property.coordinates[1]

        // San Francisco bounds: lng: -122.5 to -122.3, lat: 37.7 to 37.8
        x = Math.max(5, Math.min(95, ((lng + 122.5) / 0.2) * 90 + 5))
        y = Math.max(5, Math.min(95, (1 - (lat - 37.7) / 0.1) * 90 + 5))
      } else {
        // Smart grid positioning avoiding streets and water
        const gridX = (index % 4) * 20 + 15
        const gridY = Math.floor(index / 4) * 20 + 20
        x = gridX + (Math.random() - 0.5) * 10
        y = gridY + (Math.random() - 0.5) * 10
      }

      marker.style.left = `${x}%`
      marker.style.top = `${y}%`

      // Add click handler with enhanced popup
      marker.addEventListener("click", () => {
        onPropertySelect?.(property)
        setSelectedProperty(property.id)

        // Remove existing popups
        container.querySelectorAll(".property-popup").forEach((p) => p.remove())

        // Create enhanced popup
        const popup = document.createElement("div")
        popup.className =
          "property-popup absolute bg-white p-4 rounded-xl shadow-2xl border-2 border-gray-200 z-30 min-w-64 max-w-80"
        popup.style.left = `${Math.min(x, 70)}%`
        popup.style.top = `${Math.max(y - 20, 5)}%`

        popup.innerHTML = `
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-bold text-lg text-gray-900">${property.owner}</h3>
                <p class="text-sm text-gray-600">${property.address}</p>
              </div>
              <button class="popup-close text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-green-600">${property.value}</span>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full" style="background-color: ${trustColor}"></div>
                <span class="font-semibold">${property.trustScore}% Trust</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="bg-gray-50 p-2 rounded">
                <div class="text-gray-500">Verification</div>
                <div class="font-medium">${property.trustScore >= 90 ? "Fully Verified" : property.trustScore >= 80 ? "Verified" : "Pending"}</div>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <div class="text-gray-500">Status</div>
                <div class="font-medium text-green-600">Available</div>
              </div>
            </div>
            
            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View Property Details
            </button>
          </div>
        `

        // Add close button functionality
        const closeBtn = popup.querySelector(".popup-close")
        closeBtn?.addEventListener("click", (e) => {
          e.stopPropagation()
          popup.remove()
          setSelectedProperty(null)
        })

        mapDiv.appendChild(popup)

        // Auto-close popup after 10 seconds
        setTimeout(() => {
          if (popup.parentNode) {
            popup.remove()
            setSelectedProperty(null)
          }
        }, 10000)
      })

      // Add hover effect
      marker.addEventListener("mouseenter", () => {
        marker.style.transform = "translate(-50%, -50%) scale(1.1)"
        marker.style.zIndex = "25"
      })

      marker.addEventListener("mouseleave", () => {
        if (selectedProperty !== property.id) {
          marker.style.transform = "translate(-50%, -50%) scale(1)"
          marker.style.zIndex = "20"
        }
      })

      mapDiv.appendChild(marker)
    })

    // Add enhanced map controls overlay
    const controls = document.createElement("div")
    controls.className = "absolute top-4 left-4 bg-white p-4 rounded-xl shadow-lg border z-10 max-w-xs"
    controls.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-blue-600 rounded"></div>
          <span class="font-bold text-lg">TrueEstate Wealth Map</span>
        </div>
        <div class="text-sm text-gray-600">Interactive property ownership visualization</div>
        <div class="text-xs text-gray-500">Click markers to view verified property details</div>
        <div class="flex items-center gap-2 text-xs">
          <span class="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span class="text-green-600 font-medium">Live Data</span>
        </div>
      </div>
    `
    mapDiv.appendChild(controls)

    // Add enhanced legend
    const legend = document.createElement("div")
    legend.className = "absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg border z-10"
    legend.innerHTML = `
      <div class="space-y-3">
        <div class="font-bold text-sm">Trust Score Legend</div>
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
            <span class="text-sm">90%+ Trust (Highly Verified)</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
            <span class="text-sm">80-89% Trust (Verified)</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
            <span class="text-sm">Below 80% (Caution)</span>
          </div>
        </div>
        <div class="pt-2 border-t border-gray-200">
          <div class="text-xs text-gray-500">
            ${properties.length} properties • ${properties.filter((p) => p.trustScore >= 80).length} verified owners
          </div>
        </div>
      </div>
    `
    mapDiv.appendChild(legend)

    // Add zoom and navigation controls
    const navControls = document.createElement("div")
    navControls.className = "absolute top-4 right-4 bg-white rounded-xl shadow-lg border z-10"
    navControls.innerHTML = `
      <div class="flex flex-col">
        <button class="nav-btn w-10 h-10 text-gray-600 hover:bg-gray-100 border-b flex items-center justify-center font-bold text-lg">+</button>
        <button class="nav-btn w-10 h-10 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-lg">−</button>
      </div>
    `
    mapDiv.appendChild(navControls)

    // Add click-to-close popup functionality
    mapDiv.addEventListener("click", (e) => {
      if (!(e.target as Element).closest(".property-popup") && !(e.target as Element).closest("[class*='w-10 h-10']")) {
        container.querySelectorAll(".property-popup").forEach((p) => p.remove())
        setSelectedProperty(null)
      }
    })

    container.appendChild(mapDiv)
    setMapLoaded(true)
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading interactive wealth map...</p>
          </div>
        </div>
      )}
    </div>
  )
}

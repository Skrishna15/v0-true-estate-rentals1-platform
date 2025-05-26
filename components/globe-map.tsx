"use client"

import { useEffect, useRef, useState } from "react"
import { Settings, Map, Eye, EyeOff, Globe, Layers, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Property {
  id: string
  coordinates: [number, number]
  owner: string
  value: string
  trustScore: number
  address: string
  city: string
  country: string
}

interface GlobeMapProps {
  properties: Property[]
  onPropertySelect?: (property: Property) => void
}

export function GlobeMap({ properties, onPropertySelect }: GlobeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v10")
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    if (!mapContainer.current) return

    initializeGlobeMap()

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (map.current && mapLoaded) {
      addPropertyMarkers()
    }
  }, [properties, mapLoaded])

  const initializeGlobeMap = async () => {
    try {
      // For demo purposes, we'll create a 3D-style globe visualization
      // In production, this would use the actual Mapbox token
      createGlobeVisualization()
    } catch (error) {
      console.error("Failed to initialize globe map:", error)
      createGlobeVisualization()
    }
  }

  const createGlobeVisualization = () => {
    if (!mapContainer.current) return

    const container = mapContainer.current
    container.innerHTML = ""

    // Create 3D globe-style container
    const globeDiv = document.createElement("div")
    globeDiv.className =
      "relative w-full h-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 rounded-lg overflow-hidden"

    // Add stars background
    const starsDiv = document.createElement("div")
    starsDiv.className = "absolute inset-0"
    starsDiv.style.backgroundImage = `
      radial-gradient(2px 2px at 20px 30px, #eee, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, #fff, transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
      radial-gradient(2px 2px at 160px 30px, #ddd, transparent)
    `
    starsDiv.style.backgroundRepeat = "repeat"
    starsDiv.style.backgroundSize = "200px 100px"
    globeDiv.appendChild(starsDiv)

    // Create the main globe
    const earthDiv = document.createElement("div")
    earthDiv.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    earthDiv.style.width = "min(80vw, 80vh, 600px)"
    earthDiv.style.height = "min(80vw, 80vh, 600px)"
    earthDiv.style.borderRadius = "50%"
    earthDiv.style.background = `
      radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 0.4)),
      radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.6), rgba(168, 85, 247, 0.3)),
      conic-gradient(from 0deg, #22c55e, #3b82f6, #8b5cf6, #f59e0b, #ef4444, #22c55e)
    `
    earthDiv.style.boxShadow = `
      inset -20px -20px 50px rgba(0,0,0,0.5),
      0 0 100px rgba(59, 130, 246, 0.3),
      0 0 200px rgba(59, 130, 246, 0.1)
    `
    earthDiv.style.animation = "rotate 60s linear infinite"

    // Add continents overlay
    const continentsDiv = document.createElement("div")
    continentsDiv.className = "absolute inset-0 rounded-full opacity-60"
    continentsDiv.style.background = `
      radial-gradient(ellipse 40% 30% at 20% 40%, rgba(34, 197, 94, 0.8), transparent),
      radial-gradient(ellipse 35% 25% at 60% 30%, rgba(34, 197, 94, 0.7), transparent),
      radial-gradient(ellipse 30% 40% at 70% 70%, rgba(34, 197, 94, 0.6), transparent),
      radial-gradient(ellipse 25% 20% at 30% 80%, rgba(34, 197, 94, 0.5), transparent)
    `
    earthDiv.appendChild(continentsDiv)

    // Add property markers on the globe
    properties.forEach((property, index) => {
      const marker = document.createElement("div")
      marker.className =
        "absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-all duration-300 z-20"

      const trustColor = property.trustScore >= 90 ? "#10b981" : property.trustScore >= 80 ? "#f59e0b" : "#ef4444"
      marker.style.backgroundColor = trustColor
      marker.style.boxShadow = `0 0 20px ${trustColor}, 0 0 40px ${trustColor}40`

      // Position markers on the globe surface (simplified 3D projection)
      const angle = (index / properties.length) * 2 * Math.PI
      const radius = 45 // percentage of globe radius
      const x = 50 + radius * Math.cos(angle) * 0.8 // 0.8 for perspective
      const y = 50 + radius * Math.sin(angle) * 0.6 // 0.6 for perspective

      marker.style.left = `${x}%`
      marker.style.top = `${y}%`

      // Add pulsing animation
      marker.style.animation = `pulse 2s ease-in-out infinite ${index * 0.2}s`

      // Add click handler
      marker.addEventListener("click", () => {
        onPropertySelect?.(property)
        showPropertyPopup(property, x, y, earthDiv)
      })

      earthDiv.appendChild(marker)
    })

    globeDiv.appendChild(earthDiv)

    // Add CSS animations
    const style = document.createElement("style")
    style.textContent = `
      @keyframes rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
      }
    `
    document.head.appendChild(style)

    container.appendChild(globeDiv)
    setMapLoaded(true)
  }

  const showPropertyPopup = (property: Property, x: number, y: number, container: HTMLElement) => {
    // Remove existing popups
    container.querySelectorAll(".property-popup").forEach((p) => p.remove())

    const popup = document.createElement("div")
    popup.className =
      "property-popup absolute bg-white p-4 rounded-xl shadow-2xl border-2 border-gray-200 z-30 min-w-64 max-w-80"
    popup.style.left = `${Math.min(x, 70)}%`
    popup.style.top = `${Math.max(y - 20, 5)}%`

    const trustColor = property.trustScore >= 90 ? "#10b981" : property.trustScore >= 80 ? "#f59e0b" : "#ef4444"

    popup.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-bold text-lg text-gray-900">${property.owner}</h3>
            <p class="text-sm text-gray-600">${property.city}, ${property.country}</p>
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
        
        <div class="text-sm text-gray-600">${property.address}</div>
        
        <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          View Property Details
        </button>
      </div>
    `

    const closeBtn = popup.querySelector(".popup-close")
    closeBtn?.addEventListener("click", () => popup.remove())

    container.appendChild(popup)

    setTimeout(() => {
      if (popup.parentNode) popup.remove()
    }, 8000)
  }

  const addPropertyMarkers = () => {
    // This would add markers to the actual Mapbox map
    // For now, markers are added in the createGlobeVisualization function
  }

  const toggleMapStyle = () => {
    const newStyle =
      mapStyle === "mapbox://styles/mapbox/light-v10"
        ? "mapbox://styles/mapbox/dark-v10"
        : "mapbox://styles/mapbox/light-v10"
    setMapStyle(newStyle)

    // In a real implementation, this would update the Mapbox style
    // map.current?.setStyle(newStyle)
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />

      {/* Floating Control Panel */}
      <Card className="absolute top-4 left-4 z-40 bg-white/90 backdrop-blur-sm border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-sm">3D Globe Map</span>
            </div>

            {/* Map Controls Dropdown */}
            <DropdownMenu open={showControls} onOpenChange={setShowControls}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Controls
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={toggleMapStyle}>
                  <Map className="w-4 h-4 mr-2" />
                  Toggle Style ({mapStyle.includes("light") ? "Light" : "Dark"})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowLegend(!showLegend)}>
                  <Layers className="w-4 h-4 mr-2" />
                  {showLegend ? "Hide" : "Show"} Legend
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Globe className="w-4 h-4 mr-2" />
                  Reset View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Legend Toggle */}
            <Button variant="outline" size="sm" onClick={() => setShowLegend(!showLegend)}>
              {showLegend ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Legend Panel */}
      {showLegend && (
        <Card className="absolute bottom-4 left-4 z-40 bg-white/90 backdrop-blur-sm border-2">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-sm">Property Trust Scores</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg"></div>
                  <span className="text-sm">90%+ Trust (Highly Verified)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg"></div>
                  <span className="text-sm">80-89% Trust (Verified)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg"></div>
                  <span className="text-sm">Below 80% (Caution)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-600">{properties.length} global properties tracked</div>
                <div className="text-xs text-green-600">
                  {properties.filter((p) => p.trustScore >= 80).length} verified owners worldwide
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg z-50">
          <div className="text-center text-white">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Initializing 3D Globe...</p>
            <p className="text-sm opacity-75">Loading global property data</p>
          </div>
        </div>
      )}

      {/* Mobile Responsive Info */}
      <div className="absolute top-4 right-4 z-40 md:hidden">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="text-xs text-gray-600">Tap markers for details</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

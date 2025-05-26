"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import {
  Settings,
  MapIcon,
  Info,
  Layers,
  Globe,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Sample property data for the globe
const sampleProperties = [
  { id: 1, lng: -74.006, lat: 40.7128, name: "New York Property", value: "$2.5M", trustScore: 95 },
  { id: 2, lng: -118.2437, lat: 34.0522, name: "Los Angeles Property", value: "$1.8M", trustScore: 88 },
  { id: 3, lng: -87.6298, lat: 41.8781, name: "Chicago Property", value: "$950K", trustScore: 92 },
  { id: 4, lng: -95.3698, lat: 29.7604, name: "Houston Property", value: "$750K", trustScore: 85 },
  { id: 5, lng: -122.4194, lat: 37.7749, name: "San Francisco Property", value: "$3.2M", trustScore: 97 },
  { id: 6, lng: -80.1918, lat: 25.7617, name: "Miami Property", value: "$1.2M", trustScore: 78 },
  { id: 7, lng: -71.0589, lat: 42.3601, name: "Boston Property", value: "$1.5M", trustScore: 94 },
  { id: 8, lng: -121.4944, lat: 38.5816, name: "Sacramento Property", value: "$680K", trustScore: 89 },
]

interface GlobeMapProps {
  className?: string
}

export function GlobeMap({ className = "" }: GlobeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapStyle, setMapStyle] = useState<"light" | "dark">("light")
  const [showLegend, setShowLegend] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [fogEnabled, setFogEnabled] = useState(true)

  useEffect(() => {
    if (!mapContainer.current) return

    // Fetch Mapbox token from API route
    const initializeMap = async () => {
      try {
        const response = await fetch("/api/mapbox-token")

        if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.status}`)
        }

        const data = await response.json()

        if (!response.ok || !data.token) {
          console.error("Failed to fetch Mapbox token:", data.error)
          return
        }

        mapboxgl.accessToken = data.token

        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: `mapbox://styles/mapbox/${mapStyle}-v10`,
          projection: "globe" as any, // 3D globe projection
          center: [-100, 40], // United States focus
          zoom: 2,
          pitch: 0,
          bearing: 0,
        })

        map.current.on("load", () => {
          if (!map.current) return

          // Enable fog for atmospheric effect
          if (fogEnabled) {
            map.current.setFog({
              color: "rgb(186, 210, 235)", // Lower atmosphere
              "high-color": "rgb(36, 92, 223)", // Upper atmosphere
              "horizon-blend": 0.02, // Atmosphere thickness
              "space-color": "rgb(11, 11, 25)", // Background color
              "star-intensity": 0.6, // Background star brightness
            })
          }

          // Add property markers
          addPropertyMarkers()
          setMapLoaded(true)
        })
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initializeMap()

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Update map style
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setStyle(`mapbox://styles/mapbox/${mapStyle}-v10`)

      // Re-add markers after style change
      map.current.on("styledata", () => {
        addPropertyMarkers()
        if (fogEnabled) {
          map.current?.setFog({
            color: "rgb(186, 210, 235)",
            "high-color": "rgb(36, 92, 223)",
            "horizon-blend": 0.02,
            "space-color": "rgb(11, 11, 25)",
            "star-intensity": 0.6,
          })
        }
      })
    }
  }, [mapStyle, mapLoaded])

  // Toggle fog effect
  useEffect(() => {
    if (map.current && mapLoaded) {
      if (fogEnabled) {
        map.current.setFog({
          color: "rgb(186, 210, 235)",
          "high-color": "rgb(36, 92, 223)",
          "horizon-blend": 0.02,
          "space-color": "rgb(11, 11, 25)",
          "star-intensity": 0.6,
        })
      } else {
        map.current.setFog({})
      }
    }
  }, [fogEnabled, mapLoaded])

  const addPropertyMarkers = () => {
    if (!map.current) return

    sampleProperties.forEach((property) => {
      // Create marker element
      const markerElement = document.createElement("div")
      markerElement.className = "property-marker"
      markerElement.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        background-color: ${property.trustScore >= 90 ? "#10b981" : property.trustScore >= 80 ? "#f59e0b" : "#ef4444"};
      `

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-gray-900 mb-2">${property.name}</h3>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Value:</span>
              <span class="font-medium text-green-600">${property.value}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Trust Score:</span>
              <span class="font-medium">${property.trustScore}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                property.trustScore >= 90
                  ? "bg-green-100 text-green-800"
                  : property.trustScore >= 80
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }">
                ${property.trustScore >= 90 ? "Verified" : property.trustScore >= 80 ? "Caution" : "Risk"}
              </span>
            </div>
          </div>
          <button class="mt-3 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
            View Details
          </button>
        </div>
      `)

      // Add marker to map
      new mapboxgl.Marker(markerElement).setLngLat([property.lng, property.lat]).setPopup(popup).addTo(map.current!)
    })
  }

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut()
    }
  }

  const handleResetView = () => {
    if (map.current) {
      map.current.flyTo({
        center: [-100, 40],
        zoom: 2,
        pitch: 0,
        bearing: 0,
        duration: 2000,
      })
    }
  }

  const handleStyleChange = (style: "light" | "dark") => {
    setMapStyle(style)
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />

      {/* Floating Control Panel */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              {/* Map Controls Dropdown */}
              <DropdownMenu open={showControls} onOpenChange={setShowControls}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => handleStyleChange("light")}>
                    <Sun className="w-4 h-4 mr-2" />
                    Light Style
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStyleChange("dark")}>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark Style
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFogEnabled(!fogEnabled)}>
                    {fogEnabled ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {fogEnabled ? "Disable" : "Enable"} Atmosphere
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleResetView}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Legend Toggle */}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowLegend(!showLegend)}>
                <Info className="w-4 h-4" />
              </Button>

              {/* Map Style Indicator */}
              <Badge variant="secondary" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                3D Globe
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Zoom Controls */}
        <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-2">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      {showLegend && (
        <Card className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-3">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Trust Score Legend
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                <span>Verified (90%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                <span>Caution (80-89%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                <span>Risk (&lt;80%)</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Properties:</span>
                <span className="font-medium">{sampleProperties.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile-friendly Property Count */}
      <div className="absolute top-4 right-4 z-10 md:hidden">
        <Badge className="bg-blue-600 text-white">
          <MapIcon className="w-3 h-3 mr-1" />
          {sampleProperties.length} Properties
        </Badge>
      </div>

      {/* Loading Indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading 3D Globe...</p>
          </div>
        </div>
      )}
    </div>
  )
}

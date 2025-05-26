"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { Map, Satellite, Navigation, Plus, Minus } from "lucide-react"

interface Property {
  id: string
  owner: string
  address: string
  value: string
  trustScore: number
  coordinates: [number, number]
}

interface InteractiveMapProps {
  properties: Property[]
  onPropertySelect?: (property: Property) => void
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ properties, onPropertySelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng, setLng] = useState(-122.4194)
  const [lat, setLat] = useState(37.7749)
  const [zoom, setZoom] = useState(10)
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v11")
  const [isLoading, setIsLoading] = useState(true)

  const mapStyles = {
    street: "mapbox://styles/mapbox/streets-v12",
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    light: "mapbox://styles/mapbox/light-v11",
    dark: "mapbox://styles/mapbox/dark-v11",
  }

  useEffect(() => {
    if (map.current) return // Initialize map only once

    const initializeMap = async () => {
      if (mapContainer.current) {
        try {
          setIsLoading(true)
          // Fetch Mapbox token from secure server-side API
          const response = await fetch("/api/mapbox-token")
          const data = await response.json()

          if (!data.token) {
            console.error("Failed to get Mapbox token")
            setIsLoading(false)
            return
          }

          mapboxgl.accessToken = data.token

          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [lng, lat],
            zoom: zoom,
          })

          // Add navigation controls
          map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

          // Add geolocate control
          map.current.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
              },
              trackUserLocation: true,
              showUserHeading: true,
            }),
            "top-right",
          )

          map.current.on("load", () => {
            setIsLoading(false)
          })

          map.current.on("move", () => {
            if (map.current) {
              setLng(Number(map.current.getCenter().lng.toFixed(4)))
              setLat(Number(map.current.getCenter().lat.toFixed(4)))
              setZoom(Number(map.current.getZoom().toFixed(2)))
            }
          })

          // Add property markers
          properties.forEach((property) => {
            const el = document.createElement("div")
            el.className = "marker"
            el.style.backgroundColor =
              property.trustScore >= 90 ? "#10b981" : property.trustScore >= 80 ? "#f59e0b" : "#ef4444"
            el.style.width = "24px"
            el.style.height = "24px"
            el.style.borderRadius = "50%"
            el.style.cursor = "pointer"
            el.style.border = "3px solid white"
            el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)"
            el.style.transition = "all 0.2s ease"

            el.addEventListener("mouseenter", () => {
              el.style.transform = "scale(1.2)"
            })

            el.addEventListener("mouseleave", () => {
              el.style.transform = "scale(1)"
            })

            el.addEventListener("click", () => {
              onPropertySelect?.(property)
            })

            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: true,
              closeOnClick: false,
            }).setHTML(
              `<div class="p-3 min-w-[200px]">
                <h3 class="font-semibold text-lg mb-1">${property.owner}</h3>
                <p class="text-sm text-gray-600 mb-2">${property.address}</p>
                <p class="text-lg font-bold text-green-600 mb-2">${property.value}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Trust Score:</span>
                  <span class="text-sm font-semibold ${property.trustScore >= 90 ? "text-green-600" : property.trustScore >= 80 ? "text-yellow-600" : "text-red-600"}">${property.trustScore}%</span>
                </div>
                <button class="mt-2 w-full bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700">
                  View Details
                </button>
              </div>`,
            )

            new mapboxgl.Marker(el).setLngLat(property.coordinates).setPopup(popup).addTo(map.current!)
          })
        } catch (error) {
          console.error("Error initializing map:", error)
          setIsLoading(false)
        }
      }
    }

    initializeMap()
  }, [lng, lat, zoom, properties, onPropertySelect, mapStyle])

  const changeMapStyle = (style: string) => {
    if (map.current) {
      map.current.setStyle(style)
      setMapStyle(style)
    }
  }

  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn()
    }
  }

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut()
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map style controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
        <div className="flex flex-col gap-2">
          <Button
            variant={mapStyle === mapStyles.street ? "default" : "outline"}
            size="sm"
            onClick={() => changeMapStyle(mapStyles.street)}
            className="justify-start"
          >
            <Map className="w-4 h-4 mr-2" />
            Street
          </Button>
          <Button
            variant={mapStyle === mapStyles.satellite ? "default" : "outline"}
            size="sm"
            onClick={() => changeMapStyle(mapStyles.satellite)}
            className="justify-start"
          >
            <Satellite className="w-4 h-4 mr-2" />
            Satellite
          </Button>
          <Button
            variant={mapStyle === mapStyles.light ? "default" : "outline"}
            size="sm"
            onClick={() => changeMapStyle(mapStyles.light)}
            className="justify-start"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Light
          </Button>
          <Button
            variant={mapStyle === mapStyles.dark ? "default" : "outline"}
            size="sm"
            onClick={() => changeMapStyle(mapStyles.dark)}
            className="justify-start"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Dark
          </Button>
        </div>
      </div>

      {/* Custom zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <Button variant="outline" size="sm" onClick={zoomIn} className="bg-white hover:bg-gray-50 w-10 h-10 p-0">
          <Plus className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomOut} className="bg-white hover:bg-gray-50 w-10 h-10 p-0">
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      {/* Map info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 z-10">
        <div className="flex items-center gap-4">
          <span>Lng: {lng}</span>
          <span>Lat: {lat}</span>
          <span>Zoom: {zoom}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-20 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="font-semibold text-sm mb-2">Trust Score Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>90%+ (Verified Safe)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>80-89% (Caution)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>&lt;80% (High Risk)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

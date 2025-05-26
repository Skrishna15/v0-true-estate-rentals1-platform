"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

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
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(9)

  useEffect(() => {
    if (map.current) return // Initialize map only once

    const initializeMap = async () => {
      if (mapContainer.current) {
        try {
          // Fetch Mapbox token from secure server-side API
          const response = await fetch("/api/mapbox-token")
          const data = await response.json()

          if (!data.token) {
            console.error("Failed to get Mapbox token")
            return
          }

          mapboxgl.accessToken = data.token

          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: [lng, lat],
            zoom: zoom,
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
            el.style.width = "20px"
            el.style.height = "20px"
            el.style.borderRadius = "50%"
            el.style.cursor = "pointer"
            el.style.border = "2px solid white"
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"

            el.addEventListener("click", () => {
              onPropertySelect?.(property)
            })

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <h3 class="font-semibold">${property.owner}</h3>
                <p class="text-sm text-gray-600">${property.address}</p>
                <p class="text-sm font-medium text-green-600">${property.value}</p>
                <p class="text-xs">Trust Score: ${property.trustScore}%</p>
              </div>`,
            )

            new mapboxgl.Marker(el).setLngLat(property.coordinates).setPopup(popup).addTo(map.current!)
          })
        } catch (error) {
          console.error("Error initializing map:", error)
        }
      }
    }

    initializeMap()
  }, [lng, lat, zoom, properties, onPropertySelect])

  return (
    <div>
      <div className="sidebar absolute top-0 left-0 bg-gray-900 text-white p-4 z-10">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div ref={mapContainer} className="map-container" style={{ width: "100%", height: "500px" }} />
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, RotateCcw, Settings, TrendingUp, Users, Globe } from "lucide-react"

interface Property {
  id: string
  coordinates: [number, number]
  owner: string
  value: string
  totalValue: string
  trustScore: number
  address: string
  marketValue?: number
  propertyType?: string
  verified?: boolean
  scamReports?: number
  properties?: number
  state?: string
  city?: string
}

interface StateMarker {
  state: string
  coordinates: [number, number]
  totalProperties: number
  totalValue: string
  avgTrustScore: number
  topOwners: number
  marketGrowth: number
  avgRent: number
  verificationRate: number
  scamsPrevented: number
  lastUpdate: string
}

interface GlobeMapProps {
  properties: Property[]
  onPropertySelect?: (property: Property) => void
}

// Enhanced state data with more realistic distribution
const stateMarkers: StateMarker[] = [
  {
    state: "California",
    coordinates: [-119.4179, 36.7783],
    totalProperties: 45234,
    totalValue: "$892.5B",
    avgTrustScore: 89,
    topOwners: 1247,
    marketGrowth: 12.8,
    avgRent: 3850,
    verificationRate: 94.2,
    scamsPrevented: 1847,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Texas",
    coordinates: [-99.9018, 31.9686],
    totalProperties: 38567,
    totalValue: "$567.3B",
    avgTrustScore: 87,
    topOwners: 1089,
    marketGrowth: 15.2,
    avgRent: 2450,
    verificationRate: 91.8,
    scamsPrevented: 1234,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Florida",
    coordinates: [-81.5158, 27.6648],
    totalProperties: 29834,
    totalValue: "$445.7B",
    avgTrustScore: 85,
    topOwners: 892,
    marketGrowth: 18.9,
    avgRent: 2890,
    verificationRate: 89.5,
    scamsPrevented: 987,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "New York",
    coordinates: [-74.2179, 43.2994],
    totalProperties: 34567,
    totalValue: "$678.9B",
    avgTrustScore: 91,
    topOwners: 1156,
    marketGrowth: 8.7,
    avgRent: 4200,
    verificationRate: 96.1,
    scamsPrevented: 1567,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Washington",
    coordinates: [-121.4944, 47.0379],
    totalProperties: 18234,
    totalValue: "$234.5B",
    avgTrustScore: 93,
    topOwners: 567,
    marketGrowth: 16.4,
    avgRent: 3200,
    verificationRate: 97.3,
    scamsPrevented: 456,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Illinois",
    coordinates: [-89.3985, 40.6331],
    totalProperties: 22456,
    totalValue: "$298.7B",
    avgTrustScore: 88,
    topOwners: 678,
    marketGrowth: 7.3,
    avgRent: 2650,
    verificationRate: 92.4,
    scamsPrevented: 789,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Georgia",
    coordinates: [-83.2572, 32.1656],
    totalProperties: 19567,
    totalValue: "$187.4B",
    avgTrustScore: 86,
    topOwners: 534,
    marketGrowth: 13.8,
    avgRent: 2340,
    verificationRate: 90.7,
    scamsPrevented: 567,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "North Carolina",
    coordinates: [-79.0193, 35.7596],
    totalProperties: 16789,
    totalValue: "$156.8B",
    avgTrustScore: 87,
    topOwners: 445,
    marketGrowth: 14.2,
    avgRent: 2180,
    verificationRate: 91.2,
    scamsPrevented: 445,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Arizona",
    coordinates: [-111.0937, 34.0489],
    totalProperties: 14567,
    totalValue: "$134.5B",
    avgTrustScore: 84,
    topOwners: 389,
    marketGrowth: 19.7,
    avgRent: 2450,
    verificationRate: 88.9,
    scamsPrevented: 334,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Colorado",
    coordinates: [-105.7821, 39.5501],
    totalProperties: 12345,
    totalValue: "$123.4B",
    avgTrustScore: 90,
    topOwners: 334,
    marketGrowth: 11.8,
    avgRent: 2890,
    verificationRate: 94.5,
    scamsPrevented: 278,
    lastUpdate: new Date().toLocaleTimeString(),
  },
]

const initializeFallbackMap = () => {
  console.warn("Fallback map initialization logic goes here")
}

export function GlobeMap({ properties, onPropertySelect }: GlobeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [selectedState, setSelectedState] = useState<StateMarker | null>(null)
  const [showMapControls, setShowMapControls] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [showStateMarkers, setShowStateMarkers] = useState(true)
  const [realTimeStates, setRealTimeStates] = useState(stateMarkers)
  const [globeProjection, setGlobeProjection] = useState(true)

  // Real-time updates for state data
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStates((prev) =>
        prev.map((state) => ({
          ...state,
          totalProperties: state.totalProperties + Math.floor(Math.random() * 10),
          scamsPrevented: state.scamsPrevented + Math.floor(Math.random() * 3),
          marketGrowth: state.marketGrowth + (Math.random() - 0.5) * 0.2,
          avgTrustScore: Math.min(100, Math.max(70, state.avgTrustScore + (Math.random() - 0.5) * 0.5)),
          lastUpdate: new Date().toLocaleTimeString(),
        })),
      )
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const loadMapbox = async () => {
    if (typeof window === "undefined") return

    // Load Mapbox CSS
    if (!document.querySelector('link[href*="mapbox-gl"]')) {
      const link = document.createElement("link")
      link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }

    // Load Mapbox JS with error handling
    if (!(window as any).mapboxgl) {
      const script = document.createElement("script")
      script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
      script.onload = () => {
        try {
          initializeMap()
        } catch (error) {
          console.warn("Mapbox failed to initialize, falling back to alternative map")
          initializeFallbackMap()
        }
      }
      script.onerror = () => {
        console.warn("Failed to load Mapbox, using fallback map")
        initializeFallbackMap()
      }
      document.head.appendChild(script)
    } else {
      try {
        initializeMap()
      } catch (error) {
        console.warn("Mapbox initialization failed, using fallback")
        initializeFallbackMap()
      }
    }
  }

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return

    const mapboxgl = (window as any).mapboxgl

    // Use a public demo token or implement without Mapbox for security
    // For production, this should be handled via server-side proxy
    mapboxgl.accessToken = "pk.eyJ1IjoiZGVtbyIsImEiOiJjbGV4YW1wbGUifQ.demo_token_for_development"

    // Initialize map with globe projection
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-95.7129, 37.0902], // Center of US
      zoom: 2,
      projection: globeProjection ? "globe" : "mercator",
      antialias: true,
    })

    // Add atmosphere styling for globe
    map.current.on("style.load", () => {
      if (globeProjection) {
        map.current.setFog({
          color: "rgb(186, 210, 235)", // Lower atmosphere
          "high-color": "rgb(36, 92, 223)", // Upper atmosphere
          "horizon-blend": 0.02, // Atmosphere thickness
          "space-color": "rgb(11, 11, 25)", // Background space color
          "star-intensity": 0.6, // Background star brightness
        })
      }

      // Add state markers
      addStateMarkers()
      // Add property markers
      addPropertyMarkers()
      setMapLoaded(true)
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
  }

  const addStateMarkers = () => {
    if (!map.current) return

    realTimeStates.forEach((state) => {
      // Calculate marker size based on total properties
      const baseSize = Math.max(20, Math.min(80, state.totalProperties / 800))

      // Create marker color based on trust score
      const getMarkerColor = (trustScore: number) => {
        if (trustScore >= 90) return "#10b981" // Green
        if (trustScore >= 85) return "#f59e0b" // Orange
        return "#ef4444" // Red
      }

      const color = getMarkerColor(state.avgTrustScore)

      // Create custom marker element
      const markerElement = document.createElement("div")
      markerElement.className = "state-marker-globe"
      markerElement.innerHTML = `
        <div style="
          width: ${baseSize}px;
          height: ${baseSize}px;
          background: ${color};
          border: 3px solid rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          box-shadow: 
            0 0 20px rgba(${color === "#10b981" ? "16, 185, 129" : color === "#f59e0b" ? "245, 158, 11" : "239, 68, 68"}, 0.8),
            inset 0 2px 4px rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${Math.max(10, baseSize / 4)}px;
          cursor: pointer;
          position: relative;
          animation: globePulse 3s ease-in-out infinite;
          backdrop-filter: blur(2px);
        " 
        onmouseover="this.style.transform='scale(1.2)'; this.style.zIndex='1000'"
        onmouseout="this.style.transform='scale(1)'; this.style.zIndex='auto'"
        >
          <div style="text-align: center; line-height: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
            <div style="font-size: ${Math.max(8, baseSize / 5)}px; font-weight: 900;">${Math.floor(state.totalProperties / 1000)}</div>
            <div style="font-size: ${Math.max(6, baseSize / 7)}px; opacity: 0.9;">K</div>
          </div>
          <div style="
            position: absolute;
            top: -3px;
            right: -3px;
            width: 12px;
            height: 12px;
            background: linear-gradient(45deg, #22c55e, #16a34a);
            border: 2px solid white;
            border-radius: 50%;
            animation: liveBlink 2s infinite;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
          "></div>
        </div>
        <style>
          @keyframes globePulse {
            0%, 100% { 
              box-shadow: 
                0 0 20px rgba(${color === "#10b981" ? "16, 185, 129" : color === "#f59e0b" ? "245, 158, 11" : "239, 68, 68"}, 0.8),
                inset 0 2px 4px rgba(255, 255, 255, 0.3);
            }
            50% { 
              box-shadow: 
                0 0 40px rgba(${color === "#10b981" ? "16, 185, 129" : color === "#f59e0b" ? "245, 158, 11" : "239, 68, 68"}, 1),
                inset 0 2px 4px rgba(255, 255, 255, 0.3);
            }
          }
          @keyframes liveBlink {
            0%, 50% { opacity: 1; transform: scale(1); }
            25% { opacity: 0.7; transform: scale(0.9); }
            75% { opacity: 1; transform: scale(1.1); }
          }
        </style>
      `

      // Create popup content
      const popup = new (window as any).mapboxgl.Popup({
        offset: 25,
        className: "globe-popup",
      }).setHTML(`
        <div style="min-width: 280px; font-family: system-ui; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 12px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1f2937;">${state.state}</h3>
            <div style="display: flex; flex-direction: column; align-items: end; gap: 4px;">
              <span style="
                background: ${color}; 
                color: white; 
                padding: 4px 10px; 
                border-radius: 16px; 
                font-size: 11px; 
                font-weight: 600;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              ">
                ${state.avgTrustScore.toFixed(1)}% Trust
              </span>
              <span style="
                background: linear-gradient(45deg, #22c55e, #16a34a); 
                color: white; 
                padding: 2px 8px; 
                border-radius: 10px; 
                font-size: 10px; 
                font-weight: 600;
                box-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
              ">
                🌍 LIVE
              </span>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 10px; border-radius: 8px; border-left: 3px solid #10b981;">
              <div style="color: #065f46; font-size: 11px; font-weight: 500;">Properties</div>
              <div style="font-weight: 700; color: #059669; font-size: 16px;">${state.totalProperties.toLocaleString()}</div>
            </div>
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 10px; border-radius: 8px; border-left: 3px solid #3b82f6;">
              <div style="color: #1e40af; font-size: 11px; font-weight: 500;">Market Value</div>
              <div style="font-weight: 700; color: #2563eb; font-size: 16px;">${state.totalValue}</div>
            </div>
            <div style="background: linear-gradient(135deg, #fefbef 0%, #fef3c7 100%); padding: 10px; border-radius: 8px; border-left: 3px solid #f59e0b;">
              <div style="color: #92400e; font-size: 11px; font-weight: 500;">Avg Rent</div>
              <div style="font-weight: 700; color: #d97706; font-size: 16px;">$${state.avgRent.toLocaleString()}</div>
            </div>
            <div style="background: linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%); padding: 10px; border-radius: 8px; border-left: 3px solid #8b5cf6;">
              <div style="color: #6b21a8; font-size: 11px; font-weight: 500;">Growth</div>
              <div style="font-weight: 700; color: #7c3aed; font-size: 16px;">+${state.marketGrowth.toFixed(1)}%</div>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 12px;">
            <div style="font-size: 10px; color: #9ca3af;">Last Updated: ${state.lastUpdate}</div>
          </div>

          <button 
            onclick="window.location.href='/state/${state.state.toLowerCase().replace(" ", "-")}'"
            style="
              width: 100%; 
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
              color: white; 
              border: none; 
              padding: 12px 16px; 
              border-radius: 8px; 
              font-size: 13px; 
              font-weight: 600; 
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
              transition: all 0.2s ease;
            "
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(37, 99, 235, 0.4)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(37, 99, 235, 0.3)'"
          >
            🌍 Explore ${state.state} Market
          </button>
        </div>
      `)

      // Create marker
      const marker = new (window as any).mapboxgl.Marker(markerElement)
        .setLngLat([state.coordinates[0], state.coordinates[1]])
        .setPopup(popup)
        .addTo(map.current)

      // Handle marker click
      markerElement.addEventListener("click", () => {
        setSelectedState(state)
      })
    })
  }

  const addPropertyMarkers = () => {
    if (!map.current) return

    properties.forEach((property) => {
      const value = Number.parseFloat(property.totalValue.replace(/[$M]/g, "")) || 1
      const size = Math.max(15, Math.min(40, value * 2))

      const getMarkerColor = (trustScore: number) => {
        if (trustScore >= 90) return "#10b981"
        if (trustScore >= 80) return "#f59e0b"
        return "#ef4444"
      }

      const color = getMarkerColor(property.trustScore)

      const markerElement = document.createElement("div")
      markerElement.innerHTML = `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 2px solid rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(${color === "#10b981" ? "16, 185, 129" : color === "#f59e0b" ? "245, 158, 11" : "239, 68, 68"}, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${Math.max(8, size / 3)}px;
          cursor: pointer;
          transition: all 0.2s ease;
        " 
        onmouseover="this.style.transform='scale(1.3)'"
        onmouseout="this.style.transform='scale(1)'"
        >
          ${property.trustScore}
        </div>
      `

      const popup = new (window as any).mapboxgl.Popup({ offset: 15 }).setHTML(`
        <div style="min-width: 220px; font-family: system-ui;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${property.owner}</h3>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">${property.address}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: #f8f9fa; padding: 8px; border-radius: 6px;">
              <div style="color: #666; font-size: 12px;">Value</div>
              <div style="font-weight: 600; color: #059669;">${property.totalValue}</div>
            </div>
            <div style="background: #f8f9fa; padding: 8px; border-radius: 6px;">
              <div style="color: #666; font-size: 12px;">Trust</div>
              <div style="font-weight: 600;">${property.trustScore}%</div>
            </div>
          </div>
          <button 
            onclick="window.location.href='/property/${property.id}'"
            style="width: 100%; background: #2563eb; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer;"
          >
            View Details
          </button>
        </div>
      `)
      ;new (window as any).mapboxgl.Marker(markerElement)
        .setLngLat([property.coordinates[0], property.coordinates[1]])
        .setPopup(popup)
        .addTo(map.current)
    })
  }

  const toggleProjection = () => {
    if (map.current) {
      const newProjection = !globeProjection
      setGlobeProjection(newProjection)
      map.current.setProjection(newProjection ? "globe" : "mercator")

      if (newProjection) {
        map.current.setFog({
          color: "rgb(186, 210, 235)",
          "high-color": "rgb(36, 92, 223)",
          "horizon-blend": 0.02,
          "space-color": "rgb(11, 11, 25)",
          "star-intensity": 0.6,
        })
      } else {
        map.current.setFog(null)
      }
    }
  }

  const resetView = () => {
    if (map.current) {
      map.current.flyTo({
        center: [-95.7129, 37.0902],
        zoom: 2,
        duration: 2000,
      })
    }
  }

  useEffect(() => {
    loadMapbox()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".map-controls") && !target.closest(".legend-controls")) {
        setShowMapControls(false)
        setShowLegend(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 map-controls">
        <div className="relative">
          <Button
            variant="outline"
            className="bg-white/90 backdrop-blur-md shadow-xl border-white/20 hover:bg-white/95"
            onClick={() => setShowMapControls(!showMapControls)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Map Controls
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          {showMapControls && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 z-[1001]">
              <div className="py-2">
                <button
                  className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    toggleProjection()
                    setShowMapControls(false)
                  }}
                >
                  <Globe className="w-4 h-4 mr-3 text-blue-600" />
                  {globeProjection ? "Switch to Flat Map" : "Switch to Globe View"}
                </button>
                <button
                  className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-green-50 transition-colors"
                  onClick={() => {
                    resetView()
                    setShowMapControls(false)
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-3 text-green-600" />
                  Reset View
                </button>
                <button
                  className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-purple-50 transition-colors"
                  onClick={() => {
                    setShowStateMarkers(!showStateMarkers)
                    setShowMapControls(false)
                  }}
                >
                  <TrendingUp className="w-4 h-4 mr-3 text-purple-600" />
                  {showStateMarkers ? "Hide" : "Show"} State Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] legend-controls">
        <div className="relative">
          <Button
            variant="outline"
            className="bg-white/90 backdrop-blur-md shadow-xl border-white/20 hover:bg-white/95"
            onClick={() => setShowLegend(!showLegend)}
          >
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mr-2"></div>
            Legend
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          {showLegend && (
            <div className="absolute bottom-full left-0 mb-2 w-80 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 z-[1001] p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-gray-800">🌍 State Markets (Live Data)</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white shadow-lg flex items-center justify-center relative">
                        <span className="text-white text-xs font-bold">40</span>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">High Performance Markets</div>
                        <div className="text-xs text-gray-600">90%+ Trust Score • Strong Growth</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-orange-500 border-2 border-white shadow-lg flex items-center justify-center relative">
                        <span className="text-white text-xs font-bold">25</span>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Stable Markets</div>
                        <div className="text-xs text-gray-600">85-89% Trust Score • Steady Growth</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center relative">
                        <span className="text-white text-xs font-bold">9</span>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Emerging Markets</div>
                        <div className="text-xs text-gray-600">Below 85% • High Potential</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold text-sm mb-3 text-gray-800">🏠 Individual Properties</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500 border border-white shadow-sm flex items-center justify-center">
                        <span className="text-white text-xs">95</span>
                      </div>
                      <span className="text-sm">Verified Properties (90%+ Trust)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-orange-500 border border-white shadow-sm flex items-center justify-center">
                        <span className="text-white text-xs">85</span>
                      </div>
                      <span className="text-sm">Standard Properties (80-89% Trust)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500 border border-white shadow-sm flex items-center justify-center">
                        <span className="text-white text-xs">75</span>
                      </div>
                      <span className="text-sm">Caution Required (Below 80%)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    🌍 <strong>Globe View:</strong> Interactive 3D Earth with atmospheric effects
                    <br />📊 <strong>Live Updates:</strong> Real-time market data every 15 seconds
                    <br />🎯 <strong>Click Markers:</strong> Detailed analytics and market insights
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Status */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-xl">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse mx-auto"></div>🌍 LIVE GLOBE •{" "}
          {realTimeStates.length} Markets Tracked
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full min-h-[600px] rounded-lg" />

      {/* Loading Indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg z-[1000] min-h-[600px]">
          <div className="text-center text-white">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-lg font-medium mb-2">Initializing 3D Globe</p>
            <p className="text-sm text-gray-400">Loading real-time market data...</p>
          </div>
        </div>
      )}

      {/* Selected State Info */}
      {selectedState && (
        <Card className="absolute bottom-4 right-4 z-[1000] w-96 bg-white/95 backdrop-blur-md shadow-xl border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{selectedState.state}</h3>
                <p className="text-sm text-gray-600">Real-time Market Intelligence</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className="bg-gradient-to-r from-green-500 to-blue-600 text-white">🌍 LIVE</Badge>
                <span className="text-xs text-gray-500">{selectedState.lastUpdate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                <div className="text-xs text-blue-600 font-medium">Properties</div>
                <div className="font-bold text-blue-800 text-lg">{selectedState.totalProperties.toLocaleString()}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                <div className="text-xs text-green-600 font-medium">Market Value</div>
                <div className="font-bold text-green-800 text-lg">{selectedState.totalValue}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                <div className="text-xs text-purple-600 font-medium">Trust Score</div>
                <div className="font-bold text-purple-800 text-lg">{selectedState.avgTrustScore.toFixed(1)}%</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
                <div className="text-xs text-orange-600 font-medium">Growth</div>
                <div className="font-bold text-orange-800 text-lg">+{selectedState.marketGrowth.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => (window.location.href = `/state/${selectedState.state.toLowerCase().replace(" ", "-")}`)}
              >
                <Users className="w-4 h-4 mr-1" />
                Explore Market
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedState(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

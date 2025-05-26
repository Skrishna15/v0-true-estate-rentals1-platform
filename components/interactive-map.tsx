"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, ChevronDown, Plus, Minus, Maximize2, Settings, TrendingUp, Users } from "lucide-react"

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

interface InteractiveMapProps {
  properties: Property[]
  onPropertySelect?: (property: Property) => void
}

// Real-time state data for all US states
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
  {
    state: "Nevada",
    coordinates: [-116.4194, 38.8026],
    totalProperties: 8934,
    totalValue: "$89.7B",
    avgTrustScore: 82,
    topOwners: 234,
    marketGrowth: 21.3,
    avgRent: 2650,
    verificationRate: 87.3,
    scamsPrevented: 189,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Oregon",
    coordinates: [-120.5542, 43.8041],
    totalProperties: 9876,
    totalValue: "$98.5B",
    avgTrustScore: 91,
    topOwners: 267,
    marketGrowth: 13.4,
    avgRent: 2780,
    verificationRate: 95.1,
    scamsPrevented: 223,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Utah",
    coordinates: [-111.891, 39.321],
    totalProperties: 7654,
    totalValue: "$76.8B",
    avgTrustScore: 89,
    topOwners: 198,
    marketGrowth: 17.2,
    avgRent: 2340,
    verificationRate: 93.7,
    scamsPrevented: 167,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Tennessee",
    coordinates: [-86.7816, 35.7478],
    totalProperties: 11234,
    totalValue: "$98.7B",
    avgTrustScore: 85,
    topOwners: 289,
    marketGrowth: 16.8,
    avgRent: 1980,
    verificationRate: 89.8,
    scamsPrevented: 234,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Virginia",
    coordinates: [-78.1694, 37.4316],
    totalProperties: 13456,
    totalValue: "$145.6B",
    avgTrustScore: 88,
    topOwners: 356,
    marketGrowth: 9.8,
    avgRent: 2560,
    verificationRate: 92.1,
    scamsPrevented: 289,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  // Adding more states for comprehensive coverage
  {
    state: "Pennsylvania",
    coordinates: [-77.1945, 41.2033],
    totalProperties: 18765,
    totalValue: "$189.4B",
    avgTrustScore: 87,
    topOwners: 467,
    marketGrowth: 6.8,
    avgRent: 2340,
    verificationRate: 91.5,
    scamsPrevented: 445,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Ohio",
    coordinates: [-82.7649, 40.3888],
    totalProperties: 16234,
    totalValue: "$134.7B",
    avgTrustScore: 86,
    topOwners: 398,
    marketGrowth: 5.4,
    avgRent: 1890,
    verificationRate: 90.2,
    scamsPrevented: 356,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Michigan",
    coordinates: [-84.5467, 43.3266],
    totalProperties: 14567,
    totalValue: "$112.3B",
    avgTrustScore: 84,
    topOwners: 334,
    marketGrowth: 4.7,
    avgRent: 1780,
    verificationRate: 88.9,
    scamsPrevented: 289,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Massachusetts",
    coordinates: [-71.5376, 42.2373],
    totalProperties: 12890,
    totalValue: "$198.7B",
    avgTrustScore: 92,
    topOwners: 345,
    marketGrowth: 8.9,
    avgRent: 3890,
    verificationRate: 95.8,
    scamsPrevented: 334,
    lastUpdate: new Date().toLocaleTimeString(),
  },
  {
    state: "Maryland",
    coordinates: [-76.2859, 39.0639],
    totalProperties: 10234,
    totalValue: "$156.8B",
    avgTrustScore: 89,
    topOwners: 278,
    marketGrowth: 7.8,
    avgRent: 2890,
    verificationRate: 93.4,
    scamsPrevented: 234,
    lastUpdate: new Date().toLocaleTimeString(),
  },
]

export function InteractiveMap({ properties, onPropertySelect }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [selectedState, setSelectedState] = useState<StateMarker | null>(null)
  const [mapStyle, setMapStyle] = useState("OpenStreetMap")
  const [showStateMarkers, setShowStateMarkers] = useState(true)
  const [realTimeStates, setRealTimeStates] = useState(stateMarkers)
  const [showMapControls, setShowMapControls] = useState(false)
  const [showLegend, setShowLegend] = useState(false)

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
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const loadLeaflet = async () => {
    if (typeof window === "undefined") return

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link")
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.rel = "stylesheet"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)
    }

    // Load Leaflet JS
    if (!(window as any).L) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = ""
      script.onload = () => initializeMap()
      script.onerror = () => console.error("Failed to load Leaflet")
      document.head.appendChild(script)
    } else {
      initializeMap()
    }
  }

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return

    const L = (window as any).L

    // Initialize map centered on North America
    map.current = L.map(mapContainer.current, {
      center: [39.8283, -98.5795], // Center of US
      zoom: 4,
      zoomControl: false, // We'll add custom controls
    })

    // Add tile layer (OpenStreetMap)
    const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    })
    tileLayer.addTo(map.current)

    // Add property markers
    addPropertyMarkers(L)

    // Add state markers
    if (showStateMarkers) {
      addStateMarkers(L)
    }

    setMapLoaded(true)
  }

  const addStateMarkers = (L: any) => {
    if (!map.current) return

    realTimeStates.forEach((state) => {
      // Calculate marker size based on total properties
      const size = Math.max(30, Math.min(80, state.totalProperties / 500))

      // Create custom icon based on trust score
      const getMarkerColor = (trustScore: number) => {
        if (trustScore >= 90) return "#10b981" // Green
        if (trustScore >= 85) return "#f59e0b" // Orange
        return "#ef4444" // Red
      }

      const color = getMarkerColor(state.avgTrustScore)

      // Create state marker with pulsing animation
      const stateIcon = L.divIcon({
        className: "state-marker",
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(${color === "#10b981" ? "16, 185, 129" : color === "#f59e0b" ? "245, 158, 11" : "239, 68, 68"}, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${Math.max(8, size / 6)}px;
            cursor: pointer;
            position: relative;
            animation: pulse 2s infinite;
          " 
          onmouseover="this.style.transform='scale(1.1)'"
          onmouseout="this.style.transform='scale(1)'"
          >
            <div style="text-align: center; line-height: 1;">
              <div style="font-size: ${Math.max(6, size / 8)}px;">${state.state.substring(0, 2).toUpperCase()}</div>
              <div style="font-size: ${Math.max(4, size / 10)}px;">${state.totalProperties.toLocaleString()}</div>
            </div>
            <div style="
              position: absolute;
              top: -2px;
              right: -2px;
              width: 12px;
              height: 12px;
              background: #22c55e;
              border: 2px solid white;
              border-radius: 50%;
              animation: blink 1s infinite;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% { box-shadow: 0 0 20px rgba(${color === "#10b981" ? "16, 185, 129" : color === "#f59e0b" ? "245, 158, 11" : "239, 68, 68"}, 0.6); }
              50% { box-shadow: 0 0 30px rgba(${color === "#10b981" ? "16, 185, 129" : color === "#f59e0b" ? "245, 158, 11" : "239, 68, 68"}, 0.8); }
              100% { box-shadow: 0 0 20px rgba(${color === "#10b981" ? "16, 185, 129" : color === "#f59e0b" ? "245, 158, 11" : "239, 68, 68"}, 0.6); }
            }
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0.3; }
            }
          </style>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      // Create state marker
      const marker = L.marker([state.coordinates[1], state.coordinates[0]], {
        icon: stateIcon,
      }).addTo(map.current)

      // Create detailed popup content for states
      const popupContent = `
        <div style="min-width: 320px; font-family: system-ui;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1f2937;">${state.state}</h3>
            <div style="display: flex; flex-direction: column; align-items: end; gap: 4px;">
              <span style="
                background: ${color}; 
                color: white; 
                padding: 3px 8px; 
                border-radius: 12px; 
                font-size: 11px; 
                font-weight: 600;
              ">
                ${state.avgTrustScore.toFixed(1)}% Trust
              </span>
              <span style="
                background: #22c55e; 
                color: white; 
                padding: 2px 6px; 
                border-radius: 8px; 
                font-size: 10px; 
                font-weight: 500;
              ">
                🟢 LIVE
              </span>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 10px; border-radius: 8px; border-left: 3px solid #10b981;">
              <div style="color: #6b7280; font-size: 11px; font-weight: 500;">Total Properties</div>
              <div style="font-weight: 700; color: #059669; font-size: 16px;">${state.totalProperties.toLocaleString()}</div>
            </div>
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 10px; border-radius: 8px; border-left: 3px solid #3b82f6;">
              <div style="color: #6b7280; font-size: 11px; font-weight: 500;">Market Value</div>
              <div style="font-weight: 700; color: #2563eb; font-size: 16px;">${state.totalValue}</div>
            </div>
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 10px; border-radius: 8px; border-left: 3px solid #f59e0b;">
              <div style="color: #6b7280; font-size: 11px; font-weight: 500;">Avg Rent</div>
              <div style="font-weight: 700; color: #d97706; font-size: 16px;">$${state.avgRent.toLocaleString()}</div>
            </div>
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 10px; border-radius: 8px; border-left: 3px solid #8b5cf6;">
              <div style="color: #6b7280; font-size: 11px; font-weight: 500;">Growth Rate</div>
              <div style="font-weight: 700; color: #7c3aed; font-size: 16px;">+${state.marketGrowth.toFixed(1)}%</div>
            </div>
          </div>

          <div style="background: #f9fafb; padding: 10px; border-radius: 8px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 12px; color: #6b7280;">Verification Rate:</span>
              <span style="font-size: 12px; font-weight: 600; color: #059669;">${state.verificationRate.toFixed(1)}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 12px; color: #6b7280;">Top Owners:</span>
              <span style="font-size: 12px; font-weight: 600; color: #2563eb;">${state.topOwners.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 12px; color: #6b7280;">Scams Prevented:</span>
              <span style="font-size: 12px; font-weight: 600; color: #dc2626;">${state.scamsPrevented.toLocaleString()}</span>
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
              padding: 10px 16px; 
              border-radius: 8px; 
              font-size: 13px; 
              font-weight: 600; 
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
            "
            onmouseover="this.style.background='linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'"
            onmouseout="this.style.background='linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'"
          >
            View ${state.state} Market Details
          </button>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 350,
        className: "state-popup",
      })

      // Handle state marker click
      marker.on("click", () => {
        setSelectedState(state)
      })
    })
  }

  const addPropertyMarkers = (L: any) => {
    if (!map.current) return

    properties.forEach((property) => {
      // Calculate marker size based on total value
      const value = Number.parseFloat(property.totalValue.replace(/[$M]/g, "")) || 1
      const size = Math.max(20, Math.min(60, value * 3)) // Size between 20-60px

      // Create custom icon based on trust score and value
      const getMarkerColor = (trustScore: number) => {
        if (trustScore >= 90) return "#10b981" // Green
        if (trustScore >= 80) return "#f59e0b" // Orange
        return "#ef4444" // Red
      }

      const color = getMarkerColor(property.trustScore)

      // Create custom HTML marker
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${Math.max(10, size / 4)}px;
            cursor: pointer;
            transition: all 0.2s ease;
          " 
          onmouseover="this.style.transform='scale(1.2)'"
          onmouseout="this.style.transform='scale(1)'"
          >
            ${property.properties || property.trustScore}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      // Create marker
      const marker = L.marker([property.coordinates[1], property.coordinates[0]], {
        icon: customIcon,
      }).addTo(map.current)

      // Create popup content
      const popupContent = `
        <div style="min-width: 250px; font-family: system-ui;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${property.owner}</h3>
            <span style="
              background: ${color}; 
              color: white; 
              padding: 2px 8px; 
              border-radius: 12px; 
              font-size: 12px; 
              font-weight: 500;
            ">
              ${property.trustScore}% Trust
            </span>
          </div>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">${property.address}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: #f8f9fa; padding: 8px; border-radius: 6px;">
              <div style="color: #666; font-size: 12px;">Portfolio Value</div>
              <div style="font-weight: 600; color: #059669;">${property.totalValue}</div>
            </div>
            <div style="background: #f8f9fa; padding: 8px; border-radius: 6px;">
              <div style="color: #666; font-size: 12px;">Properties</div>
              <div style="font-weight: 600;">${property.properties || 1}</div>
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            ${
              property.verified
                ? '<div style="color: #059669; font-size: 14px; display: flex; align-items: center; gap: 4px;">✓ Verified Owner</div>'
                : '<div style="color: #dc2626; font-size: 14px; display: flex; align-items: center; gap: 4px;">⚠ Unverified</div>'
            }
          </div>
          <button 
            onclick="window.location.href='/property/${property.id}'"
            style="
              width: 100%; 
              background: #2563eb; 
              color: white; 
              border: none; 
              padding: 8px 16px; 
              border-radius: 6px; 
              font-size: 14px; 
              font-weight: 500; 
              cursor: pointer;
            "
            onmouseover="this.style.background='#1d4ed8'"
            onmouseout="this.style.background='#2563eb'"
          >
            View Full Details
          </button>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: "custom-popup",
      })

      // Handle marker click
      marker.on("click", () => {
        setSelectedProperty(property)
        onPropertySelect?.(property)
      })
    })
  }

  const changeMapStyle = (style: string) => {
    if (!map.current) return

    const L = (window as any).L

    // Remove existing tile layers
    map.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.current.removeLayer(layer)
      }
    })

    // Add new tile layer based on style
    let tileLayer
    switch (style) {
      case "Satellite":
        tileLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: "© Esri",
          },
        )
        break
      case "Terrain":
        tileLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenTopoMap",
        })
        break
      case "Dark":
        tileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: "© CartoDB",
        })
        break
      default: // OpenStreetMap
        tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        })
    }

    tileLayer.addTo(map.current)
    setMapStyle(style)
  }

  const toggleStateMarkers = () => {
    setShowStateMarkers(!showStateMarkers)
    if (map.current) {
      // Reinitialize map with/without state markers
      const L = (window as any).L
      map.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.current.removeLayer(layer)
        }
      })
      addPropertyMarkers(L)
      if (!showStateMarkers) {
        addStateMarkers(L)
      }
    }
  }

  const zoomIn = () => {
    if (map.current) map.current.zoomIn()
  }

  const zoomOut = () => {
    if (map.current) map.current.zoomOut()
  }

  const resetView = () => {
    if (map.current) {
      map.current.setView([39.8283, -98.5795], 4)
    }
  }

  useEffect(() => {
    loadLeaflet()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update state markers when real-time data changes
  useEffect(() => {
    if (map.current && showStateMarkers) {
      const L = (window as any).L
      // Remove existing state markers
      map.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker && layer.options.icon?.options?.className === "state-marker") {
          map.current.removeLayer(layer)
        }
      })
      // Add updated state markers
      addStateMarkers(L)
    }
  }, [realTimeStates, showStateMarkers])

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
    <div className="relative w-full h-full">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 map-controls">
        <div className="relative">
          <Button
            variant="outline"
            className="bg-white/95 backdrop-blur-sm shadow-lg"
            onClick={() => setShowMapControls(!showMapControls)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Map Controls
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          {showMapControls && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-[1001]">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    changeMapStyle("OpenStreetMap")
                    setShowMapControls(false)
                  }}
                >
                  Standard Map
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    changeMapStyle("Satellite")
                    setShowMapControls(false)
                  }}
                >
                  Satellite View
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    changeMapStyle("Terrain")
                    setShowMapControls(false)
                  }}
                >
                  Terrain Map
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    changeMapStyle("Dark")
                    setShowMapControls(false)
                  }}
                >
                  Dark Theme
                </button>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className={`bg-white/95 backdrop-blur-sm shadow-lg ${showStateMarkers ? "bg-blue-50 border-blue-200" : ""}`}
          onClick={toggleStateMarkers}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {showStateMarkers ? "Hide" : "Show"} State Data
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1">
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 p-0 bg-white/95 backdrop-blur-sm shadow-lg"
          onClick={zoomIn}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 p-0 bg-white/95 backdrop-blur-sm shadow-lg"
          onClick={zoomOut}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 p-0 bg-white/95 backdrop-blur-sm shadow-lg"
          onClick={resetView}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] legend-controls">
        <div className="relative">
          <Button
            variant="outline"
            className="bg-white/95 backdrop-blur-sm shadow-lg"
            onClick={() => setShowLegend(!showLegend)}
          >
            <Info className="w-4 h-4 mr-2" />
            Legend
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          {showLegend && (
            <div className="absolute bottom-full left-0 mb-1 w-80 bg-white rounded-md shadow-lg border z-[1001] p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">State Markers (Real-time)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-sm">90%+ Trust (High Performance)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-sm">85-89% Trust (Good Performance)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-sm">Below 85% (Needs Attention)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold text-sm mb-2">Property Markers</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                      <span className="text-sm">90%+ Trust (Highly Verified)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
                      <span className="text-sm">80-89% Trust (Verified)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                      <span className="text-sm">Below 80% (Caution)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600">
                    • State markers show live data with pulsing animation • Green dot indicates real-time updates •
                    Marker size reflects market activity • Click any marker for detailed analytics
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          LIVE DATA • {realTimeStates.length} States Tracked
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full min-h-[400px] rounded-lg" />

      {/* Loading Indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-[1000] min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading geographic map with real-time state data...</p>
          </div>
        </div>
      )}

      {/* Selected Property Info */}
      {selectedProperty && (
        <Card className="absolute bottom-4 right-4 z-[1000] w-80 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{selectedProperty.owner}</h3>
              <Badge
                className={
                  selectedProperty.trustScore >= 90
                    ? "bg-green-500"
                    : selectedProperty.trustScore >= 80
                      ? "bg-orange-500"
                      : "bg-red-500"
                }
              >
                {selectedProperty.trustScore}% Trust
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{selectedProperty.address}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Portfolio Value:</span>
                <div className="font-semibold text-green-600">{selectedProperty.totalValue}</div>
              </div>
              <div>
                <span className="text-gray-500">Properties:</span>
                <div className="font-semibold">{selectedProperty.properties || 1}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => (window.location.href = `/property/${selectedProperty.id}`)}
              >
                View Details
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedProperty(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected State Info */}
      {selectedState && (
        <Card className="absolute bottom-4 right-4 z-[1000] w-96 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{selectedState.state}</h3>
                <p className="text-sm text-gray-600">State Market Overview</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className="bg-green-500 text-white">🟢 LIVE</Badge>
                <span className="text-xs text-gray-500">{selectedState.lastUpdate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-xs text-blue-600">Total Properties</div>
                <div className="font-bold text-blue-800">{selectedState.totalProperties.toLocaleString()}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-xs text-green-600">Market Value</div>
                <div className="font-bold text-green-800">{selectedState.totalValue}</div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-xs text-purple-600">Avg Trust Score</div>
                <div className="font-bold text-purple-800">{selectedState.avgTrustScore.toFixed(1)}%</div>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <div className="text-xs text-orange-600">Growth Rate</div>
                <div className="font-bold text-orange-800">+{selectedState.marketGrowth.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => (window.location.href = `/state/${selectedState.state.toLowerCase().replace(" ", "-")}`)}
              >
                <Users className="w-4 h-4 mr-1" />
                View State Details
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedState(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 z-[1000] text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        © OpenStreetMap contributors
      </div>
    </div>
  )
}

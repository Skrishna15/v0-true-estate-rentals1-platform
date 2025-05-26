"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, RotateCcw, Settings, TrendingUp, Users, Globe, MapPin } from "lucide-react"

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

interface SecureGlobeMapProps {
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

export function SecureGlobeMap({ properties, onPropertySelect }: SecureGlobeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [selectedState, setSelectedState] = useState<StateMarker | null>(null)
  const [showMapControls, setShowMapControls] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [showStateMarkers, setShowStateMarkers] = useState(true)
  const [realTimeStates, setRealTimeStates] = useState(stateMarkers)
  const [globeView, setGlobeView] = useState(true)
  const [rotation, setRotation] = useState(0)

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

  // Auto-rotation effect
  useEffect(() => {
    if (!globeView) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360)
    }, 100)

    return () => clearInterval(interval)
  }, [globeView])

  // Convert lat/lng to SVG coordinates
  const projectCoordinates = (lng: number, lat: number, width: number, height: number) => {
    if (globeView) {
      // Simple globe projection with rotation
      const rotatedLng = lng + rotation
      const x = (((rotatedLng + 180) % 360) / 360) * width
      const y = ((90 - lat) / 180) * height

      // Apply spherical distortion
      const centerX = width / 2
      const centerY = height / 2
      const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
      const maxDistance = Math.min(width, height) / 2

      if (distanceFromCenter > maxDistance * 0.9) {
        // Points near the edge should be less visible (behind the globe)
        return { x, y, visible: false }
      }

      return { x, y, visible: true }
    } else {
      // Flat map projection
      const x = ((lng + 180) / 360) * width
      const y = ((90 - lat) / 180) * height
      return { x, y, visible: true }
    }
  }

  const getMarkerColor = (trustScore: number) => {
    if (trustScore >= 90) return "#10b981"
    if (trustScore >= 85) return "#f59e0b"
    return "#ef4444"
  }

  const handleStateClick = (state: StateMarker) => {
    setSelectedState(state)
  }

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
    onPropertySelect?.(property)
  }

  const resetView = () => {
    setRotation(0)
    setSelectedState(null)
    setSelectedProperty(null)
  }

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
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
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
                    setGlobeView(!globeView)
                    setShowMapControls(false)
                  }}
                >
                  <Globe className="w-4 h-4 mr-3 text-blue-600" />
                  {globeView ? "Switch to Flat Map" : "Switch to Globe View"}
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
                    🌍 <strong>Secure Globe:</strong> No external API dependencies
                    <br />📊 <strong>Live Updates:</strong> Real-time market data every 15 seconds
                    <br />🎯 <strong>Click Markers:</strong> Detailed analytics and market insights
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Real-time Status */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg border border-white/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Market Data • {realTimeStates.length} States
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="w-full h-full min-h-[600px] relative">
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 800 500"
          style={{
            background: globeView
              ? `linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)`
              : "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
          }}
        >
          {/* Clean Background */}
          {globeView && (
            <>
              <defs>
                <radialGradient id="cleanGlobeGradient" cx="0.4" cy="0.3">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
                  <stop offset="70%" stopColor="rgba(59, 130, 246, 0.3)" />
                  <stop offset="100%" stopColor="rgba(30, 58, 138, 0.8)" />
                </radialGradient>
              </defs>

              {/* Simple Globe Outline */}
              <circle
                cx="400"
                cy="250"
                r="180"
                fill="url(#cleanGlobeGradient)"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />

              {/* Minimal Grid Lines */}
              {Array.from({ length: 4 }, (_, i) => (
                <line
                  key={`lat-${i}`}
                  x1="220"
                  y1={250 + (i - 2) * 60}
                  x2="580"
                  y2={250 + (i - 2) * 60}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="0.5"
                />
              ))}
              {Array.from({ length: 6 }, (_, i) => (
                <line
                  key={`lng-${i}`}
                  x1={400 + (i - 3) * 60}
                  y1="70"
                  x2={400 + (i - 3) * 60}
                  y2="430"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="0.5"
                />
              ))}
            </>
          )}

          {/* State Markers - Clean and Separated */}
          {showStateMarkers &&
            realTimeStates.map((state, index) => {
              const projected = projectCoordinates(state.coordinates[0], state.coordinates[1], 800, 500)
              if (!projected.visible && globeView) return null

              // Spread markers out more evenly
              const offsetX = ((index % 3) - 1) * 40
              const offsetY = ((Math.floor(index / 3) % 3) - 1) * 30
              const finalX = projected.x + offsetX
              const finalY = projected.y + offsetY

              const size = Math.max(15, Math.min(35, state.totalProperties / 2000))
              const color = getMarkerColor(state.avgTrustScore)

              return (
                <g key={state.state}>
                  {/* Clean marker circle */}
                  <circle
                    cx={finalX}
                    cy={finalY}
                    r={size}
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleStateClick(state)}
                    style={{
                      filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))`,
                    }}
                  />

                  {/* Property count text */}
                  <text
                    x={finalX}
                    y={finalY + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {Math.floor(state.totalProperties / 1000)}K
                  </text>

                  {/* State label */}
                  <text
                    x={finalX}
                    y={finalY + size + 15}
                    textAnchor="middle"
                    fill={globeView ? "white" : "#374151"}
                    fontSize="8"
                    fontWeight="500"
                    className="pointer-events-none"
                  >
                    {state.state.split(" ")[0]}
                  </text>
                </g>
              )
            })}

          {/* Individual Property Markers - Smaller and Cleaner */}
          {properties.map((property, index) => {
            const projected = projectCoordinates(property.coordinates[0], property.coordinates[1], 800, 500)
            if (!projected.visible && globeView) return null

            // Offset individual properties slightly to avoid overlap
            const offsetX = (index % 2) * 8 - 4
            const offsetY = (Math.floor(index / 2) % 2) * 8 - 4

            const size = 8
            const color = getMarkerColor(property.trustScore)

            return (
              <g key={property.id}>
                <circle
                  cx={projected.x + offsetX}
                  cy={projected.y + offsetY}
                  r={size}
                  fill={color}
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-pointer hover:scale-125 transition-transform"
                  onClick={() => handlePropertyClick(property)}
                  style={{
                    filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.2))`,
                  }}
                />
              </g>
            )
          })}
        </svg>
      </div>

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

      {/* Selected Property Info */}
      {selectedProperty && (
        <Card className="absolute top-20 right-4 z-[1000] w-80 bg-white/95 backdrop-blur-md shadow-xl border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{selectedProperty.owner}</h3>
                <p className="text-sm text-gray-600">{selectedProperty.address}</p>
              </div>
              <Badge className={`${getMarkerColor(selectedProperty.trustScore)} text-white`}>
                {selectedProperty.trustScore}% Trust
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                <div className="text-xs text-green-600 font-medium">Value</div>
                <div className="font-bold text-green-800">{selectedProperty.totalValue}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                <div className="text-xs text-blue-600 font-medium">Type</div>
                <div className="font-bold text-blue-800">{selectedProperty.propertyType || "Residential"}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => (window.location.href = `/property/${selectedProperty.id}`)}
              >
                <MapPin className="w-4 h-4 mr-1" />
                View Details
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedProperty(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

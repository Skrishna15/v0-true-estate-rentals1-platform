"use client"

import { useState } from "react"
import { MapPin, Building, Shield, Eye, Heart, ZoomIn, ZoomOut, Maximize2, Navigation } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Property {
  id: string
  coordinates: [number, number]
  owner: string
  value: string
  trustScore: number
  address: string
  sqft: number
  beds: number
  baths: number
  status: "verified" | "unverified"
}

interface EnhancedMapProps {
  properties: Property[]
  onPropertySelect?: (property: Property) => void
  showSavedProperties?: boolean
  showLiveIntelligence?: boolean
}

export function EnhancedMap({
  properties,
  onPropertySelect,
  showSavedProperties = true,
  showLiveIntelligence = true,
}: EnhancedMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [mapView, setMapView] = useState<"property" | "wealth">("property")
  const [savedProperties, setSavedProperties] = useState<string[]>([])

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property.id)
    onPropertySelect?.(property)
  }

  const handleSaveProperty = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId],
    )
  }

  const sampleProperty = {
    id: "sample",
    owner: "Sample Owner",
    address: "las vegas, San Francisco, CA",
    value: "$790,857",
    trustScore: 99,
    sqft: 1341,
    beds: 2,
    baths: 2,
    status: "unverified" as const,
    coordinates: [37.7749, -122.4194] as [number, number],
  }

  return (
    <div className="flex h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant={mapView === "property" ? "default" : "outline"}
            onClick={() => setMapView("property")}
            size="sm"
          >
            Property View
          </Button>
          <Button variant={mapView === "wealth" ? "default" : "outline"} onClick={() => setMapView("wealth")} size="sm">
            Wealth Heatmap
          </Button>
        </div>

        {/* Map Styles and Filters */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          <Button variant="outline" size="sm">
            <Building className="w-4 h-4 mr-2" />
            Map Styles
          </Button>
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Filters (6)
          </Button>
          <Badge className="bg-green-500 text-white">3D Globe • 6/6 Properties</Badge>
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

          {/* Sample Property Marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ top: "50%", left: "50%" }}
            onClick={() => handlePropertyClick(sampleProperty)}
          >
            {/* Property Marker */}
            <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform">
              <Building className="w-3 h-3 text-white m-auto mt-0.5" />
            </div>

            {/* Property Info Popup */}
            {selectedProperty === sampleProperty.id && (
              <Card className="absolute top-8 left-1/2 transform -translate-x-1/2 w-80 z-20 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{sampleProperty.owner}</h3>
                      <p className="text-sm text-gray-600">{sampleProperty.address}</p>
                      <Badge variant="destructive" className="mt-1">
                        {sampleProperty.status === "unverified" ? "Unverified" : "Verified"}
                      </Badge>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProperty(null)
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Value</span>
                      <div className="font-semibold text-green-600">{sampleProperty.value}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Trust Score</span>
                      <div className="font-semibold">{sampleProperty.trustScore}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-sm text-gray-500">Sq ft</div>
                      <div className="font-semibold">{sampleProperty.sqft.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Beds</div>
                      <div className="font-semibold">{sampleProperty.beds}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Baths</div>
                      <div className="font-semibold">{sampleProperty.baths}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      Zoom to Property
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Street View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map Attribution */}
          <div className="absolute bottom-2 left-2 text-xs text-gray-500">
            © Mapbox © OpenStreetMap <span className="underline cursor-pointer">Improve this map</span>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button variant="outline" size="sm">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow text-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Verified (90%+)</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Caution (80-89%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Risk (&lt;80%)</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        {showLiveIntelligence && (
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Live Market Intelligence
            </h3>
            <p className="text-sm text-gray-600 mb-4">Real-time market data and trends</p>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Portfolio Value</span>
                <span className="font-semibold text-green-600">$63.7M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Verified Properties</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trusted Owners</span>
                <span className="font-semibold text-blue-600">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Trust Score</span>
                <span className="font-semibold text-green-600">91%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Scams Prevented</span>
                <span className="font-semibold text-red-600">534</span>
              </div>
            </div>
          </div>
        )}

        {showSavedProperties && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Saved Properties (0)
              </h3>
              <Button variant="outline" size="sm">
                <Building className="w-4 h-4 mr-2" />
                Save Current
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Your bookmarked properties and notes</p>

            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No saved properties yet</p>
              <p className="text-sm text-gray-400">Click the heart icon on any property to save it</p>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Saved Views (0)
              </h4>
              <p className="text-sm text-gray-600 mb-4">Your saved map configurations</p>

              <div className="text-center py-4">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No saved views yet</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

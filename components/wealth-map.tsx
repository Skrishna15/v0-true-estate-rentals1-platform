"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Search, Filter, Bookmark, Download, Layers, ZoomIn, ZoomOut, Maximize2, Star, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface Property {
  _id: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  details: {
    price: number
    size: number
    bedrooms: number
    bathrooms: number
    propertyType: string
  }
  images: string[]
  transparencyScore: number
  ratings: {
    averageRating: number
    totalReviews: number
  }
  owner: {
    name: string
    verified: boolean
    ownerProfile?: {
      netWorth: number
      trustMetrics: {
        averageRating: number
        totalReviews: number
      }
    }
  }
  bookmarked?: boolean
}

interface MapFilters {
  search: string
  city: string
  state: string
  priceRange: [number, number]
  sizeRange: [number, number]
  propertyTypes: string[]
  minRating: number
  verifiedOnly: boolean
  minTransparency: number
}

export function WealthMap() {
  const { data: session } = useSession()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets")
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState<MapFilters>({
    search: "",
    city: "",
    state: "",
    priceRange: [0, 5000000],
    sizeRange: [0, 10000],
    propertyTypes: [],
    minRating: 0,
    verifiedOnly: false,
    minTransparency: 0,
  })

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const initializeMap = async () => {
      try {
        const response = await fetch("/api/mapbox-token")
        const { token } = await response.json()

        mapboxgl.accessToken = token

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [-98.5795, 39.8283], // Center of US
          zoom: 4,
        })

        map.current.on("load", () => {
          setMapLoaded(true)
        })

        map.current.on("click", (e) => {
          const features = map.current!.queryRenderedFeatures(e.point, {
            layers: ["property-points"],
          })

          if (features.length > 0) {
            const property = properties.find((p) => p._id === features[0].properties?.id)
            if (property) {
              setSelectedProperty(property)
            }
          }
        })
      } catch (error) {
        console.error("Failed to initialize map:", error)
      }
    }

    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Load properties
  useEffect(() => {
    fetchProperties()
  }, [filters])

  // Update map when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded || !properties.length) return

    updateMapData()
  }, [properties, mapLoaded])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: filters.search,
        city: filters.city,
        state: filters.state,
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        propertyType: filters.propertyTypes.join(","),
        minRating: filters.minRating.toString(),
        verified: filters.verifiedOnly.toString(),
        limit: "100",
      })

      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()

      if (data.success) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateMapData = () => {
    if (!map.current) return

    const geojsonData = {
      type: "FeatureCollection" as const,
      features: properties.map((property) => ({
        type: "Feature" as const,
        properties: {
          id: property._id,
          price: property.details.price,
          transparencyScore: property.transparencyScore,
          rating: property.ratings.averageRating,
          verified: property.owner.verified,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [property.coordinates.lng, property.coordinates.lat],
        },
      })),
    }

    // Remove existing layers and sources
    if (map.current.getLayer("property-points")) {
      map.current.removeLayer("property-points")
    }
    if (map.current.getLayer("property-clusters")) {
      map.current.removeLayer("property-clusters")
    }
    if (map.current.getLayer("cluster-count")) {
      map.current.removeLayer("cluster-count")
    }
    if (map.current.getSource("properties")) {
      map.current.removeSource("properties")
    }

    // Add source
    map.current.addSource("properties", {
      type: "geojson",
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    })

    // Add cluster layer
    map.current.addLayer({
      id: "property-clusters",
      type: "circle",
      source: "properties",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    })

    // Add cluster count layer
    map.current.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "properties",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    })

    // Add individual points layer
    map.current.addLayer({
      id: "property-points",
      type: "circle",
      source: "properties",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": [
          "case",
          [">=", ["get", "transparencyScore"], 80],
          "#10b981", // Green for high transparency
          [">=", ["get", "transparencyScore"], 60],
          "#f59e0b", // Yellow for medium
          "#ef4444", // Red for low transparency
        ],
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 4, 10, 8, 15, 12],
        "circle-stroke-width": 2,
        "circle-stroke-color": ["case", ["get", "verified"], "#ffffff", "#000000"],
      },
    })
  }

  const toggleMapStyle = () => {
    if (!map.current) return

    const newStyle = mapStyle === "streets" ? "satellite" : "streets"
    const styleUrl =
      newStyle === "streets" ? "mapbox://styles/mapbox/streets-v12" : "mapbox://styles/mapbox/satellite-v9"

    map.current.setStyle(styleUrl)
    setMapStyle(newStyle)

    // Re-add data after style change
    map.current.once("styledata", () => {
      updateMapData()
    })
  }

  const handleBookmark = async (propertyId: string) => {
    if (!session) return

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      })

      if (response.ok) {
        setProperties((prev) => prev.map((p) => (p._id === propertyId ? { ...p, bookmarked: true } : p)))
      }
    } catch (error) {
      console.error("Failed to bookmark property:", error)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch("/api/export/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties: properties.map((p) => p._id),
          format: "csv",
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "properties-export.csv"
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Failed to export data:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant={mapStyle === "streets" ? "default" : "outline"} onClick={toggleMapStyle} size="sm">
              <Layers className="w-4 h-4 mr-2" />
              {mapStyle === "streets" ? "Streets" : "Satellite"}
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg px-3 py-1 shadow">
              <span className="text-sm font-medium">{loading ? "Loading..." : `${properties.length} properties`}</span>
            </div>
            <Button variant="outline" onClick={exportData} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by address, owner, or city..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="pl-10 bg-white shadow-lg"
            />
          </div>
        </div>

        {/* Map */}
        <div ref={mapContainer} className="w-full h-full" />

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={() => map.current?.zoomIn()}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => map.current?.zoomOut()}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Transparency Score</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>High (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Low (&lt;60%)</span>
            </div>
          </div>
        </div>

        {/* Property Detail Popup */}
        {selectedProperty && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <Card className="w-96 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{selectedProperty.address.street}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {selectedProperty.address.city}, {selectedProperty.address.state}{" "}
                      {selectedProperty.address.zipCode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {session && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBookmark(selectedProperty._id)}
                        disabled={selectedProperty.bookmarked}
                      >
                        <Bookmark className={`w-4 h-4 ${selectedProperty.bookmarked ? "fill-current" : ""}`} />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setSelectedProperty(null)}>
                      ×
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Image */}
                <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={selectedProperty.images[0] || "/placeholder.svg?height=200&width=400&query=property"}
                    alt={selectedProperty.address.street}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Price</span>
                    <div className="font-semibold text-green-600">{formatCurrency(selectedProperty.details.price)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Transparency</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{selectedProperty.transparencyScore}%</span>
                      <Badge
                        className={
                          selectedProperty.transparencyScore >= 80
                            ? "bg-green-500 text-white"
                            : selectedProperty.transparencyScore >= 60
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                        }
                      >
                        {selectedProperty.transparencyScore >= 80
                          ? "High"
                          : selectedProperty.transparencyScore >= 60
                            ? "Medium"
                            : "Low"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Size</span>
                    <div className="font-semibold">{selectedProperty.details.size.toLocaleString()} sq ft</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Type</span>
                    <div className="font-semibold capitalize">{selectedProperty.details.propertyType}</div>
                  </div>
                </div>

                <Separator />

                {/* Owner Information */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Owner Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Name</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedProperty.owner.name}</span>
                        {selectedProperty.owner.verified && <Badge className="bg-green-500 text-white">Verified</Badge>}
                      </div>
                    </div>
                    {selectedProperty.owner.ownerProfile && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Est. Net Worth</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(selectedProperty.owner.ownerProfile.netWorth)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Owner Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current text-yellow-500" />
                            <span className="font-medium">
                              {selectedProperty.owner.ownerProfile.trustMetrics.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({selectedProperty.owner.ownerProfile.trustMetrics.totalReviews})
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Property Rating */}
                {selectedProperty.ratings.totalReviews > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Property Rating</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(selectedProperty.ratings.averageRating)
                                  ? "fill-current text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{selectedProperty.ratings.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({selectedProperty.ratings.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    Contact Owner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Filters Sidebar */}
      {showFilters && (
        <div className="w-80 bg-white border-l shadow-lg overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                ×
              </Button>
            </div>

            <div className="space-y-6">
              {/* Location Filters */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="space-y-2">
                  <Input
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                  />
                  <Select
                    value={filters.state}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, state: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
                  max={5000000}
                  min={0}
                  step={50000}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(filters.priceRange[0])}</span>
                  <span>{formatCurrency(filters.priceRange[1])}</span>
                </div>
              </div>

              {/* Property Size */}
              <div>
                <label className="text-sm font-medium mb-2 block">Size (sq ft)</label>
                <Slider
                  value={filters.sizeRange}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, sizeRange: value as [number, number] }))}
                  max={10000}
                  min={0}
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{filters.sizeRange[0].toLocaleString()}</span>
                  <span>{filters.sizeRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Property Types */}
              <div>
                <label className="text-sm font-medium mb-2 block">Property Types</label>
                <div className="space-y-2">
                  {["house", "apartment", "condo", "townhouse", "commercial"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.propertyTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters((prev) => ({
                              ...prev,
                              propertyTypes: [...prev.propertyTypes, type],
                            }))
                          } else {
                            setFilters((prev) => ({
                              ...prev,
                              propertyTypes: prev.propertyTypes.filter((t) => t !== type),
                            }))
                          }
                        }}
                      />
                      <label htmlFor={type} className="text-sm capitalize">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, minRating: value[0] }))}
                  max={5}
                  min={0}
                  step={0.5}
                  className="mb-2"
                />
                <div className="text-xs text-gray-500">{filters.minRating} stars</div>
              </div>

              {/* Transparency Score */}
              <div>
                <label className="text-sm font-medium mb-2 block">Min Transparency Score</label>
                <Slider
                  value={[filters.minTransparency]}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, minTransparency: value[0] }))}
                  max={100}
                  min={0}
                  step={10}
                  className="mb-2"
                />
                <div className="text-xs text-gray-500">{filters.minTransparency}%</div>
              </div>

              {/* Verified Only */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={filters.verifiedOnly}
                  onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, verifiedOnly: checked as boolean }))}
                />
                <label htmlFor="verified" className="text-sm">
                  Verified owners only
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    setFilters({
                      search: "",
                      city: "",
                      state: "",
                      priceRange: [0, 5000000],
                      sizeRange: [0, 10000],
                      propertyTypes: [],
                      minRating: 0,
                      verifiedOnly: false,
                      minTransparency: 0,
                    })
                  }
                >
                  Clear All
                </Button>
                <Button className="flex-1" onClick={fetchProperties}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

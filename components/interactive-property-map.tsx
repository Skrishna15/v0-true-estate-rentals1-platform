"use client"

import { useState } from "react"
import {
  Satellite,
  MapIcon,
  Filter,
  Bookmark,
  Download,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Settings,
  Eye,
  Heart,
  Share2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface Property {
  id: string
  coordinates: [number, number]
  address: string
  city: string
  state: string
  zipCode: string
  value: number
  size: number
  bedrooms: number
  bathrooms: number
  propertyType: string
  owner: {
    name: string
    netWorth: number
    confidence: number
    type: "individual" | "entity"
  }
  images: string[]
  lastSale: {
    date: string
    price: number
  }
  trustScore: number
  isBookmarked: boolean
}

interface MapFilters {
  valueRange: [number, number]
  sizeRange: [number, number]
  propertyTypes: string[]
  ownerNetWorthRange: [number, number]
  trustScoreMin: number
  states: string[]
}

interface SavedView {
  id: string
  name: string
  center: [number, number]
  zoom: number
  filters: MapFilters
  createdAt: string
}

const mockProperties: Property[] = [
  {
    id: "1",
    coordinates: [37.7749, -122.4194],
    address: "123 Market Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    value: 2500000,
    size: 2200,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Condo",
    owner: {
      name: "Sarah Johnson",
      netWorth: 15000000,
      confidence: 85,
      type: "individual",
    },
    images: ["/placeholder.svg?height=300&width=400&query=modern+condo"],
    lastSale: {
      date: "2023-06-15",
      price: 2300000,
    },
    trustScore: 92,
    isBookmarked: false,
  },
  {
    id: "2",
    coordinates: [40.7128, -74.006],
    address: "456 Park Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10016",
    value: 8500000,
    size: 3500,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Apartment",
    owner: {
      name: "Manhattan Holdings LLC",
      netWorth: 250000000,
      confidence: 78,
      type: "entity",
    },
    images: ["/placeholder.svg?height=300&width=400&query=luxury+apartment"],
    lastSale: {
      date: "2022-11-20",
      price: 7800000,
    },
    trustScore: 88,
    isBookmarked: true,
  },
  {
    id: "3",
    coordinates: [34.0522, -118.2437],
    address: "789 Sunset Boulevard",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90028",
    value: 4200000,
    size: 2800,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "House",
    owner: {
      name: "Michael Chen",
      netWorth: 45000000,
      confidence: 91,
      type: "individual",
    },
    images: ["/placeholder.svg?height=300&width=400&query=modern+house"],
    lastSale: {
      date: "2023-03-10",
      price: 3900000,
    },
    trustScore: 95,
    isBookmarked: false,
  },
]

const mockSavedViews: SavedView[] = [
  {
    id: "1",
    name: "Bay Area High-Value Properties",
    center: [37.7749, -122.4194],
    zoom: 10,
    filters: {
      valueRange: [2000000, 10000000],
      sizeRange: [1500, 5000],
      propertyTypes: ["Condo", "House"],
      ownerNetWorthRange: [10000000, 100000000],
      trustScoreMin: 80,
      states: ["CA"],
    },
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "NYC Investment Properties",
    center: [40.7128, -74.006],
    zoom: 12,
    filters: {
      valueRange: [5000000, 20000000],
      sizeRange: [2000, 8000],
      propertyTypes: ["Apartment", "Condo"],
      ownerNetWorthRange: [50000000, 500000000],
      trustScoreMin: 85,
      states: ["NY"],
    },
    createdAt: "2024-01-20",
  },
]

export function InteractivePropertyMap() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [mapView, setMapView] = useState<"standard" | "satellite">("standard")
  const [showFilters, setShowFilters] = useState(false)
  const [showSavedViews, setShowSavedViews] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<MapFilters>({
    valueRange: [0, 10000000],
    sizeRange: [0, 10000],
    propertyTypes: [],
    ownerNetWorthRange: [0, 1000000000],
    trustScoreMin: 0,
    states: [],
  })
  const [savedViews, setSavedViews] = useState<SavedView[]>(mockSavedViews)
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]) // Center of US
  const [zoomLevel, setZoomLevel] = useState(4)

  const filteredProperties = properties.filter((property) => {
    if (
      searchQuery &&
      !property.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !property.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    if (property.value < filters.valueRange[0] || property.value > filters.valueRange[1]) return false
    if (property.size < filters.sizeRange[0] || property.size > filters.sizeRange[1]) return false
    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.propertyType)) return false
    if (
      property.owner.netWorth < filters.ownerNetWorthRange[0] ||
      property.owner.netWorth > filters.ownerNetWorthRange[1]
    )
      return false
    if (property.trustScore < filters.trustScoreMin) return false
    if (filters.states.length > 0 && !filters.states.includes(property.state)) return false

    return true
  })

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
  }

  const handleBookmarkProperty = (propertyId: string) => {
    setProperties((prev) => prev.map((p) => (p.id === propertyId ? { ...p, isBookmarked: !p.isBookmarked } : p)))
  }

  const handleSaveCurrentView = () => {
    const newView: SavedView = {
      id: Date.now().toString(),
      name: `View ${savedViews.length + 1}`,
      center: mapCenter,
      zoom: zoomLevel,
      filters: { ...filters },
      createdAt: new Date().toISOString().split("T")[0],
    }
    setSavedViews((prev) => [...prev, newView])
  }

  const handleLoadSavedView = (view: SavedView) => {
    setMapCenter(view.center)
    setZoomLevel(view.zoom)
    setFilters(view.filters)
    setShowSavedViews(false)
  }

  const getPropertyMarkerColor = (property: Property) => {
    if (property.trustScore >= 90) return "bg-green-500"
    if (property.trustScore >= 80) return "bg-yellow-500"
    return "bg-red-500"
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
        {/* Map Controls Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={mapView === "standard" ? "default" : "outline"}
              onClick={() => setMapView("standard")}
              size="sm"
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Standard
            </Button>
            <Button
              variant={mapView === "satellite" ? "default" : "outline"}
              onClick={() => setMapView("satellite")}
              size="sm"
            >
              <Satellite className="w-4 h-4 mr-2" />
              Satellite
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters ({Object.values(filters).flat().filter(Boolean).length})
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg px-3 py-1 shadow">
              <span className="text-sm font-medium">{filteredProperties.length} properties</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowSavedViews(!showSavedViews)}>
              <Bookmark className="w-4 h-4 mr-2" />
              Saved Views
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by address or owner name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white shadow-lg"
            />
          </div>
        </div>

        {/* Map Area */}
        <div
          className={`w-full h-full ${mapView === "satellite" ? "bg-gray-800" : "bg-blue-50"} relative overflow-hidden`}
        >
          {/* Simulated Map Background */}
          <div className="absolute inset-0">
            {mapView === "satellite" ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50" />
            )}

            {/* Grid overlay for map feel */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full border-t border-gray-400" style={{ top: `${i * 5}%` }} />
              ))}
              {[...Array(20)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-gray-400"
                  style={{ left: `${i * 5}%` }}
                />
              ))}
            </div>
          </div>

          {/* Property Markers */}
          {filteredProperties.map((property) => {
            const x = ((property.coordinates[1] + 180) / 360) * 100
            const y = ((90 - property.coordinates[0]) / 180) * 100

            return (
              <div
                key={property.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => handlePropertyClick(property)}
              >
                <div
                  className={`w-4 h-4 ${getPropertyMarkerColor(property)} rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform`}
                >
                  {property.isBookmarked && (
                    <Heart className="w-2 h-2 text-white fill-current absolute top-0.5 left-0.5" />
                  )}
                </div>

                {/* Property cluster indicator for high zoom */}
                {zoomLevel > 8 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {formatCurrency(property.value)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoomLevel((prev) => Math.min(prev + 1, 18))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoomLevel((prev) => Math.max(prev - 1, 1))}>
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
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Trust Score Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>High Trust (90%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium Trust (80-89%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Low Trust (&lt;80%)</span>
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
                    <CardTitle className="text-lg">{selectedProperty.address}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleBookmarkProperty(selectedProperty.id)}>
                      <Heart
                        className={`w-4 h-4 ${selectedProperty.isBookmarked ? "fill-current text-red-500" : ""}`}
                      />
                    </Button>
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
                    src={selectedProperty.images[0] || "/placeholder.svg"}
                    alt={selectedProperty.address}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Value</span>
                    <div className="font-semibold text-green-600">{formatCurrency(selectedProperty.value)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Trust Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{selectedProperty.trustScore}%</span>
                      <Badge className={getPropertyMarkerColor(selectedProperty).replace("bg-", "bg-") + " text-white"}>
                        {selectedProperty.trustScore >= 90
                          ? "High"
                          : selectedProperty.trustScore >= 80
                            ? "Medium"
                            : "Low"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Size</span>
                    <div className="font-semibold">{selectedProperty.size.toLocaleString()} sq ft</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Type</span>
                    <div className="font-semibold">{selectedProperty.propertyType}</div>
                  </div>
                </div>

                <Separator />

                {/* Owner Information */}
                <div>
                  <h4 className="font-semibold mb-2">Owner Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name</span>
                      <span className="font-medium">{selectedProperty.owner.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Est. Net Worth</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedProperty.owner.netWorth)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Confidence</span>
                      <span className="font-medium">{selectedProperty.owner.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <Badge variant="outline">
                        {selectedProperty.owner.type === "individual" ? "Individual" : "Entity"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Last Sale */}
                <div>
                  <h4 className="font-semibold mb-2">Last Sale</h4>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date</span>
                    <span className="font-medium">{new Date(selectedProperty.lastSale.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="font-medium">{formatCurrency(selectedProperty.lastSale.price)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
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
              {/* Property Value Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Property Value</label>
                <Slider
                  value={filters.valueRange}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, valueRange: value as [number, number] }))}
                  max={10000000}
                  min={0}
                  step={100000}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(filters.valueRange[0])}</span>
                  <span>{formatCurrency(filters.valueRange[1])}</span>
                </div>
              </div>

              {/* Property Size Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Property Size (sq ft)</label>
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
                  {["House", "Condo", "Apartment", "Townhouse", "Commercial"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.propertyTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters((prev) => ({ ...prev, propertyTypes: [...prev.propertyTypes, type] }))
                          } else {
                            setFilters((prev) => ({
                              ...prev,
                              propertyTypes: prev.propertyTypes.filter((t) => t !== type),
                            }))
                          }
                        }}
                      />
                      <label htmlFor={type} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Net Worth Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Owner Net Worth</label>
                <Slider
                  value={filters.ownerNetWorthRange}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, ownerNetWorthRange: value as [number, number] }))
                  }
                  max={1000000000}
                  min={0}
                  step={1000000}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(filters.ownerNetWorthRange[0])}</span>
                  <span>{formatCurrency(filters.ownerNetWorthRange[1])}</span>
                </div>
              </div>

              {/* Trust Score Minimum */}
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Trust Score</label>
                <Slider
                  value={[filters.trustScoreMin]}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, trustScoreMin: value[0] }))}
                  max={100}
                  min={0}
                  step={5}
                  className="mb-2"
                />
                <div className="text-xs text-gray-500">{filters.trustScoreMin}%</div>
              </div>

              {/* States */}
              <div>
                <label className="text-sm font-medium mb-2 block">States</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select states..." />
                  </SelectTrigger>
                  <SelectContent>
                    {["CA", "NY", "TX", "FL", "IL", "WA"].map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    setFilters({
                      valueRange: [0, 10000000],
                      sizeRange: [0, 10000],
                      propertyTypes: [],
                      ownerNetWorthRange: [0, 1000000000],
                      trustScoreMin: 0,
                      states: [],
                    })
                  }
                >
                  Clear All
                </Button>
                <Button className="flex-1" onClick={handleSaveCurrentView}>
                  Save View
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Views Sidebar */}
      {showSavedViews && (
        <div className="w-80 bg-white border-l shadow-lg overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Saved Views</h3>
              <Button variant="outline" size="sm" onClick={() => setShowSavedViews(false)}>
                ×
              </Button>
            </div>

            <div className="space-y-3">
              {savedViews.map((view) => (
                <Card
                  key={view.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleLoadSavedView(view)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{view.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {view.createdAt}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Zoom: {view.zoom} • Filters: {Object.values(view.filters).flat().filter(Boolean).length}
                    </p>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        Load View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="w-full mt-4" onClick={handleSaveCurrentView}>
              <Bookmark className="w-4 h-4 mr-2" />
              Save Current View
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

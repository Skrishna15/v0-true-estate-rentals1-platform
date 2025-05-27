"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { InteractiveMap } from "@/components/interactive-map"
import { PropertySearch } from "@/components/property-search"
import PropertyComparison from "@/components/property-comparison"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Users, Shield, Eye, BookOpen } from "lucide-react"

const mockWealthData = [
  {
    id: "1",
    owner: "Sarah Johnson",
    totalValue: "$8.2M",
    properties: 12,
    locations: ["San Francisco", "Oakland", "Berkeley"],
    trustScore: 95,
    recentActivity: "Purchased 2-unit building on Pine St",
    coordinates: [-122.4194, 37.7749] as [number, number],
    address: "123 Oak Street, San Francisco, CA",
    price: 2500000,
    type: "Multi-family",
    size: 3200,
  },
  {
    id: "2",
    owner: "Michael Chen",
    totalValue: "$15.7M",
    properties: 23,
    locations: ["Los Angeles", "Santa Monica", "Beverly Hills"],
    trustScore: 88,
    recentActivity: "Sold luxury condo in Beverly Hills",
    coordinates: [-118.2437, 34.0522] as [number, number],
    address: "456 Pine Avenue, Los Angeles, CA",
    price: 1800000,
    type: "Condo",
    size: 2100,
  },
  {
    id: "3",
    owner: "Emily Rodriguez",
    totalValue: "$6.3M",
    properties: 8,
    locations: ["Seattle", "Bellevue", "Redmond"],
    trustScore: 92,
    recentActivity: "Acquired apartment complex in Bellevue",
    coordinates: [-122.3321, 47.6062] as [number, number],
    address: "789 Maple Drive, Seattle, WA",
    price: 950000,
    type: "Apartment",
    size: 1850,
  },
]

export default function WealthMapPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null)
  const [mapProperties, setMapProperties] = useState(mockWealthData)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [savedSearches, setSavedSearches] = useState<string[]>([])

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/signin")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  const handlePropertySelect = (property: any) => {
    setSelectedOwner(property.id)
  }

  const handlePropertyClick = (property: any) => {
    // Navigate to detailed property view
    router.push(`/property/${property.id}`)
  }

  const handleOwnerClick = (ownerId: string) => {
    // Navigate to owner wealth analysis
    router.push(`/owner/${ownerId}`)
  }

  const handleSearchResults = (results: any[]) => {
    const newProperties = results.map((result, index) => ({
      id: `search-${index}`,
      owner: result.owner?.name || "Unknown Owner",
      totalValue: result.details?.price ? `$${(result.details.price / 1000000).toFixed(1)}M` : "N/A",
      properties: 1,
      locations: [result.address?.city || "Unknown"],
      trustScore: result.transparencyScore || Math.floor(Math.random() * 30) + 70,
      recentActivity: "Recently listed",
      coordinates: [result.coordinates?.lng || -122.4194, result.coordinates?.lat || 37.7749] as [number, number],
      address: `${result.address?.street || "Unknown Address"}, ${result.address?.city || ""}, ${result.address?.state || ""}`,
      price: result.details?.price || 0,
      type: result.details?.propertyType || "Unknown",
      size: result.details?.size || 0,
    }))

    // Update both the map properties and search results
    setMapProperties([...mockWealthData, ...newProperties])
    setSearchResults(newProperties)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Simulate search results for demo
      const mockSearchResults = [
        {
          id: "search-1",
          address: { street: "123 Main St", city: "New York", state: "NY" },
          coordinates: { lat: 40.7128, lng: -74.006 },
          details: { price: 1200000, size: 1800, propertyType: "Apartment" },
          owner: { name: "John Doe" },
          transparencyScore: 85,
        },
        {
          id: "search-2",
          address: { street: "456 Broadway", city: "New York", state: "NY" },
          coordinates: { lat: 40.7589, lng: -73.9851 },
          details: { price: 950000, size: 1200, propertyType: "Condo" },
          owner: { name: "Jane Smith" },
          transparencyScore: 78,
        },
      ]
      handleSearchResults(mockSearchResults)

      // Save search query
      if (!savedSearches.includes(searchQuery)) {
        setSavedSearches([...savedSearches, searchQuery])
      }
    }
  }

  const handleSaveMapView = () => {
    // Save current map view state
    const mapView = {
      center: [-98.5795, 39.8283],
      zoom: 4,
      filters: {},
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("savedMapView", JSON.stringify(mapView))
    alert("Map view saved!")
  }

  // Convert map properties to format expected by PropertyComparison
  const availableProperties = mapProperties.map((prop) => ({
    id: prop.id,
    address: prop.address,
    price: prop.price || 0,
    owner: prop.owner,
    trustScore: prop.trustScore,
    type: prop.type || "Unknown",
    size: prop.size || 0,
    isSearchResult: prop.id.startsWith("search-"),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Wealth Map Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Real Estate Wealth Map</h1>
          <p className="text-gray-600 mb-6">
            Visualize property ownership patterns and wealth distribution with real-time data
          </p>

          {/* Enhanced Search */}
          <PropertySearch onResults={handleSearchResults} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-[600px]">
              <CardContent className="p-0 h-full">
                <InteractiveMap
                  properties={mapProperties}
                  onPropertySelect={handlePropertySelect}
                  onPropertyClick={handlePropertyClick}
                />
              </CardContent>
            </Card>

            {/* Map Controls */}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={handleSaveMapView}>
                Save Map View
              </Button>
              <Button variant="outline">Load Saved View</Button>
              <Button variant="outline">Export Map Data</Button>
            </div>
          </div>

          {/* Wealth Rankings Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Property Owners ({mapProperties.length})
                </CardTitle>
                <CardDescription>
                  {mapProperties.length > mockWealthData.length
                    ? `Showing ${mapProperties.length - mockWealthData.length} search results + ${mockWealthData.length} featured owners`
                    : "Ranked by verified portfolio value"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {mapProperties
                    .sort(
                      (a, b) =>
                        Number.parseFloat(b.totalValue.replace(/[$M]/g, "")) -
                        Number.parseFloat(a.totalValue.replace(/[$M]/g, "")),
                    )
                    .map((owner, index) => (
                      <div
                        key={owner.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedOwner === owner.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                        } ${owner.id.startsWith("search-") ? "border-l-4 border-l-blue-500" : ""}`}
                        onClick={() => setSelectedOwner(selectedOwner === owner.id ? null : owner.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{owner.owner}</h4>
                            <p className="text-sm text-gray-600">
                              {owner.id.startsWith("search-") ? "Search Result" : `#${index + 1} by portfolio value`}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{owner.address}</p>
                          </div>
                          <Badge
                            className={`${owner.trustScore >= 90 ? "bg-green-500" : owner.trustScore >= 80 ? "bg-yellow-500" : "bg-red-500"} text-white`}
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {owner.trustScore}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                          <div>
                            <span className="text-gray-500">Total Value:</span>
                            <div className="font-semibold text-green-600">{owner.totalValue}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Properties:</span>
                            <div className="font-semibold">{owner.properties}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          <span className="font-medium">Markets:</span> {owner.locations.join(", ")}
                        </div>
                        {selectedOwner === owner.id && (
                          <div className="mt-3 pt-3 border-t space-y-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Recent Activity:</span> {owner.recentActivity}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOwnerClick(owner.id)
                                }}
                              >
                                <BookOpen className="w-3 h-3 mr-1" />
                                View Wealth Analysis
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePropertyClick(owner)
                                }}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Property Details
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Market Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Live Market Data
                </CardTitle>
                <CardDescription>Updated from ATTOM & Zillow APIs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Tracked Value</span>
                    <span className="font-semibold text-green-600">$63.7M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Properties</span>
                    <span className="font-semibold">{mapProperties.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verified Owners</span>
                    <span className="font-semibold">{mapProperties.filter((p) => p.trustScore >= 80).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Trust Score</span>
                    <span className="font-semibold text-blue-600">
                      {Math.round(mapProperties.reduce((acc, p) => acc + p.trustScore, 0) / mapProperties.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data Sources</span>
                    <span className="font-semibold">5 APIs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedSearches.map((search, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{search}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSearchQuery(search)
                            handleSearch()
                          }}
                        >
                          Load
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ATTOM Data</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Zillow API</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RentCast</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">People Data Labs</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Google Maps</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Advanced Real Estate Tools Section */}
      <div className="bg-white border-t">
        <PropertyComparison
          availableProperties={availableProperties}
          searchResults={searchResults}
          onPropertyUpdate={(updatedProperties) => {
            console.log("Properties updated:", updatedProperties)
          }}
        />
      </div>
    </div>
  )
}

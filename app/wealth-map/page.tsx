"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { WealthMap } from "@/components/wealth-map"
import PropertyComparison from "@/components/property-comparison"

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
    }
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
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <WealthMap
              properties={mapProperties}
              onPropertySelect={handlePropertySelect}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          </div>

          {/* Wealth Rankings Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">Property Owners ({mapProperties.length})</h3>
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
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            owner.trustScore >= 90
                              ? "bg-green-100 text-green-800"
                              : owner.trustScore >= 80
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {owner.trustScore}%
                        </div>
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
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Real Estate Tools Section */}
      <div className="bg-white border-t">
        <PropertyComparison
          availableProperties={availableProperties}
          searchResults={searchResults}
          onPropertyUpdate={(updatedProperties) => {
            // Handle property updates if needed
            console.log("Properties updated:", updatedProperties)
          }}
        />
      </div>
    </div>
  )
}

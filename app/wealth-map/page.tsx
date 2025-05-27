"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { WealthMap } from "@/components/wealth-map"

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
  },
]

export default function WealthMapPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null)
  const [mapProperties, setMapProperties] = useState(mockWealthData)
  const [searchQuery, setSearchQuery] = useState("")

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
    }))

    // Update both the map properties and the wealth data
    setMapProperties([...mockWealthData, ...newProperties])
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <WealthMap
        properties={mapProperties}
        onPropertySelect={handlePropertySelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
    </div>
  )
}

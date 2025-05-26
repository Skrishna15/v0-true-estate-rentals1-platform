"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Building, DollarSign, TrendingUp, Users, Shield, Search, Bell, User, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InteractiveMap } from "@/components/interactive-map"
import { PropertySearch } from "@/components/property-search"

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
  const { data: session } = useSession()
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null)
  const [mapProperties, setMapProperties] = useState(mockWealthData)
  const [searchQuery, setSearchQuery] = useState("")

  const handlePropertySelect = (property: any) => {
    setSelectedOwner(property.id)
  }

  const handleSearchResults = (results: any[]) => {
    const newProperties = results.map((result, index) => ({
      id: `search-${index}`,
      owner: result.owner || "Unknown Owner",
      totalValue: result.value || "N/A",
      properties: 1,
      locations: [result.city || "Unknown"],
      trustScore: Math.floor(Math.random() * 30) + 70,
      recentActivity: "Recently listed",
      coordinates: [result.longitude || -122.4194, result.latitude || 37.7749] as [number, number],
      address: result.address || "Unknown Address",
    }))

    setMapProperties([...mockWealthData, ...newProperties])
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">TrueEstate</h1>
                <p className="text-xs text-gray-600">Transparency in Real Estate</p>
              </div>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search properties, owners, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="rounded-r-none border-r-0 focus:border-blue-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="rounded-l-none px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-l-0"
                variant="outline"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button variant="ghost" size="sm">
                  <Bell className="w-5 h-5" />
                </Button>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/signin">
                  <User className="w-4 h-4 mr-2" />
                  Sign in
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Real Estate Wealth Map</h1>
          <p className="text-gray-600 mb-6">
            Visualize property ownership patterns and wealth distribution with real-time data
          </p>

          {/* Enhanced Search */}
          <PropertySearch onResults={handleSearchResults} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-[600px]">
              <CardContent className="p-0 h-full">
                <InteractiveMap properties={mapProperties} onPropertySelect={handlePropertySelect} />
              </CardContent>
            </Card>
          </div>

          {/* Wealth Rankings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Property Owners
                </CardTitle>
                <CardDescription>Ranked by verified portfolio value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mapProperties
                    .sort(
                      (a, b) =>
                        Number.parseFloat(b.totalValue.replace(/[$M]/g, "")) -
                        Number.parseFloat(a.totalValue.replace(/[$M]/g, "")),
                    )
                    .slice(0, 5)
                    .map((owner, index) => (
                      <div
                        key={owner.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedOwner === owner.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedOwner(selectedOwner === owner.id ? null : owner.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{owner.owner}</h4>
                            <p className="text-sm text-gray-600">#{index + 1} by portfolio value</p>
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
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Recent Activity:</span> {owner.recentActivity}
                            </p>
                            <Button size="sm" className="mt-2 w-full">
                              View Full Portfolio
                            </Button>
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
    </div>
  )
}

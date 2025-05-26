"use client"

import { useState } from "react"
import { Building, Search, Filter, Download, Heart, TrendingUp, MapPin, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { InteractivePropertyMap } from "@/components/interactive-property-map"
import { PropertyDetails } from "@/components/property-details"
import { OwnerWealthAnalysis } from "@/components/owner-wealth-analysis"

type ViewMode = "map" | "property" | "owner"

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

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("map")
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("las vegas")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    financial: true,
    location: true,
    marketData: false,
    verification: true,
  })
  const [mapProperties, setMapProperties] = useState(mockWealthData)

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    setViewMode("property")
  }

  const handleOwnerSelect = (ownerId: string) => {
    setSelectedOwnerId(ownerId)
    setViewMode("owner")
  }

  const handleBackToMap = () => {
    setViewMode("map")
    setSelectedPropertyId(null)
    setSelectedOwnerId(null)
  }

  const handleSearchResults = (results: any[]) => {
    // Convert search results to map format
    const newProperties = results.map((result, index) => ({
      id: `search-${index}`,
      owner: result.owner || "Unknown Owner",
      totalValue: result.value || "N/A",
      properties: 1,
      locations: [result.city || "Unknown"],
      trustScore: Math.floor(Math.random() * 30) + 70, // Mock trust score
      recentActivity: "Recently listed",
      coordinates: [result.longitude || -122.4194, result.latitude || 37.7749] as [number, number],
      address: result.address || "Unknown Address",
    }))

    setMapProperties([...mockWealthData, ...newProperties])
  }

  const handleSearch = () => {
    console.log("Searching for:", searchQuery)
    // Add actual search functionality here
  }

  const handleExport = () => {
    console.log("Exporting with options:", exportOptions)
    // Add actual export functionality here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Live Alert Banner */}
      <div className="bg-red-500 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
          <Search className="w-4 h-4" />
          <span className="font-medium">LIVE ALERT:</span>
          <span>3 new scam properties detected in your area</span>
          <span>•</span>
          <span>5 new verified listings added today</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">TrueEstate</h1>
                <p className="text-xs text-gray-600">Clarity before Capital</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant={viewMode === "map" ? "default" : "outline"} onClick={handleBackToMap}>
                <Search className="w-4 h-4 mr-2" />
                Property Map
              </Button>
              <Link href="/learn" className="text-gray-600 hover:text-blue-600">
                Knowledge Center
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                Profile
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <span className="text-sm">AU</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100vh-80px)]">
        {viewMode === "map" && <InteractivePropertyMap />}

        {viewMode === "property" && selectedPropertyId && (
          <PropertyDetails propertyId={selectedPropertyId} onBack={handleBackToMap} />
        )}

        {viewMode === "owner" && selectedOwnerId && (
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" onClick={handleBackToMap}>
                ← Back to Map
              </Button>
              <h1 className="text-2xl font-bold">Owner Wealth Analysis</h1>
            </div>
            <OwnerWealthAnalysis ownerId={selectedOwnerId} />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-80 bg-white border-l">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Real Estate Intelligence Dashboard</h1>
            <p className="text-gray-600 mb-8">
              Real-time property ownership data, trust scores, and market intelligence powered by AI
            </p>

            {/* Tab Navigation */}
            <div className="flex justify-center gap-2 mb-8">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                onClick={() => setViewMode("map")}
                className="px-6"
              >
                Map View
              </Button>
              <Button
                variant={viewMode === "property" ? "default" : "outline"}
                onClick={() => setViewMode("property")}
                className="px-6"
              >
                Property Details
              </Button>
              <Button
                variant={viewMode === "owner" ? "default" : "outline"}
                onClick={() => setViewMode("owner")}
                className="px-6"
              >
                Owner Analysis
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by address, city, or neighborhood..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 text-lg"
                  />
                </div>
                <Button onClick={handleSearch} size="lg" className="px-8">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Try: "123 Main St" or "Sarah Johnson Properties" or "Pacific Real Estate"
              </p>
            </div>

            {/* Advanced Filters Toggle */}
            <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="mb-6">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>

            {/* Data Export & Reports */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Data Export & Reports
                </CardTitle>
                <CardDescription>Generate comprehensive property reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Export Format */}
                <div>
                  <h4 className="font-medium mb-3">Export Format</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="default" size="sm" className="bg-black text-white">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <span className="text-xs">{"{}"}</span>
                      JSON
                    </Button>
                    <Button variant="outline" size="sm">
                      <span className="text-xs">📄</span>
                      PDF Report
                    </Button>
                  </div>
                </div>

                {/* Export Scope */}
                <div>
                  <h4 className="font-medium mb-3">Export Scope</h4>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="all-properties" name="scope" defaultChecked />
                    <label htmlFor="all-properties" className="text-sm">
                      All Properties (6)
                    </label>
                  </div>
                </div>

                {/* Include Fields */}
                <div>
                  <h4 className="font-medium mb-3">Include Fields</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox id="basic-info" checked={true} className="mt-1" />
                      <div>
                        <label htmlFor="basic-info" className="font-medium text-sm">
                          Basic Info
                        </label>
                        <p className="text-xs text-gray-500">Address, owner, property type</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox id="ownership" checked={true} className="mt-1" />
                      <div>
                        <label htmlFor="ownership" className="font-medium text-sm">
                          Ownership
                        </label>
                        <p className="text-xs text-gray-500">Owner details, company, portfolio</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="financial"
                        checked={exportOptions.financial}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({ ...prev, financial: checked as boolean }))
                        }
                        className="mt-1"
                      />
                      <div>
                        <label htmlFor="financial" className="font-medium text-sm">
                          Financial
                        </label>
                        <p className="text-xs text-gray-500">Value, rent estimates, ROI</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="location"
                        checked={exportOptions.location}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({ ...prev, location: checked as boolean }))
                        }
                        className="mt-1"
                      />
                      <div>
                        <label htmlFor="location" className="font-medium text-sm">
                          Location
                        </label>
                        <p className="text-xs text-gray-500">Coordinates, neighborhood, walk score</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="market-data"
                        checked={exportOptions.marketData}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({ ...prev, marketData: checked as boolean }))
                        }
                        className="mt-1"
                      />
                      <div>
                        <label htmlFor="market-data" className="font-medium text-sm">
                          Market Data
                        </label>
                        <p className="text-xs text-gray-500">Trends, appreciation, comparables</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="verification"
                        checked={exportOptions.verification}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({ ...prev, verification: checked as boolean }))
                        }
                        className="mt-1"
                      />
                      <div>
                        <label htmlFor="verification" className="font-medium text-sm">
                          Verification
                        </label>
                        <p className="text-xs text-gray-500">Trust scores, scam reports</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleExport} className="w-full bg-black text-white hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-2" />
                  Export 6 Properties
                </Button>
              </CardContent>
            </Card>

            {/* Live Market Intelligence */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Live Market Intelligence
                </CardTitle>
                <CardDescription>Real-time market data and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Portfolio Value</span>
                  <span className="font-semibold text-green-600">$63.7M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verified Properties</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trusted Owners</span>
                  <span className="font-semibold text-blue-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Trust Score</span>
                  <span className="font-semibold text-green-600">91%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Scams Prevented</span>
                  <span className="font-semibold text-red-600">534</span>
                </div>
              </CardContent>
            </Card>

            {/* Saved Properties */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Saved Properties (0)
                </CardTitle>
                <CardDescription>Your bookmarked properties and notes</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No saved properties yet</p>
                <p className="text-sm text-gray-400">Click the heart icon on any property to save it</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

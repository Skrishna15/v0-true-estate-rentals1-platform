"use client"

import { useState } from "react"
import { Building, Search, Filter, Download, Heart, Eye, TrendingUp, MapPin, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("las vegas")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    financial: true,
    location: true,
    marketData: false,
    verification: true,
  })
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null)
  const [mapProperties, setMapProperties] = useState(mockWealthData)

  const handlePropertySelect = (property: any) => {
    setSelectedOwner(property.id)
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
              <Link href="/properties" className="text-gray-600 hover:text-blue-600">
                Search Properties
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600">
                About
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
              variant={activeTab === "all" ? "default" : "outline"}
              onClick={() => setActiveTab("all")}
              className="px-6"
            >
              All Results
            </Button>
            <Button
              variant={activeTab === "properties" ? "default" : "outline"}
              onClick={() => setActiveTab("properties")}
              className="px-6"
            >
              Properties Only
            </Button>
            <Button
              variant={activeTab === "verified" ? "default" : "outline"}
              onClick={() => setActiveTab("verified")}
              className="px-6"
            >
              Verified Owners
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
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Results */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Search Results
                    </CardTitle>
                    <Badge>1 properties</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span>Sort by:</span>
                    <Select defaultValue="relevance">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="trust">Trust Score</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <span>Showing 1 of 1 results</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Property Result */}
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">las vegas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Owner:</span>
                          <div className="font-medium">Sample Owner</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Value:</span>
                          <div className="font-medium text-green-600">$790,857</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Trust Score:</span>
                          <div className="font-medium">99%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <Badge variant="destructive">Unverified</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Real Estate Tools */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Advanced Real Estate Tools</CardTitle>
                <CardDescription>Professional tools and analytics for informed real estate decisions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Analysis Tools */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Property Analysis Tools
                  </h3>
                  <p className="text-gray-600 mb-4">Compare properties and analyze market trends</p>

                  {/* Property Comparison */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5" />
                        <h4 className="font-semibold">Property Comparison</h4>
                      </div>
                      <p className="text-gray-600 mb-4">Select properties to compare side by side</p>
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-2">No properties selected</p>
                        <p className="text-sm text-gray-400">Click the compare icon on any property to add it here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Data Export & Reports */}
            <Card>
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
            <Card>
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
            <Card>
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

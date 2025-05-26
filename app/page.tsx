"use client"

import { useState, useEffect } from "react"
import { Building, Users, Eye, Shield, Search, MapPin, TrendingUp, AlertTriangle, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapboxGlobeMap } from "@/components/mapbox-globe-map"
import { WealthHeatmap } from "@/components/wealth-heatmap"
import { RealTimeStats } from "@/components/real-time-stats"
import { AuthHeader } from "@/components/auth-header"
import { AdvancedSearchFilters } from "@/components/advanced-search-filters"
import { KnowledgeBase } from "@/components/knowledge-base"
import { PropertyBookmarks } from "@/components/property-bookmarks"
import { DataExport } from "@/components/data-export"
import { SavedMapViews } from "@/components/saved-map-views"
import { PropertyComparison } from "@/components/property-comparison"
import { RealTimeNotifications } from "@/components/real-time-notifications"
import { SearchResults } from "@/components/search-results"
import { useSession } from "next-auth/react"

// Real-world property data structure
const realWorldProperties = [
  {
    id: "prop_sf_001",
    owner: "Sarah Johnson",
    company: "Johnson Properties LLC",
    totalValue: "$8.2M",
    properties: 12,
    locations: ["San Francisco", "Oakland", "Berkeley"],
    trustScore: 95,
    recentActivity: "Purchased 2-unit building on Pine St",
    coordinates: [-122.4194, 37.7749] as [number, number],
    address: "123 Oak Street, San Francisco, CA 94102",
    city: "San Francisco",
    state: "CA",
    propertyType: "Multi-Family",
    yearBuilt: 1925,
    lastSale: "2023-08-15",
    marketValue: 1850000,
    rentEstimate: 4500,
    neighborhood: "Nob Hill",
    walkScore: 98,
    crimeRate: "Low" as const,
    appreciation: 12.5,
    verified: true,
    scamReports: 0,
    tenantReviews: 4.8,
    value: "$8.2M",
    sqft: 2400,
    bedrooms: 4,
    bathrooms: 3,
    marketTrend: "up" as const,
  },
  {
    id: "prop_la_002",
    owner: "Michael Chen",
    company: "Pacific Real Estate Group",
    totalValue: "$15.7M",
    properties: 23,
    locations: ["Los Angeles", "Santa Monica", "Beverly Hills"],
    trustScore: 88,
    recentActivity: "Sold luxury condo in Beverly Hills",
    coordinates: [-118.2437, 34.0522] as [number, number],
    address: "456 Pine Avenue, Los Angeles, CA 90210",
    city: "Los Angeles",
    state: "CA",
    propertyType: "Luxury Condo",
    yearBuilt: 2018,
    lastSale: "2024-01-10",
    marketValue: 2100000,
    rentEstimate: 5200,
    neighborhood: "Beverly Hills",
    walkScore: 89,
    crimeRate: "Very Low" as const,
    appreciation: 8.3,
    verified: true,
    scamReports: 0,
    tenantReviews: 4.6,
    value: "$15.7M",
    sqft: 1800,
    bedrooms: 3,
    bathrooms: 2,
    marketTrend: "stable" as const,
  },
  {
    id: "prop_sea_003",
    owner: "Emily Rodriguez",
    company: "Northwest Property Holdings",
    totalValue: "$6.3M",
    properties: 8,
    locations: ["Seattle", "Bellevue", "Redmond"],
    trustScore: 92,
    recentActivity: "Acquired apartment complex in Bellevue",
    coordinates: [-122.3321, 47.6062] as [number, number],
    address: "789 Maple Drive, Seattle, WA 98101",
    city: "Seattle",
    state: "WA",
    propertyType: "Apartment Complex",
    yearBuilt: 2015,
    lastSale: "2023-11-22",
    marketValue: 3200000,
    rentEstimate: 2800,
    neighborhood: "Capitol Hill",
    walkScore: 94,
    crimeRate: "Low" as const,
    appreciation: 15.2,
    verified: true,
    scamReports: 0,
    tenantReviews: 4.9,
    value: "$6.3M",
    sqft: 3200,
    bedrooms: 6,
    bathrooms: 4,
    marketTrend: "up" as const,
  },
  {
    id: "prop_ny_004",
    owner: "David Kim",
    company: "Empire State Realty",
    totalValue: "$22.1M",
    properties: 31,
    locations: ["New York", "Brooklyn", "Queens"],
    trustScore: 91,
    recentActivity: "Renovated historic brownstone in Brooklyn",
    coordinates: [-74.006, 40.7128] as [number, number],
    address: "321 Broadway, New York, NY 10007",
    city: "New York",
    state: "NY",
    propertyType: "Historic Brownstone",
    yearBuilt: 1890,
    lastSale: "2023-09-05",
    marketValue: 4500000,
    rentEstimate: 6800,
    neighborhood: "Financial District",
    walkScore: 100,
    crimeRate: "Medium" as const,
    appreciation: 9.7,
    verified: true,
    scamReports: 0,
    tenantReviews: 4.7,
    value: "$22.1M",
    sqft: 2800,
    bedrooms: 5,
    bathrooms: 3,
    marketTrend: "stable" as const,
  },
  {
    id: "prop_mia_005",
    owner: "Isabella Martinez",
    company: "Sunshine Properties LLC",
    totalValue: "$11.4M",
    properties: 18,
    locations: ["Miami", "Fort Lauderdale", "Boca Raton"],
    trustScore: 89,
    recentActivity: "Developed luxury waterfront condos",
    coordinates: [-80.1918, 25.7617] as [number, number],
    address: "555 Ocean Drive, Miami, FL 33139",
    city: "Miami",
    state: "FL",
    propertyType: "Waterfront Condo",
    yearBuilt: 2020,
    lastSale: "2024-02-14",
    marketValue: 1950000,
    rentEstimate: 4200,
    neighborhood: "South Beach",
    walkScore: 91,
    crimeRate: "Medium" as const,
    appreciation: 18.9,
    verified: true,
    scamReports: 0,
    tenantReviews: 4.5,
    value: "$11.4M",
    sqft: 2100,
    bedrooms: 3,
    bathrooms: 2,
    marketTrend: "up" as const,
  },
]

export default function HomePage() {
  const { data: session, status } = useSession()
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null)
  const [mapProperties, setMapProperties] = useState(realWorldProperties)
  const [searchQuery, setSearchQuery] = useState("")
  const [mapView, setMapView] = useState<"properties" | "heatmap">("properties")
  const [realTimeData, setRealTimeData] = useState({
    totalValue: "$63.7M",
    activeProperties: realWorldProperties.length,
    verifiedOwners: realWorldProperties.filter((p) => p.verified).length,
    avgTrustScore: Math.round(
      realWorldProperties.reduce((acc, p) => acc + p.trustScore, 0) / realWorldProperties.length,
    ),
    scamsPrevented: 247,
    newListings: 12,
  })
  const [loading, setLoading] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<any[]>([])
  const [currentMapState, setCurrentMapState] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  // Check if user is authenticated (either NextAuth session or localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Fix hydration by ensuring client-side only rendering for dynamic content
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication status
  useEffect(() => {
    if (mounted) {
      // Check NextAuth session first
      if (status === "authenticated" && session) {
        setIsAuthenticated(true)
        setCurrentUser({
          id: session.user?.email || `session-${Date.now()}`,
          name: session.user?.name || "User",
          email: session.user?.email || "",
          role: "user",
        })
      } else {
        // Check localStorage for demo users
        const userData = localStorage.getItem("trueestate_user")
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData)
            if (parsedUser.authenticated) {
              setIsAuthenticated(true)
              setCurrentUser(parsedUser)
            } else {
              setIsAuthenticated(false)
              setCurrentUser(null)
            }
          } catch (error) {
            console.error("Error parsing user data:", error)
            localStorage.removeItem("trueestate_user")
            setIsAuthenticated(false)
            setCurrentUser(null)
          }
        } else {
          setIsAuthenticated(false)
          setCurrentUser(null)
        }
      }
    }
  }, [mounted, session, status])

  // Simulate real-time updates
  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        scamsPrevented: prev.scamsPrevented + Math.floor(Math.random() * 3),
        newListings: prev.newListings + Math.floor(Math.random() * 2),
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [mounted])

  const handlePropertySelect = (property: any) => {
    setSelectedOwner(property.id)
  }

  const handleSearchResults = (results: any[]) => {
    // Add search results to the existing map properties
    const enhancedResults = results.map((result, index) => ({
      ...result,
      // Ensure all required fields are present
      id: result.id || `search-${Date.now()}-${index}`,
      coordinates: result.coordinates || [
        -122.4194 + (Math.random() - 0.5) * 0.1,
        37.7749 + (Math.random() - 0.5) * 0.1,
      ],
      verified: result.verified !== undefined ? result.verified : Math.random() > 0.3,
      trustScore: result.trustScore || Math.floor(Math.random() * 30) + 70,
      marketTrend: result.marketTrend || ["up", "down", "stable"][Math.floor(Math.random() * 3)],
    }))

    // Merge with existing properties, avoiding duplicates
    const existingIds = new Set(realWorldProperties.map((p) => p.id))
    const newResults = enhancedResults.filter((result) => !existingIds.has(result.id))

    setMapProperties([...realWorldProperties, ...newResults])
    setSearchResults(enhancedResults) // Set search results for display
    setShowSearchResults(true) // Show search results section

    // Scroll to search results section
    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" })
    }, 100)

    // If there are results, focus on the first one after a short delay
    if (enhancedResults.length > 0) {
      setTimeout(() => {
        // Trigger a custom event to focus on the first search result
        window.dispatchEvent(
          new CustomEvent("focusProperty", {
            detail: enhancedResults[0],
          }),
        )
      }, 1000)
    }
  }

  const handleQuickSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true)

      try {
        // Create a mock search result that matches our property format
        const mockResult = {
          id: `quick-search-${Date.now()}`,
          owner: "Property Owner",
          company: "Real Estate LLC",
          value: `$${(400000 + Math.random() * 600000).toFixed(0)}`,
          totalValue: `$${(400000 + Math.random() * 600000).toFixed(0)}`,
          properties: Math.floor(Math.random() * 5) + 1,
          locations: [searchQuery.split(",")[1]?.trim() || "San Francisco"],
          trustScore: Math.floor(Math.random() * 30) + 70,
          recentActivity: "Recently searched property",
          coordinates: [-122.4194 + (Math.random() - 0.5) * 0.2, 37.7749 + (Math.random() - 0.5) * 0.2] as [
            number,
            number,
          ],
          address: searchQuery,
          city: searchQuery.split(",")[1]?.trim() || "San Francisco",
          state: searchQuery.split(",")[2]?.trim() || "CA",
          propertyType: "Single Family Home",
          yearBuilt: 2000 + Math.floor(Math.random() * 24),
          lastSale: "2024-01-01",
          marketValue: 500000 + Math.floor(Math.random() * 1000000),
          rentEstimate: 2000 + Math.floor(Math.random() * 3000),
          neighborhood: "Downtown",
          walkScore: 60 + Math.floor(Math.random() * 40),
          crimeRate: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
          appreciation: Math.random() * 20,
          verified: Math.random() > 0.3,
          scamReports: Math.floor(Math.random() * 3),
          tenantReviews: 3 + Math.random() * 2,
          sqft: 1000 + Math.floor(Math.random() * 2000),
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          marketTrend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
        }

        handleSearchResults([mockResult])
      } catch (error) {
        console.error("Quick search error:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleGetStarted = () => {
    document.getElementById("wealth-map")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToSearch = () => {
    document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  // Don't render dynamic content until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">TrueEstate</h1>
                <p className="text-xs text-gray-600">Clarity before Capital</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={scrollToSearch} className="text-gray-600 hover:text-blue-600 transition-colors">
                Search Properties
              </button>
              <button onClick={scrollToAbout} className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </button>
              {currentUser && <RealTimeNotifications userId={currentUser.id || "demo-user"} />}
              <AuthHeader />
              {!isAuthenticated && <Button onClick={handleGetStarted}>Get Started</Button>}
            </nav>
          </div>
        </div>
      </header>

      {/* Conditional Marketing Content - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <>
          {/* Real-Time Alert Banner */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-2">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">LIVE ALERT:</span>
                <span>{realTimeData.scamsPrevented} rental scams prevented this month</span>
                <span className="mx-2">•</span>
                <span>{realTimeData.newListings} new verified properties added today</span>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <section className="container mx-auto px-4 py-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm mb-8">
                <Shield className="w-4 h-4" />
                Clarity before Capital
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Know Your Landlord. <span className="text-blue-600">Protect Your Investment.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              The first real estate intelligence platform that provides complete transparency into property ownership,
              landlord credibility, and market dynamics. Make informed decisions with verified data before you invest
              your capital.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                <Eye className="w-5 h-5 mr-2" />
                Explore Live Wealth Map
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open("/data-transparency", "_blank")}>
                <TrendingUp className="w-5 h-5 mr-2" />
                View Market Analytics
              </Button>
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Enter any address to verify ownership and check for scams..."
                  className="pl-12 pr-16 py-4 text-lg rounded-xl border-2 shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleQuickSearch()}
                />
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg bg-blue-600 hover:bg-blue-700"
                  onClick={handleQuickSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Try: "123 Main St, San Francisco" or "Apartment Brooklyn NY"</p>
            </div>
          </section>

          {/* Real-Time Statistics */}
          <RealTimeStats data={realTimeData} />
        </>
      )}

      {/* Main Wealth Map Section - Always visible, but positioned differently for authenticated users */}
      <section id="wealth-map" className={`container mx-auto px-4 ${isAuthenticated ? "py-4" : "py-8"}`}>
        <div className="text-center mb-8" id="search-section">
          <h2 className="text-3xl font-bold mb-4">
            {isAuthenticated ? "Real Estate Intelligence Dashboard" : "Live Real Estate Intelligence Map"}
          </h2>
          <p className="text-gray-600 mb-6">
            Real-time property ownership data, trust scores, and market intelligence powered by AI
          </p>

          {/* Enhanced Search */}
          <AdvancedSearchFilters
            onFiltersChange={(filters) => console.log("Filters changed:", filters)}
            onSearch={(query, filters) => console.log("Search triggered:", query, filters)}
            onResults={handleSearchResults}
          />

          {/* Search Results Section */}
          {showSearchResults && searchResults.length > 0 && (
            <section id="search-results" className="container mx-auto px-4 py-8">
              <SearchResults
                properties={searchResults}
                onPropertySelect={handlePropertySelect}
                onBookmark={(property) => {
                  console.log("Bookmarked:", property)
                }}
                onCompare={(properties) => {
                  setSelectedForComparison(properties)
                  document.getElementById("property-comparison")?.scrollIntoView({ behavior: "smooth" })
                }}
                searchQuery={searchQuery}
              />
            </section>
          )}

          {/* Map View Toggle */}
          <div className="flex justify-center gap-2 mt-4 mb-6">
            <Button
              variant={mapView === "properties" ? "default" : "outline"}
              onClick={() => setMapView("properties")}
              size="sm"
              className={mapView === "properties" ? "bg-blue-600 text-white" : ""}
            >
              Property View
            </Button>
            <Button
              variant={mapView === "heatmap" ? "default" : "outline"}
              onClick={() => setMapView("heatmap")}
              size="sm"
              className={mapView === "heatmap" ? "bg-blue-600 text-white" : ""}
            >
              Wealth Heatmap
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className={`${isAuthenticated ? "h-[600px] lg:h-[700px] xl:h-[800px]" : "h-[500px] lg:h-[600px] xl:h-[700px]"}`}
                >
                  {mapView === "properties" ? (
                    <MapboxGlobeMap properties={mapProperties} onPropertySelect={handlePropertySelect} />
                  ) : (
                    <WealthHeatmap properties={mapProperties} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Live Market Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Live Market Intelligence
                </CardTitle>
                <CardDescription>Real-time market data and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Portfolio Value</span>
                    <span className="font-semibold text-green-600">{realTimeData.totalValue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verified Properties</span>
                    <span className="font-semibold">{realTimeData.activeProperties}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Trusted Owners</span>
                    <span className="font-semibold text-blue-600">{realTimeData.verifiedOwners}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Trust Score</span>
                    <span className="font-semibold text-green-600">{realTimeData.avgTrustScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Scams Prevented</span>
                    <span className="font-semibold text-red-600">{realTimeData.scamsPrevented}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Bookmarks */}
            {currentUser && (
              <PropertyBookmarks userId={currentUser.id || "demo-user"} onPropertySelect={handlePropertySelect} />
            )}

            {/* Saved Map Views */}
            {currentUser && (
              <SavedMapViews
                userId={currentUser.id || "demo-user"}
                currentMapState={currentMapState}
                onLoadView={(mapState) => {
                  window.dispatchEvent(new CustomEvent("loadMapView", { detail: mapState }))
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Additional Tools Section - Always visible for authenticated users */}
      {isAuthenticated && (
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Advanced Real Estate Tools</h2>
            <p className="text-gray-600 mb-6">Professional tools and analytics for informed real estate decisions</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Extended Property Comparison */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Property Analysis Tools
                </CardTitle>
                <CardDescription>Compare properties and analyze market trends</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyComparison availableProperties={mapProperties} onCompare={setSelectedForComparison} />
              </CardContent>
            </Card>

            {/* Extended Data Export */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Data Export & Reports
                </CardTitle>
                <CardDescription>Generate comprehensive property reports</CardDescription>
              </CardHeader>
              <CardContent>
                <DataExport
                  properties={mapProperties}
                  selectedProperties={selectedForComparison}
                  onExport={(format, data) => {
                    console.log(`Exported ${data.length} properties as ${format}`)
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Knowledge Base Section - Always visible */}
      <section className="container mx-auto px-4 py-16" id="knowledge-base">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            {isAuthenticated ? "Real Estate Knowledge Center" : "Learn & Stay Protected"}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {isAuthenticated
              ? "Access comprehensive guides, market insights, and professional resources for real estate professionals"
              : "Access our comprehensive knowledge base to learn about property verification, trust scores, and how to avoid rental scams"}
          </p>
        </div>
        <KnowledgeBase />
      </section>

      {/* Marketing Content - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <>
          {/* Enhanced Features Section */}
          <section className="bg-gray-50 py-16" id="about">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Production-Ready Real Estate Intelligence</h2>
              <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
                Enterprise-grade platform with real-time data integration, AI-powered verification, and comprehensive
                market analytics
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">AI-Powered Verification</h3>
                  <p className="text-gray-600 text-sm">
                    Machine learning algorithms analyze 50+ data points to generate real-time trust scores and detect
                    fraudulent listings
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-Time Market Intelligence</h3>
                  <p className="text-gray-600 text-sm">
                    Live property valuations, market trends, and ownership changes powered by multiple premium data
                    sources
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Enterprise Security</h3>
                  <p className="text-gray-600 text-sm">
                    Bank-level encryption, SOC 2 compliance, and secure API integrations protect sensitive property and
                    owner data
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Clarity before Capital</h2>
              <p className="text-xl mb-8 opacity-90">
                Join 10,000+ investors and renters who demand transparency before making financial commitments
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 border-2 border-white"
                  onClick={handleGetStarted}
                >
                  Start Free Trial
                </Button>
                <Link href="/property/1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white border-white hover:bg-white hover:text-blue-600 backdrop-blur-sm"
                  >
                    View Live Demo
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white hover:bg-white hover:text-blue-600 backdrop-blur-sm"
                  onClick={() => window.open("/api/enterprise", "_blank")}
                >
                  Enterprise Solutions
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer - Always visible */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">TrueEstate</h3>
                  <p className="text-xs text-gray-400">Clarity before Capital</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">© 2024 TrueEstate. All rights reserved.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="https://twitter.com/TrueEstate" className="text-gray-400 hover:text-white">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="https://linkedin.com/company/TrueEstate" className="text-gray-400 hover:text-white">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="https://facebook.com/TrueEstate" className="text-gray-400 hover:text-white">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

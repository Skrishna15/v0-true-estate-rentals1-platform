"use client"

import { useState, useEffect } from "react"
import { Building, DollarSign, Users, Eye, Shield, Search, MapPin, BarChart3, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InteractiveMap } from "@/components/interactive-map"
import { PropertySearch } from "@/components/property-search"
import Link from "next/link"
import { AuthDialog } from "@/components/auth-dialog"
import { GlobeMap } from "@/components/globe-map"

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

export default function HomePage() {
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null)
  const [mapProperties, setMapProperties] = useState(mockWealthData)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [mounted, setMounted] = useState(false)

  // Fix hydration mismatch by only showing dynamic content after mount
  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date().toLocaleTimeString())

    // Update time every 15 seconds
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 15000)

    return () => clearInterval(interval)
  }, [])

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

  const handleQuickSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await fetch(`/api/properties/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()

        if (data.success && data.properties.length > 0) {
          handleSearchResults(data.properties)
        } else {
          // Fallback to mock data for demo
          const mockResults = [
            {
              owner: "John Smith",
              address: searchQuery,
              city: "San Francisco",
              value: "$3,200/month",
              longitude: -122.4194 + Math.random() * 0.1,
              latitude: 37.7749 + Math.random() * 0.1,
            },
          ]
          handleSearchResults(mockResults)
        }
      } catch (error) {
        console.error("Search error:", error)
        // Fallback to mock data
        const mockResults = [
          {
            owner: "John Smith",
            address: searchQuery,
            city: "San Francisco",
            value: "$3,200/month",
            longitude: -122.4194 + Math.random() * 0.1,
            latitude: 37.7749 + Math.random() * 0.1,
          },
        ]
        handleSearchResults(mockResults)
      }

      // Scroll to map
      document.getElementById("wealth-map")?.scrollIntoView({ behavior: "smooth" })
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

  const handleSignIn = () => {
    // This will now open the proper auth dialog
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
                <p className="text-xs text-gray-600">Wealth Map & Owner Verification</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={scrollToSearch} className="text-gray-600 hover:text-blue-600 transition-colors">
                Search Properties
              </button>
              <button onClick={scrollToAbout} className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </button>
              <AuthDialog>
                <button className="text-gray-600 hover:text-blue-600 transition-colors">Sign In</button>
              </AuthDialog>
              <Button onClick={handleGetStarted}>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Live Alert Banner */}
      <div className="bg-red-500 text-white py-2 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span className="font-medium">LIVE ALERT: 251 rental scams prevented this month</span>
          <span>•</span>
          <span>12 new verified properties added today</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm mb-8">
            <Eye className="w-4 h-4" />
            Clarity before Capital
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Know Your Landlord. <span className="text-blue-600">Protect Your Investment.</span>
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          The first real estate intelligence platform that provides complete transparency into property ownership,
          landlord credibility, and market dynamics. Make informed decisions with verified data before you invest your
          capital.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="px-8 py-4 text-lg" onClick={handleGetStarted}>
            <Eye className="w-5 h-5 mr-2" />
            Explore Live Wealth Map
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-4 text-lg" onClick={scrollToAbout}>
            <BarChart3 className="w-5 h-5 mr-2" />
            View Market Analytics
          </Button>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="relative">
            <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              placeholder="Enter any address to verify ownership and check for scams..."
              className="pl-16 pr-20 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleQuickSearch()}
            />
            <Button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-xl px-6"
              onClick={handleQuickSearch}
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-3">Try: "123 Main St, San Francisco" or "Apartment Brooklyn NY"</p>
        </div>

        {/* Live Market Data Section */}
        <div className="mt-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            LIVE MARKET DATA
          </div>

          <h2 className="text-2xl font-bold mb-8">Real-Time Platform Statistics</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">$63.7M</div>
              <div className="text-sm text-gray-600">Total Portfolio Value</div>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Verified Properties</div>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Trusted Owners</div>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">91%</div>
              <div className="text-sm text-gray-600">Avg Trust Score</div>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">248</div>
              <div className="text-sm text-gray-600">Scams Prevented</div>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
              <div className="text-sm text-gray-600">New Listings Today</div>
            </Card>
          </div>

          {/* Only show timestamp after component mounts to prevent hydration mismatch */}
          {mounted && (
            <p className="text-xs text-gray-500 mt-6">Data updates every 15 seconds • Last sync: {currentTime}</p>
          )}
        </div>
      </section>

      {/* Main Wealth Map Section */}
      <section id="wealth-map" className="container mx-auto px-4 py-8">
        <div className="text-center mb-8" id="search-section">
          <h2 className="text-3xl font-bold mb-4">Real Estate Wealth Map</h2>
          <p className="text-gray-600 mb-6">
            Visualize property ownership patterns and verify landlord credibility with real-time data
          </p>

          {/* Enhanced Search */}
          <PropertySearch onResults={handleSearchResults} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Interactive Map - Primary Feature */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-[600px]">
              <CardContent className="p-0 h-full">
                <InteractiveMap properties={mapProperties} onPropertySelect={handlePropertySelect} />
              </CardContent>
            </Card>
          </div>

          {/* Trust & Verification Rankings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verified Property Owners
                </CardTitle>
                <CardDescription>Ranked by trust score and verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mapProperties
                    .sort((a, b) => b.trustScore - a.trustScore)
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
                            <p className="text-sm text-gray-600">#{index + 1} most trusted</p>
                          </div>
                          <Badge
                            className={`${owner.trustScore >= 90 ? "bg-green-500" : owner.trustScore >= 80 ? "bg-yellow-500" : "bg-red-500"} text-white`}
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {owner.trustScore}% Trust
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                          <div>
                            <span className="text-gray-500">Portfolio Value:</span>
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
                            <Link href={`/property/${owner.id}`}>
                              <Button size="sm" className="mt-2 w-full">
                                View Properties & Verification
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust & Verification Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Verification Statistics
                </CardTitle>
                <CardDescription>Live transparency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verified Owners</span>
                    <span className="font-semibold text-green-600">
                      {mapProperties.filter((p) => p.trustScore >= 80).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Properties Tracked</span>
                    <span className="font-semibold">{mapProperties.reduce((acc, p) => acc + p.properties, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Trust Score</span>
                    <span className="font-semibold text-blue-600">
                      {Math.round(mapProperties.reduce((acc, p) => acc + p.trustScore, 0) / mapProperties.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Scam Prevention Rate</span>
                    <span className="font-semibold text-green-600">98.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem Solution Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Trust & Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Identity Verification</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ownership Documents</span>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Background Checks</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Community Reviews</span>
                    <Badge className="bg-blue-100 text-blue-800">Live</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3D Globe Map Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Global Property Network</h2>
          <p className="text-gray-600 mb-6">Explore verified properties worldwide on our interactive 3D globe</p>
        </div>

        <div className="h-96 lg:h-[600px] rounded-xl overflow-hidden shadow-2xl">
          <GlobeMap
            properties={mapProperties.map((prop) => ({
              ...prop,
              country: "USA",
              city: prop.locations[0] || "Unknown",
            }))}
            onPropertySelect={handlePropertySelect}
          />
        </div>
      </section>

      {/* Trust & Verification Features */}
      <section className="bg-gray-50 py-16" id="about">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">How We Solve the Transparency Problem</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Our platform addresses the core issues in rental and real estate transparency through verified data and
            trust metrics
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Trust Score System</h3>
              <p className="text-gray-600 text-sm">
                AI-powered trust scoring combining verification status, reviews, and ownership history for instant
                credibility assessment
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Wealth Mapping</h3>
              <p className="text-gray-600 text-sm">
                Visual property ownership patterns and portfolio insights to understand landlord credibility and
                investment behavior
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Community Verification</h3>
              <p className="text-gray-600 text-sm">
                Peer reviews, Q&A with owners, and community-driven trust building to prevent scams and verify listings
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stop Falling Victim to Rental Scams</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who use TrueEstate to verify property owners and make informed rental decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleGetStarted}>
              Start Verifying Owners
            </Button>
            <Link href="/property/1">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                View Demo Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">TrueEstate</span>
              </div>
              <p className="text-gray-400">
                Solving real estate transparency through verified ownership data and trust metrics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Wealth Mapping</li>
                <li>Owner Verification</li>
                <li>Trust Scoring</li>
                <li>Scam Prevention</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Contact</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TrueEstate. Bringing transparency to real estate.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

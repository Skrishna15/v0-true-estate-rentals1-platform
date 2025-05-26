"use client"

import { useState, useEffect } from "react"
import {
  Building,
  Eye,
  TrendingUp,
  Search,
  MapPin,
  DollarSign,
  Shield,
  Users,
  AlertTriangle,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to wealth map with search
      window.location.href = `#wealth-map?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleExploreMap = () => {
    window.location.href = "#wealth-map"
  }

  const handleViewAnalytics = () => {
    window.location.href = "#analytics"
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Live Alert Banner */}
      <div className="bg-red-500 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">LIVE ALERT:</span>
          <span>251 rental scams prevented this month</span>
          <span>•</span>
          <span>12 new verified properties added today</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">TrueEstate</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button className="text-gray-600 hover:text-blue-600 transition-colors">Features</button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors">About</button>
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Clarity Badge */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
            <Eye className="w-4 h-4 mr-2" />
            Clarity before Capital
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Know Your Landlord. <span className="text-blue-600">Protect Your Investment.</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            The first real estate intelligence platform that provides complete transparency into property ownership,
            landlord credibility, and market dynamics. Make informed decisions with verified data before you invest your
            capital.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg" onClick={handleExploreMap}>
              <Eye className="w-5 h-5 mr-2" />
              Explore Live Wealth Map
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2" onClick={handleViewAnalytics}>
              <TrendingUp className="w-5 h-5 mr-2" />
              View Market Analytics
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Enter any address to verify ownership and check for scams..."
                className="pl-12 pr-16 py-4 text-lg rounded-xl border-2 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg" onClick={handleSearch}>
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Example Searches */}
          <div className="text-sm text-gray-500">
            <span className="font-medium">Try:</span> "123 Main St, San Francisco" or "Apartment Brooklyn NY"
          </div>
        </div>

        {/* Live Market Data Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            LIVE MARKET DATA
          </div>
          <h2 className="text-3xl font-bold mb-8">Real-Time Platform Statistics</h2>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="text-center p-6 bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">$63.7M</div>
              <div className="text-sm text-gray-600">Total Portfolio Value</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Verified Properties</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Trusted Owners</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">91%</div>
              <div className="text-sm text-gray-600">Avg Trust Score</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">248</div>
              <div className="text-sm text-gray-600">Scams Prevented</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
              <div className="text-sm text-gray-600">New Listings Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Data Update Info */}
        <div className="text-center text-sm text-gray-500">
          Data updates every 15 seconds • Last sync: {formatTime(currentTime)}
        </div>
      </main>

      {/* Wealth Map Section (Hidden by default, shown when navigated to) */}
      <section id="wealth-map" className="hidden">
        {/* This would contain the interactive map component */}
      </section>

      {/* Analytics Section (Hidden by default, shown when navigated to) */}
      <section id="analytics" className="hidden">
        {/* This would contain the analytics dashboard */}
      </section>
    </div>
  )
}

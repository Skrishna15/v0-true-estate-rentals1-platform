"use client"

import { useState } from "react"
import { Search, TrendingUp, Shield, Eye, Users, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedMap } from "@/components/enhanced-map"
import { Header } from "@/components/header"

export default function HomePage() {
  const [mapView, setMapView] = useState<"property" | "wealth">("property")

  const sampleProperties = [
    {
      id: "1",
      coordinates: [37.7749, -122.4194] as [number, number],
      owner: "Sample Owner",
      value: "$790,857",
      trustScore: 99,
      address: "las vegas, San Francisco, CA",
      sqft: 1341,
      beds: 2,
      baths: 2,
      status: "unverified" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Real Estate Intelligence Platform</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Verify property ownership, analyze market trends, and make informed real estate decisions with AI-powered
            insights
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input placeholder="Search properties, owners, or addresses..." className="pl-12 pr-4 py-3 text-lg" />
              </div>
              <Button size="lg" className="px-8">
                Search
              </Button>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                <Eye className="w-5 h-5 mr-2" />
                Explore Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/globe">
                <Globe className="w-5 h-5 mr-2" />
                3D Globe View
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/learn">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Property Intelligence Map</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore real-time property data, ownership verification, and market insights on our interactive map
            </p>
          </div>

          <EnhancedMap properties={sampleProperties} showSavedProperties={true} showLiveIntelligence={true} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose TrueEstate?</h2>
            <p className="text-gray-600">Comprehensive real estate intelligence at your fingertips</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Verified Ownership</CardTitle>
                <CardDescription>
                  AI-powered verification system ensures property ownership authenticity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Market Intelligence</CardTitle>
                <CardDescription>Real-time market data and trends from multiple trusted sources</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Trust Scores</CardTitle>
                <CardDescription>Comprehensive trust scoring system to evaluate property owners</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users making smarter real estate decisions</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard">Start Exploring</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

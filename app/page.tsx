"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Building, Search, Shield, TrendingUp, Users, MapPin, CheckCircle, ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">TrueEstate Rentals</h1>
                <p className="text-xs text-gray-600">Transparency in Real Estate</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/properties" className="text-gray-600 hover:text-blue-600 transition-colors">
                Properties
              </Link>
              <Link href="/wealth-map" className="text-gray-600 hover:text-blue-600 transition-colors">
                Wealth Map
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              {session?.user.role === "admin" && (
                <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">Welcome, {session.user.name}</span>
                  <Button asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Transparent Real Estate for
            <span className="text-blue-600"> Everyone</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover verified property owners, transparent pricing, and trusted listings. Make informed decisions with
            our comprehensive wealth mapping and owner verification system.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by address, city, or owner name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 pr-4 py-4 text-lg"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Try: "123 Main St, San Francisco" or "Sarah Johnson Properties"
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8" asChild>
              <Link href="/wealth-map">
                <MapPin className="w-5 h-5 mr-2" />
                Explore Wealth Map
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose TrueEstate Rentals?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with comprehensive data to provide unmatched transparency in
              real estate transactions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Owner Verification</CardTitle>
                <CardDescription>
                  Every property owner is verified through multiple data sources and background checks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Identity verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Financial background checks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Business entity validation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Wealth Mapping</CardTitle>
                <CardDescription>
                  Visualize property ownership patterns and wealth distribution across markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Interactive property maps
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Owner portfolio analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Market trend insights
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Community Reviews</CardTitle>
                <CardDescription>Read verified tenant reviews and ratings for properties and landlords</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Verified tenant reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Landlord ratings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Property quality scores
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600">
              Join the growing community of informed real estate professionals and renters
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Verified Properties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25K+</div>
              <div className="text-gray-600">Verified Owners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100K+</div>
              <div className="text-gray-600">User Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust TrueEstate Rentals for transparent real estate data
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">TrueEstate Rentals</h3>
                  <p className="text-xs text-gray-400">Transparency in Real Estate</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Making real estate transparent and accessible for everyone through verified data and community insights.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/properties" className="hover:text-white">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href="/wealth-map" className="hover:text-white">
                    Wealth Map
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-white">
                    Search
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-white">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 TrueEstate Rentals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

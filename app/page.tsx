"use client"

import { useState } from "react"
import { Search, MapPin, Star, Shield, TrendingUp, Users, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TrueEstate</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/properties" className="text-gray-600 hover:text-gray-900">
                Properties
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
              <Button variant="outline" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Find Your Perfect Rental</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover verified properties with transparent ownership information and trusted landlords
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by location, property type, or landlord..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                Search
              </Button>
            </div>
          </div>

          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Verified Properties
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              Trusted Landlords
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Transparent Pricing
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TrueEstate?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine a user-friendly rental platform with powerful transparency tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Verified Properties</CardTitle>
                <CardDescription>All properties are verified with transparent ownership information</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Owner verification</li>
                  <li>• Property documentation</li>
                  <li>• Trust score ratings</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Trusted Community</CardTitle>
                <CardDescription>Connect with verified landlords and reliable tenants</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Landlord ratings</li>
                  <li>• Tenant reviews</li>
                  <li>• Community feedback</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>Get real-time market data and pricing transparency</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Market analysis</li>
                  <li>• Price comparisons</li>
                  <li>• Neighborhood data</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600">Discover our most popular verified rental properties</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                title: "Modern Downtown Apartment",
                location: "San Francisco, CA",
                price: "$3,200/month",
                bedrooms: 2,
                bathrooms: 2,
                sqft: "1,200",
                trustScore: 95,
                image: "/placeholder.svg?height=200&width=300&query=modern apartment",
              },
              {
                id: 2,
                title: "Cozy Family House",
                location: "Austin, TX",
                price: "$2,800/month",
                bedrooms: 3,
                bathrooms: 2,
                sqft: "1,800",
                trustScore: 92,
                image: "/placeholder.svg?height=200&width=300&query=family house",
              },
              {
                id: 3,
                title: "Luxury Condo",
                location: "Miami, FL",
                price: "$4,500/month",
                bedrooms: 2,
                bathrooms: 3,
                sqft: "1,500",
                trustScore: 98,
                image: "/placeholder.svg?height=200&width=300&query=luxury condo",
              },
            ].map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    <Shield className="w-3 h-3 mr-1" />
                    {property.trustScore}%
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-3">{property.price}</div>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{property.bedrooms} bed</span>
                    <span>{property.bathrooms} bath</span>
                    <span>{property.sqft} sqft</span>
                  </div>
                  <Button className="w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Home?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of renters who trust TrueEstate for their housing needs
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-6 w-6" />
                <span className="text-xl font-bold">TrueEstate</span>
              </div>
              <p className="text-gray-400">Transparent rentals with verified properties and trusted landlords.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Renters</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/properties" className="hover:text-white">
                    Browse Properties
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-white">
                    Advanced Search
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Renter Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Landlords</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/list-property" className="hover:text-white">
                    List Property
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-white">
                    Get Verified
                  </Link>
                </li>
                <li>
                  <Link href="/landlord-tools" className="hover:text-white">
                    Landlord Tools
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
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
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TrueEstate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

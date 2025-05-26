import { Search, Eye, Shield, BarChart3, MessageSquare, FileText, MapPin, Star, Users, Building } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HomePage() {
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
                <p className="text-xs text-gray-600">Transparency in Real Estate</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/wealth-map" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <Eye className="w-4 h-4" />
                Wealth Map
              </Link>
              <Link href="/properties" className="text-gray-600 hover:text-blue-600">
                Property Search
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Link href="/saved" className="text-gray-600 hover:text-blue-600">
                Saved
              </Link>
              <Link href="/signin" className="text-gray-600 hover:text-blue-600">
                Sign In
              </Link>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm mb-8">
            <Shield className="w-4 h-4" />
            Solving Real Estate Transparency Crisis
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Stop Rental Scams. <span className="text-blue-600">Verify Every Owner.</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The rental market lacks transparency. Fake listings, unverified owners, and hidden wealth structures put
          renters and investors at risk. TrueEstate provides verified ownership data, trust scores, and wealth mapping
          to make informed decisions.
        </p>

        <Button size="lg" className="mb-12">
          <Eye className="w-5 h-5 mr-2" />
          Explore Wealth Map
        </Button>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search any property address to verify ownership..."
              className="pl-12 pr-16 py-4 text-lg rounded-xl border-2"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties with Trust Scores */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Verified Properties</h2>
          <p className="text-gray-600">Properties with verified ownership and trust scores</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 1,
              address: "123 Oak Street, San Francisco, CA",
              price: "$4,500/month",
              owner: "Sarah Johnson",
              trustScore: 95,
              verified: true,
              image: "/placeholder.svg?height=200&width=300",
              bedrooms: 2,
              bathrooms: 2,
            },
            {
              id: 2,
              address: "456 Pine Avenue, Los Angeles, CA",
              price: "$3,200/month",
              owner: "Michael Chen",
              trustScore: 88,
              verified: true,
              image: "/placeholder.svg?height=200&width=300",
              bedrooms: 3,
              bathrooms: 2,
            },
            {
              id: 3,
              address: "789 Maple Drive, Seattle, WA",
              price: "$2,800/month",
              owner: "Emily Rodriguez",
              trustScore: 92,
              verified: true,
              image: "/placeholder.svg?height=200&width=300",
              bedrooms: 1,
              bathrooms: 1,
            },
          ].map((property) => (
            <Link key={property.id} href={`/property/${property.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.address}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {/* Trust Score Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`${property.trustScore >= 90 ? "bg-green-500" : property.trustScore >= 80 ? "bg-yellow-500" : "bg-red-500"} text-white`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {property.trustScore}% Trust
                    </Badge>
                  </div>
                  {property.verified && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-500 text-white">
                        <FileText className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{property.price}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      4.8
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{property.address}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {property.owner
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">Owner: {property.owner}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-red-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-red-800">The Transparency Crisis</h2>
          <p className="text-red-700 mb-12 max-w-3xl mx-auto">
            Renters lose millions to scams. Investors can't verify ownership. The system lacks accountability.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-red-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2 text-red-800">$1.2B Lost to Rental Scams</h3>
              <p className="text-red-600 text-sm">Fake listings and unverified owners cost renters billions annually</p>
            </Card>

            <Card className="p-6 border-red-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2 text-red-800">Hidden Ownership Structures</h3>
              <p className="text-red-600 text-sm">Complex LLCs and shell companies obscure true property controllers</p>
            </Card>

            <Card className="p-6 border-red-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2 text-red-800">No Landlord Accountability</h3>
              <p className="text-red-600 text-sm">
                No centralized system to verify landlord credibility or track performance
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Verification Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Solution: 6 Core Trust Features</h2>
          <p className="text-gray-600">Addressing transparency through verification, analytics, and community</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 text-center border-green-200 bg-green-50">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-green-800">1. Trust Score Badges</h3>
            <p className="text-green-700 text-sm">
              AI-powered trust scoring combining verification + reviews. Green badge = safe to rent.
            </p>
          </Card>

          <Card className="p-6 text-center border-blue-200 bg-blue-50">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-blue-800">2. Ownership Validation</h3>
            <p className="text-blue-700 text-sm">
              View verified ownership documents and legal proof. No more fake listings.
            </p>
          </Card>

          <Card className="p-6 text-center border-purple-200 bg-purple-50">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-purple-800">3. Owner Analytics Dashboard</h3>
            <p className="text-purple-700 text-sm">
              Portfolio insights, property distribution, and investment patterns.
            </p>
          </Card>

          <Card className="p-6 text-center border-orange-200 bg-orange-50">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-orange-800">4. Neighborhood Insights</h3>
            <p className="text-orange-700 text-sm">Live data on schools, hospitals, transport from Google Maps API.</p>
          </Card>

          <Card className="p-6 text-center border-teal-200 bg-teal-50">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-teal-800">5. Community Comments</h3>
            <p className="text-teal-700 text-sm">Social proof through renter reviews and community feedback.</p>
          </Card>

          <Card className="p-6 text-center border-indigo-200 bg-indigo-50">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-indigo-800">6. Owner Q&A Panel</h3>
            <p className="text-indigo-700 text-sm">
              Direct communication with verified owners. Ask questions, get answers.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Informed Decisions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust TrueEstate for verified property information
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">TrueEstate</span>
              </div>
              <p className="text-gray-400">
                Bringing transparency to real estate through verified data and trust metrics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/wealth-map">Wealth Map</Link>
                </li>
                <li>
                  <Link href="/properties">Property Search</Link>
                </li>
                <li>
                  <Link href="/verification">Verification</Link>
                </li>
                <li>
                  <Link href="/analytics">Analytics</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/press">Press</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms</Link>
                </li>
                <li>
                  <Link href="/security">Security</Link>
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

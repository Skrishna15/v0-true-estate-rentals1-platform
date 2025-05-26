import {
  Search,
  Eye,
  Shield,
  BarChart3,
  MessageSquare,
  FileText,
  MapPin,
  Users,
  Building,
  DollarSign,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  // In a real app, you'd check authentication status here
  const isLoggedIn = false // This would come from your auth system

  if (isLoggedIn) {
    // Redirect to dashboard for logged-in users
    return <DashboardPage />
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
      <header className="border-b bg-white sticky top-0 z-50">
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
              <Link href="/learn" className="text-gray-600 hover:text-blue-600">
                Learn
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
                Pricing
              </Link>
              <Link href="/signin" className="text-gray-600 hover:text-blue-600">
                Sign In
              </Link>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="container mx-auto px-4 py-8 md:py-16 text-center">
        {/* Clarity before Capital Badge */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 md:px-4 py-2 rounded-full text-sm border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Clarity before Capital
          </div>
        </div>

        {/* Main Headline - Responsive Text */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
          Know Your Landlord. <span className="text-blue-600">Protect Your Investment.</span>
        </h1>

        {/* Subtitle - Responsive */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
          The first real estate intelligence platform that provides complete transparency into property ownership,
          landlord credibility, and market dynamics. Make informed decisions with verified data before you invest your
          capital.
        </p>

        {/* CTA Buttons - Mobile Stack */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg">
            <Eye className="w-4 md:w-5 h-4 md:h-5 mr-2" />
            Explore Live Wealth Map
          </Button>
          <Button size="lg" variant="outline" className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg">
            <BarChart3 className="w-4 md:w-5 h-4 md:h-5 mr-2" />
            View Market Analytics
          </Button>
        </div>

        {/* Search Bar - Mobile Optimized */}
        <div className="max-w-3xl mx-auto mb-4 px-4">
          <div className="relative">
            <MapPin className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 md:w-5 h-4 md:h-5" />
            <Input
              placeholder="Enter any address to verify ownership and check for scams..."
              className="pl-10 md:pl-12 pr-12 md:pr-16 py-3 md:py-4 text-base md:text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
            />
            <Button className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 rounded-lg bg-blue-600 hover:bg-blue-700 p-2 md:p-3">
              <Search className="w-4 md:w-5 h-4 md:h-5" />
            </Button>
          </div>
        </div>

        {/* Search Examples */}
        <p className="text-gray-500 text-sm px-4">Try: "123 Main St, San Francisco" or "Apartment Brooklyn NY"</p>
      </section>

      {/* Live Market Data Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            LIVE MARKET DATA
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Real-Time Platform Statistics</h2>
        </div>

        {/* Statistics Grid - Mobile Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 mb-8">
          <Card className="text-center p-3 md:p-6 bg-green-50 border-green-200">
            <div className="w-8 md:w-12 h-8 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-4">
              <DollarSign className="w-4 md:w-6 h-4 md:h-6 text-green-600" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-green-800 mb-1">$63.7M</div>
            <div className="text-xs md:text-sm text-green-600">Total Portfolio Value</div>
          </Card>

          <Card className="text-center p-3 md:p-6 bg-blue-50 border-blue-200">
            <div className="w-8 md:w-12 h-8 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-4">
              <Building className="w-4 md:w-6 h-4 md:h-6 text-blue-600" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-blue-800 mb-1">5</div>
            <div className="text-xs md:text-sm text-blue-600">Verified Properties</div>
          </Card>

          <Card className="text-center p-3 md:p-6 bg-purple-50 border-purple-200">
            <div className="w-8 md:w-12 h-8 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-4">
              <Users className="w-4 md:w-6 h-4 md:h-6 text-purple-600" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-purple-800 mb-1">5</div>
            <div className="text-xs md:text-sm text-purple-600">Trusted Owners</div>
          </Card>

          <Card className="text-center p-3 md:p-6 bg-indigo-50 border-indigo-200">
            <div className="w-8 md:w-12 h-8 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-4">
              <Shield className="w-4 md:w-6 h-4 md:h-6 text-indigo-600" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-indigo-800 mb-1">91%</div>
            <div className="text-xs md:text-sm text-indigo-600">Avg Trust Score</div>
          </Card>

          <Card className="text-center p-3 md:p-6 bg-red-50 border-red-200">
            <div className="w-8 md:w-12 h-8 md:h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-4">
              <AlertTriangle className="w-4 md:w-6 h-4 md:h-6 text-red-600" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-red-800 mb-1">248</div>
            <div className="text-xs md:text-sm text-red-600">Scams Prevented</div>
          </Card>

          <Card className="text-center p-3 md:p-6 bg-orange-50 border-orange-200">
            <div className="w-8 md:w-12 h-8 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-4">
              <TrendingUp className="w-4 md:w-6 h-4 md:h-6 text-orange-600" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-orange-800 mb-1">12</div>
            <div className="text-xs md:text-sm text-orange-600">New Listings Today</div>
          </Card>
        </div>

        {/* Data Update Info */}
        <div className="text-center text-sm text-gray-500">
          Data updates every 15 seconds • Last sync: {new Date().toLocaleTimeString()}
        </div>
      </section>

      {/* Trust & Verification Features */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why TrueEstate?</h2>
            <p className="text-gray-600">The only platform that verifies every landlord and property owner</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center border-green-200 bg-green-50">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-green-800">Trust Score Verification</h3>
              <p className="text-green-700 text-sm">
                AI-powered trust scoring combining identity verification, background checks, and community reviews.
              </p>
            </Card>

            <Card className="p-6 text-center border-blue-200 bg-blue-50">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-blue-800">Legal Document Verification</h3>
              <p className="text-blue-700 text-sm">
                View verified ownership documents, property deeds, and business registrations.
              </p>
            </Card>

            <Card className="p-6 text-center border-purple-200 bg-purple-50">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-purple-800">Wealth Map Analytics</h3>
              <p className="text-purple-700 text-sm">
                Complete portfolio insights, investment patterns, and market analysis.
              </p>
            </Card>

            <Card className="p-6 text-center border-orange-200 bg-orange-50">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-orange-800">Live Neighborhood Data</h3>
              <p className="text-orange-700 text-sm">
                Real-time insights on schools, transportation, and local amenities.
              </p>
            </Card>

            <Card className="p-6 text-center border-teal-200 bg-teal-50">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-teal-800">Community Reviews</h3>
              <p className="text-teal-700 text-sm">
                Verified renter reviews and direct communication with property owners.
              </p>
            </Card>

            <Card className="p-6 text-center border-red-200 bg-red-50">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-red-800">Scam Prevention</h3>
              <p className="text-red-700 text-sm">Real-time alerts and verification to protect against rental fraud.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Invest with Confidence?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors and renters who trust TrueEstate for verified property intelligence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 px-8 py-4"
            >
              Schedule Demo
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
                The first real estate intelligence platform providing complete transparency into property ownership and
                market dynamics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/wealth-map">Wealth Map</Link>
                </li>
                <li>
                  <Link href="/verification">Verification</Link>
                </li>
                <li>
                  <Link href="/analytics">Analytics</Link>
                </li>
                <li>
                  <Link href="/api">API</Link>
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

// Dashboard component for logged-in users
function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">TrueEstate</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/properties" className="text-gray-600 hover:text-blue-600">
                Properties
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-blue-600">
                Analytics
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                Profile
              </Link>
              <Button variant="outline">Sign Out</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Redirect to wealth map for logged-in users */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
          <p className="text-gray-600 mb-6">Redirecting you to the live wealth map...</p>
          <Link href="/wealth-map">
            <Button size="lg">
              <Eye className="w-5 h-5 mr-2" />
              Go to Wealth Map
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

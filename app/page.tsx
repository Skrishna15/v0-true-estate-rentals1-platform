"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Search, Eye, Shield, Building, MapPin, AlertTriangle, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect authenticated users to wealth map
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/wealth-map")
    }
  }, [session, status, router])

  // Show loading or redirect for authenticated users
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === "authenticated") {
    return null // Will redirect to wealth map
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
                <h1 className="font-bold text-xl text-gray-900">TrueEstate</h1>
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
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm mb-8">
            <Shield className="w-4 h-4" />
            Solving Real Estate Transparency Crisis
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
          Verify Property Owners. <span className="text-blue-600">Map Hidden Wealth.</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
          Stop falling victim to rental scams and unverified listings. Access verified ownership data, wealth profiles,
          and trust metrics to make informed real estate decisions.
        </p>

        <Button size="lg" className="mb-12 bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/wealth-map">
            <Eye className="w-5 h-5 mr-2" />
            Explore Wealth Map
          </Link>
        </Button>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-white rounded-lg shadow-sm border">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search any property address to verify ownership..."
              className="pl-12 pr-16 py-4 text-lg border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-md bg-blue-600 hover:bg-blue-700">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">The Real Estate Transparency Problem</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
            Current rental and real estate ecosystem lacks critical transparency, putting renters and investors at risk
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 border-0 shadow-sm bg-red-50">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-3 text-lg text-gray-900">$1.2B Lost to Rental Scams</h3>
              <p className="text-gray-600">
                Fake listings and unverified owners cost renters billions annually with no way to verify legitimacy
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-sm bg-orange-50">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-3 text-lg text-gray-900">Hidden Ownership Networks</h3>
              <p className="text-gray-600">
                Complex LLCs and shell companies obscure true property controllers and wealth patterns
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-sm bg-yellow-50">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-3 text-lg text-gray-900">No Landlord Credibility Data</h3>
              <p className="text-gray-600">
                Renters can't verify landlord history, response rates, or trustworthiness before signing leases
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Verification Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Trust & Verification System</h2>
            <p className="text-gray-600 text-lg">
              Advanced verification and trust scoring for safer real estate transactions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center border-0 shadow-sm bg-white">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Trust Score</h3>
              <p className="text-gray-600 text-sm">AI-powered trust scoring based on verification + reviews</p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-sm bg-white">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Ownership Docs</h3>
              <p className="text-gray-600 text-sm">Verified ownership documents and legal proof</p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-sm bg-white">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Wealth Analytics</h3>
              <p className="text-gray-600 text-sm">Portfolio insights and investment patterns</p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-sm bg-white">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-gray-600 text-sm">Reviews, comments, and Q&A with owners</p>
            </Card>
          </div>
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
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/wealth-map">View Demo</Link>
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
                  <Link href="/wealth-map" className="hover:text-white">
                    Wealth Map
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="hover:text-white">
                    Property Search
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-white">
                    Verification
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
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
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
                  <Link href="/press" className="hover:text-white">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white">
                    Security
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

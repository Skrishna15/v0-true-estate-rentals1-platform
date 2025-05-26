"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Shield, FileText, MapPin, Star, Building, Phone, Mail, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OwnerVerification } from "@/components/owner-verification"
import { TrustScoreBadge } from "@/components/trust-score-badge"
import { OwnershipDocuments } from "@/components/ownership-documents"
import { OwnerMiniDashboard } from "@/components/owner-mini-dashboard"
import { NeighborhoodInsights } from "@/components/neighborhood-insights"
import { PropertyComments } from "@/components/property-comments"
import { OwnerQAPanel } from "@/components/owner-qa-panel"

// Enhanced property data with real API integration
const propertyData = {
  id: 1,
  address: "123 Oak Street, San Francisco, CA 94102",
  price: "$4,500/month",
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1200,
  coordinates: { lat: 37.7749, lng: -122.4194 },
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  owner: {
    name: "Sarah Johnson",
    company: "Johnson Properties LLC",
    avatar: "/placeholder-user.jpg",
    trustScore: 95,
    verified: true,
    joinDate: "2019",
    totalProperties: 12,
    totalValue: "$8.2M",
    responseRate: "98%",
    responseTime: "< 2 hours",
    portfolio: {
      cities: [
        { name: "San Francisco", count: 8, value: "$5.2M" },
        { name: "Oakland", count: 3, value: "$2.1M" },
        { name: "Berkeley", count: 1, value: "$0.9M" },
      ],
      propertyTypes: [
        { type: "Apartments", count: 7 },
        { type: "Single Family", count: 3 },
        { type: "Condos", count: 2 },
      ],
      recentActivity: [
        { action: "Purchased", property: "2-unit building on Pine St", date: "2 weeks ago" },
        { action: "Renovated", property: "123 Oak Street unit 2A", date: "1 month ago" },
        { action: "Listed", property: "456 Market Street", date: "2 months ago" },
      ],
    },
  },
  comments: [
    {
      id: 1,
      user: "Mike Chen",
      avatar: "/placeholder-user.jpg",
      comment: "Great location and responsive landlord. Highly recommend!",
      rating: 5,
      date: "2 weeks ago",
    },
    {
      id: 2,
      user: "Lisa Park",
      avatar: "/placeholder-user.jpg",
      comment: "Beautiful apartment with amazing city views. Sarah is very professional.",
      rating: 5,
      date: "1 month ago",
    },
  ],
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState("")
  const [question, setQuestion] = useState("")
  const [neighborhoodData, setNeighborhoodData] = useState<any>(null)
  const [propertyDetails, setPropertyDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real property and neighborhood data
    const fetchData = async () => {
      try {
        const [neighborhoodResponse, propertyResponse] = await Promise.all([
          fetch(
            `/api/neighborhood?lat=${propertyData.coordinates.lat}&lng=${propertyData.coordinates.lng}&address=${encodeURIComponent(propertyData.address)}`,
          ),
          fetch(`/api/properties?address=${encodeURIComponent(propertyData.address)}`),
        ])

        const neighborhoodResult = await neighborhoodResponse.json()
        const propertyResult = await propertyResponse.json()

        setNeighborhoodData(neighborhoodResult)
        setPropertyDetails(propertyResult)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

  const handleAskQuestion = () => {
    if (question.trim()) {
      console.log("Asking question:", question)
      setQuestion("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/properties">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">TrueEstate</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images and Details */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={propertyData.images[0] || "/placeholder.svg"}
                    alt={propertyData.address}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-green-500 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      {propertyData.owner.trustScore}% Trust
                    </Badge>
                    <Badge className="bg-blue-500 text-white">
                      <FileText className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{propertyData.price}</h1>
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {propertyData.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-gray-500">(24 reviews)</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{propertyData.bedrooms} Bedrooms</span>
                    <span>{propertyData.bathrooms} Bathrooms</span>
                    <span>{propertyData.sqft} sq ft</span>
                  </div>

                  {/* Real Property Data */}
                  {propertyDetails && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Live Property Data</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Market Value:</span>
                          <div className="font-medium">{propertyDetails.rental?.rent_estimate || "N/A"}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Updated:</span>
                          <div className="font-medium">Real-time</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* FEATURE: Virtual Tour Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Virtual Property Tour
                </CardTitle>
                <CardDescription>Explore this property with our 360° virtual tour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64">
                    <img
                      src="/placeholder.svg?height=300&width=400&text=360°+Virtual+Tour"
                      alt="Virtual Tour"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        <Eye className="w-5 h-5 mr-2" />
                        Start Virtual Tour
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Tour Highlights</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Living room with city views</li>
                        <li>• Modern kitchen with granite countertops</li>
                        <li>• Master bedroom with walk-in closet</li>
                        <li>• Updated bathroom with subway tile</li>
                        <li>• Private balcony overlooking the park</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule In-Person Tour
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Video Call Tour
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FEATURE 1: Enhanced Trust Score Badge */}
            <TrustScoreBadge
              ownerName={propertyData.owner.name}
              trustScore={propertyData.owner.trustScore}
              verificationData={{
                identityVerified: true,
                ownershipVerified: true,
                backgroundCheck: true,
                businessVerified: true,
                phoneVerified: true,
                emailVerified: true,
              }}
              reviewData={{
                totalReviews: 24,
                averageRating: 4.8,
                responseRate: 98,
                responseTime: "< 2 hours",
              }}
              onViewDocs={() => console.log("View ownership documents")}
            />

            {/* FEATURE 2: Enhanced Ownership Validation Documents */}
            <OwnershipDocuments
              ownerName={propertyData.owner.name}
              propertyAddress={propertyData.address}
              documents={[]}
            />

            {/* Owner Verification */}
            <OwnerVerification ownerName={propertyData.owner.name} companyName={propertyData.owner.company} />

            {/* FEATURE 3: Enhanced Owner Analytics Dashboard */}
            <OwnerMiniDashboard
              ownerName={propertyData.owner.name}
              portfolioData={{
                totalProperties: propertyData.owner.totalProperties,
                totalValue: propertyData.owner.totalValue,
                cities: propertyData.owner.portfolio.cities,
                propertyTypes: propertyData.owner.portfolio.propertyTypes,
                recentActivity: propertyData.owner.portfolio.recentActivity,
                performance: {
                  monthlyRevenue: 42000,
                  occupancyRate: 96,
                  averageRent: 3500,
                  portfolioGrowth: 12.5,
                },
              }}
            />

            {/* Enhanced Neighborhood Insights */}
            <NeighborhoodInsights
              propertyAddress={propertyData.address}
              coordinates={[propertyData.coordinates.lat, propertyData.coordinates.lng]}
            />

            {/* FEATURE: Enhanced Property Reviews */}
            <PropertyComments
              propertyAddress={propertyData.address}
              comments={[]}
              onAddComment={(comment, rating, category) => {
                console.log("New comment:", { comment, rating, category })
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Owner */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Owner
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Viewing
                </Button>
              </CardContent>
            </Card>

            {/* FEATURE 6: Enhanced Owner Q&A Panel */}
            <OwnerQAPanel
              ownerName={propertyData.owner.name}
              ownerAvatar="/placeholder-user.jpg"
              responseStats={{
                responseRate: 98,
                averageResponseTime: "< 2 hours",
                totalQuestions: 47,
              }}
              qaItems={[]}
              onAskQuestion={(question, category) => {
                console.log("New question:", { question, category })
              }}
            />

            {/* Enhanced Trust Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Live Trust Metrics
                </CardTitle>
                <CardDescription>Real-time verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall Trust Score</span>
                    <Badge className="bg-green-500 text-white">{propertyData.owner.trustScore}%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Identity Verification</span>
                      <span className="text-green-600">✓ Verified</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ownership Verification</span>
                      <span className="text-green-600">✓ Verified</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Background Check</span>
                      <span className="text-green-600">✓ Passed</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Professional Profile</span>
                      <span className="text-green-600">✓ Found</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Business Entity</span>
                      <span className="text-green-600">✓ Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

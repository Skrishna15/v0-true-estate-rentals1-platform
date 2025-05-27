"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Shield,
  FileText,
  MapPin,
  Star,
  MessageSquare,
  Send,
  Building,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

// Complete property data that matches our properties
const allPropertyData = {
  "1": {
    id: "1",
    title: "Modern Downtown Apartment",
    address: "123 Market St, San Francisco, CA",
    price: "$3,200/month",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    images: [
      "/placeholder.svg?height=400&width=600&query=modern apartment interior",
      "/placeholder.svg?height=400&width=600&query=modern apartment kitchen",
      "/placeholder.svg?height=400&width=600&query=modern apartment bedroom",
    ],
    owner: {
      name: "Sarah Johnson",
      company: "Johnson Properties LLC",
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
          { action: "Renovated", property: "123 Market Street unit 2A", date: "1 month ago" },
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
  },
  "2": {
    id: "2",
    title: "Cozy Family House",
    address: "456 Oak Avenue, Austin, TX",
    price: "$2,800/month",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    coordinates: { lat: 30.2672, lng: -97.7431 },
    images: [
      "/placeholder.svg?height=400&width=600&query=family house exterior",
      "/placeholder.svg?height=400&width=600&query=family house living room",
      "/placeholder.svg?height=400&width=600&query=family house backyard",
    ],
    owner: {
      name: "Michael Chen",
      company: "Chen Real Estate",
      trustScore: 92,
      verified: true,
      joinDate: "2020",
      totalProperties: 8,
      totalValue: "$4.5M",
      responseRate: "95%",
      responseTime: "< 3 hours",
      portfolio: {
        cities: [
          { name: "Austin", count: 6, value: "$3.2M" },
          { name: "Dallas", count: 2, value: "$1.3M" },
        ],
        propertyTypes: [
          { type: "Houses", count: 5 },
          { type: "Apartments", count: 3 },
        ],
        recentActivity: [
          { action: "Listed", property: "456 Oak Avenue", date: "1 week ago" },
          { action: "Renovated", property: "789 Elm Street", date: "3 weeks ago" },
        ],
      },
    },
    comments: [
      {
        id: 1,
        user: "Jennifer Smith",
        avatar: "/placeholder-user.jpg",
        comment: "Perfect for families! Great neighborhood and excellent landlord.",
        rating: 5,
        date: "1 week ago",
      },
    ],
  },
  "3": {
    id: "3",
    title: "Luxury Condo",
    address: "789 Ocean Drive, Miami, FL",
    price: "$4,500/month",
    bedrooms: 2,
    bathrooms: 3,
    sqft: 1500,
    coordinates: { lat: 25.7617, lng: -80.1918 },
    images: [
      "/placeholder.svg?height=400&width=600&query=luxury condo ocean view",
      "/placeholder.svg?height=400&width=600&query=luxury condo kitchen",
      "/placeholder.svg?height=400&width=600&query=luxury condo balcony",
    ],
    owner: {
      name: "Maria Garcia",
      company: "Garcia Luxury Properties",
      trustScore: 98,
      verified: true,
      joinDate: "2018",
      totalProperties: 15,
      totalValue: "$12.8M",
      responseRate: "99%",
      responseTime: "< 1 hour",
      portfolio: {
        cities: [
          { name: "Miami", count: 10, value: "$8.5M" },
          { name: "Fort Lauderdale", count: 5, value: "$4.3M" },
        ],
        propertyTypes: [
          { type: "Condos", count: 12 },
          { type: "Penthouses", count: 3 },
        ],
        recentActivity: [
          { action: "Acquired", property: "Luxury penthouse on Biscayne", date: "1 month ago" },
          { action: "Listed", property: "789 Ocean Drive", date: "2 weeks ago" },
        ],
      },
    },
    comments: [
      {
        id: 1,
        user: "Robert Johnson",
        avatar: "/placeholder-user.jpg",
        comment: "Absolutely stunning property with incredible ocean views!",
        rating: 5,
        date: "3 days ago",
      },
    ],
  },
  // Add more properties as needed
}

export default function PropertyPage() {
  const params = useParams()
  const propertyId = params.id as string

  // Get property data or use default
  const propertyData = allPropertyData[propertyId as keyof typeof allPropertyData] || {
    id: propertyId,
    title: "Property Details",
    address: "Property Address",
    price: "$0/month",
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    images: ["/placeholder.svg?height=400&width=600"],
    owner: {
      name: "Property Owner",
      company: "Real Estate Company",
      trustScore: 85,
      verified: true,
      joinDate: "2020",
      totalProperties: 5,
      totalValue: "$2M",
      responseRate: "90%",
      responseTime: "< 4 hours",
      portfolio: {
        cities: [{ name: "City", count: 5, value: "$2M" }],
        propertyTypes: [{ type: "Properties", count: 5 }],
        recentActivity: [],
      },
    },
    comments: [],
  }

  const [showDetails, setShowDetails] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [question, setQuestion] = useState("")
  const [neighborhoodData, setNeighborhoodData] = useState<any>(null)
  const [propertyDetails, setPropertyDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleBack = () => {
    window.history.back()
  }

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
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
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
                    alt={propertyData.title}
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
                      <h1 className="text-3xl font-bold mb-2">{propertyData.title}</h1>
                      <h2 className="text-2xl font-bold text-green-600 mb-2">{propertyData.price}</h2>
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
                </div>
              </CardContent>
            </Card>

            {/* Trust Score Badge */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Trust Score: {propertyData.owner.trustScore}%
                    </h3>
                    <p className="text-green-700">This owner is verified safe to rent from</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                      <Shield className="w-5 h-5 mr-2" />
                      VERIFIED SAFE
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Identity</div>
                    <div className="text-green-600">✓ Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Ownership</div>
                    <div className="text-green-600">✓ Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Reviews</div>
                    <div className="text-green-600">4.8/5 (24)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Response</div>
                    <div className="text-green-600">{propertyData.owner.responseTime}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Property Owner Information
                </CardTitle>
                <CardDescription>Verified owner details and portfolio information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {propertyData.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{propertyData.owner.name}</h3>
                    <p className="text-gray-600">{propertyData.owner.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Member since {propertyData.owner.joinDate}</span>
                      <span>•</span>
                      <span>{propertyData.owner.totalProperties} properties</span>
                      <span>•</span>
                      <span>Portfolio value: {propertyData.owner.totalValue}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Portfolio by City</h4>
                    <div className="space-y-2">
                      {propertyData.owner.portfolio.cities.map((city, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{city.name}</span>
                          <span>
                            {city.count} properties ({city.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Property Types</h4>
                    <div className="space-y-2">
                      {propertyData.owner.portfolio.propertyTypes.map((type, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{type.type}</span>
                          <span>{type.count} properties</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Verified Renter Reviews
                </CardTitle>
                <CardDescription>Reviews from verified renters who lived in this property</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add Review Form */}
                <div className="mb-6 p-4 border rounded-lg">
                  <Label htmlFor="review" className="text-sm font-medium mb-2 block">
                    Share your experience (verified renters only)
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Rate this property:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-5 h-5 text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110"
                          />
                        ))}
                      </div>
                    </div>
                    <Textarea
                      id="review"
                      placeholder="Share details about your experience living here..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </Button>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Reviews Display */}
                <div className="space-y-6">
                  {propertyData.comments.length > 0 ? (
                    propertyData.comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {comment.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="font-medium">{comment.user}</span>
                                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Verified Renter</Badge>
                              </div>
                              <span className="text-sm text-gray-500">{comment.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(comment.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-gray-700">{comment.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review this property!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
                  Call {propertyData.owner.name}
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

            {/* Ask the Owner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Ask the Owner
                </CardTitle>
                <CardDescription>Get answers directly from {propertyData.owner.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Quick Questions</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setQuestion("Are pets allowed?")}>
                        🐕 Pets?
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setQuestion("Is parking included?")}>
                        🚗 Parking?
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setQuestion("What utilities are included?")}>
                        💡 Utilities?
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setQuestion("What's the lease term?")}>
                        📋 Lease?
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="question" className="text-sm font-medium mb-2 block">
                      Your Question
                    </Label>
                    <Textarea
                      id="question"
                      placeholder="Ask about pets, parking, lease terms, neighborhood, etc..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAskQuestion} disabled={!question.trim()} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Question
                  </Button>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Owner typically responds</span>
                    </div>
                    <div className="text-sm text-green-700">
                      {propertyData.owner.responseTime} • {propertyData.owner.responseRate} response rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Trust Metrics
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

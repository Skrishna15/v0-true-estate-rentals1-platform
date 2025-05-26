"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Shield,
  FileText,
  MapPin,
  Star,
  MessageSquare,
  Send,
  Building,
  School,
  Hospital,
  Train,
  Phone,
  Mail,
  Calendar,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { OwnerVerification } from "@/components/owner-verification"
import { OwnerAnalyticsDashboard } from "@/components/owner-analytics-dashboard"

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

            {/* FEATURE 1: Trust Score Badge - Prominent Display */}
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
                    <div className="text-green-600">&lt; 2 hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FEATURE 2: Ownership Validation Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Ownership Validation Documents
                </CardTitle>
                <CardDescription>Verified legal proof of ownership</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Property Deed</h4>
                        <p className="text-sm text-gray-600">Verified 2023</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Document
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-medium">LLC Registration</h4>
                        <p className="text-sm text-gray-600">Johnson Properties LLC</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Document
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-8 h-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Background Check</h4>
                        <p className="text-sm text-gray-600">Passed 2024</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Verification */}
            <OwnerVerification ownerName={propertyData.owner.name} companyName={propertyData.owner.company} />

            {/* FEATURE 3: Owner Analytics Dashboard */}
            <OwnerAnalyticsDashboard
              owner={{
                name: propertyData.owner.name,
                company: propertyData.owner.company,
                totalProperties: propertyData.owner.totalProperties,
                totalValue: propertyData.owner.totalValue,
                portfolio: propertyData.owner.portfolio,
              }}
            />

            {/* Enhanced Neighborhood Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Live Neighborhood Data
                </CardTitle>
                <CardDescription>Real-time data from Google Maps & Census APIs</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading neighborhood data...</div>
                ) : neighborhoodData ? (
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <School className="w-4 h-4 text-blue-600" />
                        Schools Nearby
                      </h4>
                      <ul className="space-y-2">
                        {neighborhoodData.schools?.slice(0, 3).map((school: any, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            <div className="font-medium">{school.name}</div>
                            <div className="text-xs">
                              Rating: {school.rating} • {school.distance}
                            </div>
                          </li>
                        )) || <li className="text-sm text-gray-500">No schools found</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Hospital className="w-4 h-4 text-red-600" />
                        Healthcare
                      </h4>
                      <ul className="space-y-2">
                        {neighborhoodData.hospitals?.slice(0, 3).map((hospital: any, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            <div className="font-medium">{hospital.name}</div>
                            <div className="text-xs">
                              Rating: {hospital.rating} • {hospital.distance}
                            </div>
                          </li>
                        )) || <li className="text-sm text-gray-500">No hospitals found</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Train className="w-4 h-4 text-green-600" />
                        Transportation
                      </h4>
                      <ul className="space-y-2">
                        {neighborhoodData.transit?.slice(0, 3).map((station: any, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            <div className="font-medium">{station.name}</div>
                            <div className="text-xs">{station.distance}</div>
                          </li>
                        )) || <li className="text-sm text-gray-500">No transit found</li>}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Unable to load neighborhood data</div>
                )}
              </CardContent>
            </Card>

            {/* FEATURE: Enhanced Property Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Verified Renter Reviews
                </CardTitle>
                <CardDescription>Reviews from verified renters who lived in this property</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Review Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">4.8</div>
                    <div className="text-sm text-gray-600">Overall Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4.9</div>
                    <div className="text-sm text-gray-600">Landlord Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4.7</div>
                    <div className="text-sm text-gray-600">Property Condition</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">4.8</div>
                    <div className="text-sm text-gray-600">Neighborhood</div>
                  </div>
                </div>

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
                      placeholder="Share details about your experience living here, the landlord's responsiveness, property condition, etc..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Review
                      </Button>
                      <Button variant="outline" size="sm">
                        Add Photos
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Enhanced Review Display */}
                <div className="space-y-6">
                  {propertyData.comments.map((comment) => (
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
                            <span className="ml-2 text-sm text-gray-600">Lived here 2019-2021</span>
                          </div>
                          <p className="text-gray-700 mb-3">{comment.comment}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button className="hover:text-blue-600">👍 Helpful (12)</button>
                            <button className="hover:text-blue-600">💬 Reply</button>
                            <button className="hover:text-blue-600">🚩 Report</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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

            {/* FEATURE: Enhanced Owner Q&A Panel */}
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
                  {/* Quick Questions */}
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

                  {/* Owner Response Stats */}
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Owner typically responds</span>
                    </div>
                    <div className="text-sm text-green-700">Within 2 hours • 98% response rate</div>
                  </div>

                  {/* Recent Q&A with better formatting */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Recent Q&A</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">Q</span>
                          </div>
                          <p className="text-sm font-medium">Are pets allowed?</p>
                        </div>
                        <div className="flex items-start gap-2 ml-8">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-600">A</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Yes, cats and small dogs are welcome with a $200 deposit. We have a dog park nearby!
                            </p>
                            <span className="text-xs text-gray-500">Answered 2 days ago</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">Q</span>
                          </div>
                          <p className="text-sm font-medium">Is parking included?</p>
                        </div>
                        <div className="flex items-start gap-2 ml-8">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-600">A</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              One parking spot is included. Additional spots available for $150/month.
                            </p>
                            <span className="text-xs text-gray-500">Answered 1 week ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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

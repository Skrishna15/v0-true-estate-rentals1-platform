"use client"

import { useState } from "react"
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
  BarChart3,
  Eye,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Enhanced property data focusing on trust & verification
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
    verificationStatus: {
      identityVerified: true,
      backgroundCheck: true,
      ownershipDocs: true,
      businessEntity: true,
      professionalProfile: true,
    },
  },
  neighborhood: {
    schools: [
      { name: "Lincoln Elementary", rating: "9/10", distance: "0.3 mi" },
      { name: "Roosevelt Middle", rating: "8/10", distance: "0.5 mi" },
      { name: "Washington High", rating: "9/10", distance: "0.8 mi" },
    ],
    hospitals: [
      { name: "UCSF Medical Center", rating: "4.8/5", distance: "0.8 mi" },
      { name: "St. Mary's Hospital", rating: "4.6/5", distance: "1.2 mi" },
    ],
    transit: [
      { name: "Powell St BART", distance: "0.3 mi" },
      { name: "Bus Line 38", distance: "0.1 mi" },
    ],
  },
  comments: [
    {
      id: 1,
      user: "Mike Chen",
      avatar: "/placeholder-user.jpg",
      comment:
        "Sarah is incredibly responsive and professional. No rental scam concerns here - everything was transparent!",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
    },
    {
      id: 2,
      user: "Lisa Park",
      avatar: "/placeholder-user.jpg",
      comment: "Verified ownership documents upfront. Great landlord, highly recommend for anyone worried about scams.",
      rating: 5,
      date: "1 month ago",
      verified: true,
    },
  ],
  qna: [
    {
      id: 1,
      question: "Are pets allowed?",
      answer: "Yes, cats and small dogs are welcome with a $200 deposit.",
      askedBy: "Jennifer M.",
      answeredDate: "2 days ago",
    },
    {
      id: 2,
      question: "Is parking included?",
      answer: "One parking spot is included, additional spots available for $150/month.",
      askedBy: "David L.",
      answeredDate: "1 week ago",
    },
  ],
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState("")
  const [question, setQuestion] = useState("")
  const [neighborhoodData, setNeighborhoodData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

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
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Wealth Map
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
                      {propertyData.owner.trustScore}% Trust Score
                    </Badge>
                    <Badge className="bg-blue-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Owner
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
                  <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    <span>{propertyData.bedrooms} Bedrooms</span>
                    <span>{propertyData.bathrooms} Bathrooms</span>
                    <span>{propertyData.sqft} sq ft</span>
                  </div>

                  {/* Scam Prevention Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Scam-Free Verified Listing</span>
                    </div>
                    <p className="text-sm text-green-700">
                      This property and owner have been verified through our comprehensive trust system. All ownership
                      documents confirmed and background checks completed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Profile with Trust & Verification Focus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verified Property Owner
                </CardTitle>
                <CardDescription>Complete verification and trust metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={propertyData.owner.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {propertyData.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{propertyData.owner.name}</h3>
                      <Badge className="bg-green-500 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        {propertyData.owner.trustScore}% Trust Score
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">Property owner since {propertyData.owner.joinDate}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Identity Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Background Checked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Ownership Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Business Entity Confirmed</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View Ownership Docs
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Verified Ownership Documents</DialogTitle>
                          <DialogDescription>Legal proof of ownership and verification status</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">Property Deed</span>
                              <Badge className="bg-green-100 text-green-800">Verified ✓</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Official property deed showing ownership transfer and current legal owner
                            </p>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Document (PDF)
                            </Button>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">Tax Assessment Records</span>
                              <Badge className="bg-green-100 text-green-800">Verified ✓</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Current property tax assessment and payment history
                            </p>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Records
                            </Button>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">Business License</span>
                              <Badge className="bg-green-100 text-green-800">Verified ✓</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Valid business license for {propertyData.owner.company}
                            </p>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View License
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Mini Dashboard - Portfolio Overview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Portfolio Overview & Trust Metrics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{propertyData.owner.totalProperties}</div>
                      <div className="text-sm text-gray-600">Properties Owned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{propertyData.owner.totalValue}</div>
                      <div className="text-sm text-gray-600">Portfolio Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{propertyData.owner.responseRate}</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{propertyData.owner.responseTime}</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </div>
                  </div>

                  {/* Property Distribution Chart */}
                  <div>
                    <h5 className="font-medium mb-2">Property Distribution by City</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">San Francisco</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded">
                            <div className="w-3/4 h-2 bg-blue-500 rounded"></div>
                          </div>
                          <span className="text-sm">8 properties</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Oakland</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded">
                            <div className="w-1/3 h-2 bg-green-500 rounded"></div>
                          </div>
                          <span className="text-sm">3 properties</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Berkeley</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded">
                            <div className="w-1/4 h-2 bg-purple-500 rounded"></div>
                          </div>
                          <span className="text-sm">1 property</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Neighborhood Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Neighborhood Insights
                </CardTitle>
                <CardDescription>Live data from verified sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <School className="w-4 h-4 text-blue-600" />
                      Schools
                    </h4>
                    <ul className="space-y-2">
                      {propertyData.neighborhood.schools.map((school, index) => (
                        <li key={index} className="text-sm">
                          <div className="font-medium">{school.name}</div>
                          <div className="text-gray-600">
                            Rating: {school.rating} • {school.distance}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Hospital className="w-4 h-4 text-red-600" />
                      Healthcare
                    </h4>
                    <ul className="space-y-2">
                      {propertyData.neighborhood.hospitals.map((hospital, index) => (
                        <li key={index} className="text-sm">
                          <div className="font-medium">{hospital.name}</div>
                          <div className="text-gray-600">
                            Rating: {hospital.rating} • {hospital.distance}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Train className="w-4 h-4 text-green-600" />
                      Transportation
                    </h4>
                    <ul className="space-y-2">
                      {propertyData.neighborhood.transit.map((transport, index) => (
                        <li key={index} className="text-sm">
                          <div className="font-medium">{transport.name}</div>
                          <div className="text-gray-600">{transport.distance}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Reviews & Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Community Reviews & Comments
                </CardTitle>
                <CardDescription>Verified reviews from real tenants</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add Comment */}
                <div className="mb-6">
                  <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
                    Share your experience with this property or owner
                  </Label>
                  <div className="flex gap-2">
                    <Textarea
                      id="comment"
                      placeholder="Help others avoid scams - share your experience with this verified owner..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Existing Comments */}
                <div className="space-y-4">
                  {propertyData.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {comment.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.user}</span>
                          {comment.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Tenant
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            {[...Array(comment.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
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
                <CardTitle>Contact Verified Owner</CardTitle>
                <CardDescription>Safe to contact - identity verified</CardDescription>
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

            {/* Ask Owner Q&A */}
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
                    <Label htmlFor="question" className="text-sm font-medium mb-2 block">
                      Your Question
                    </Label>
                    <Textarea
                      id="question"
                      placeholder="Ask about pets, parking, lease terms, etc..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAskQuestion} disabled={!question.trim()} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Question
                  </Button>

                  {/* Recent Q&A */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Recent Q&A</h4>
                    <div className="space-y-3">
                      {propertyData.qna.map((qa) => (
                        <div key={qa.id} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium mb-1">Q: {qa.question}</p>
                          <p className="text-sm text-gray-600 mb-2">A: {qa.answer}</p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Asked by {qa.askedBy}</span>
                            <span>{qa.answeredDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Metrics Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Trust & Safety Metrics
                </CardTitle>
                <CardDescription>Comprehensive verification status</CardDescription>
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
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ownership Documents</span>
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Background Check</span>
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Passed
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Business Entity</span>
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Community Rating</span>
                      <span className="text-green-600">4.8/5.0 (24 reviews)</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Scam-Free Guarantee</span>
                    </div>
                    <p className="text-xs text-green-700">
                      This owner has passed all verification checks. Safe to proceed with rental application.
                    </p>
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

"use client"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown, Flag, User, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  verified: boolean
  helpful: number
  notHelpful: number
  createdAt: string
  propertyType: string
  rentDuration: string
  wouldRecommend: boolean
  landlordResponse?: {
    content: string
    respondedAt: string
    respondedBy: string
  }
}

interface PropertyReviewsProps {
  propertyId: string
  averageRating: number
  totalReviews: number
}

export function PropertyReviews({ propertyId, averageRating, totalReviews }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "rev_001",
      userId: "user_001",
      userName: "Sarah M.",
      userAvatar: "/placeholder-user.jpg",
      rating: 5,
      title: "Excellent landlord and beautiful property!",
      content:
        "I've been renting here for 2 years and couldn't be happier. The landlord is incredibly responsive and professional. The property is well-maintained and exactly as advertised. No hidden fees or surprises.",
      pros: ["Responsive landlord", "Well-maintained property", "Great location", "No hidden fees"],
      cons: ["Parking can be tight"],
      verified: true,
      helpful: 24,
      notHelpful: 2,
      createdAt: "2024-01-15",
      propertyType: "Apartment",
      rentDuration: "2+ years",
      wouldRecommend: true,
      landlordResponse: {
        content:
          "Thank you Sarah! It's been a pleasure having you as a tenant. We appreciate your feedback and will look into improving the parking situation.",
        respondedAt: "2024-01-16",
        respondedBy: "Property Owner",
      },
    },
    {
      id: "rev_002",
      userId: "user_002",
      userName: "Mike Chen",
      userAvatar: "/placeholder-user.jpg",
      rating: 4,
      title: "Good experience overall",
      content:
        "Solid rental experience. The verification process was thorough which gave me confidence. Property matches the photos and description. Minor maintenance issues were addressed quickly.",
      pros: ["Thorough verification", "Matches description", "Quick maintenance response"],
      cons: ["Slightly outdated appliances", "Noise from street"],
      verified: true,
      helpful: 18,
      notHelpful: 1,
      createdAt: "2024-01-10",
      propertyType: "Condo",
      rentDuration: "1 year",
      wouldRecommend: true,
    },
    {
      id: "rev_003",
      userId: "user_003",
      userName: "Jennifer L.",
      userAvatar: "/placeholder-user.jpg",
      rating: 5,
      title: "Scam-free and transparent process",
      content:
        "After dealing with several rental scams, finding this verified property was a relief. Everything was legitimate, documents were provided upfront, and the move-in process was smooth.",
      pros: ["Verified ownership", "Transparent process", "All documents provided", "Professional communication"],
      cons: [],
      verified: true,
      helpful: 31,
      notHelpful: 0,
      createdAt: "2024-01-05",
      propertyType: "House",
      rentDuration: "6 months",
      wouldRecommend: true,
    },
  ])

  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
    pros: "",
    cons: "",
    propertyType: "",
    rentDuration: "",
    wouldRecommend: true,
  })

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState("newest")

  const handleSubmitReview = () => {
    const review: Review = {
      id: `rev_${Date.now()}`,
      userId: "current_user",
      userName: "Current User",
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      pros: newReview.pros
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
      cons: newReview.cons
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      verified: true,
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date().toISOString().split("T")[0],
      propertyType: newReview.propertyType,
      rentDuration: newReview.rentDuration,
      wouldRecommend: newReview.wouldRecommend,
    }

    setReviews([review, ...reviews])
    setNewReview({
      rating: 5,
      title: "",
      content: "",
      pros: "",
      cons: "",
      propertyType: "",
      rentDuration: "",
      wouldRecommend: true,
    })
    setShowReviewForm(false)
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "rating-high":
        return b.rating - a.rating
      case "rating-low":
        return a.rating - b.rating
      case "helpful":
        return b.helpful - a.helpful
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Property Reviews
          </CardTitle>
          <CardDescription>Verified reviews from real tenants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <div className="text-gray-600">{totalReviews} verified reviews</div>
              <div className="text-sm text-green-600 mt-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                100% verified tenants
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((reviews.filter((r) => r.wouldRecommend).length / reviews.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Would Recommend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(reviews.reduce((acc, r) => acc + r.helpful, 0) / reviews.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Helpful Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {reviews.filter((r) => r.landlordResponse).length}
              </div>
              <div className="text-sm text-gray-600">Owner Responses</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Review Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">All Reviews ({reviews.length})</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowReviewForm(!showReviewForm)}>Write a Review</Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
            <CardDescription>Share your experience to help other renters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Property Type</Label>
                <Select
                  value={newReview.propertyType}
                  onValueChange={(value) => setNewReview({ ...newReview, propertyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rental Duration</Label>
                <Select
                  value={newReview.rentDuration}
                  onValueChange={(value) => setNewReview({ ...newReview, rentDuration: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How long did you rent?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                    <SelectItem value="6-months-1-year">6 months - 1 year</SelectItem>
                    <SelectItem value="1-2-years">1-2 years</SelectItem>
                    <SelectItem value="2-plus-years">2+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Overall Rating</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="p-1">
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Review Title</Label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Summarize your experience"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Detailed Review</Label>
              <Textarea
                placeholder="Share your experience with this property and landlord..."
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pros (comma separated)</Label>
                <Textarea
                  placeholder="What did you like? e.g., responsive landlord, great location"
                  value={newReview.pros}
                  onChange={(e) => setNewReview({ ...newReview, pros: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label>Cons (comma separated)</Label>
                <Textarea
                  placeholder="What could be improved? e.g., noisy neighbors, old appliances"
                  value={newReview.cons}
                  onChange={(e) => setNewReview({ ...newReview, cons: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recommend"
                checked={newReview.wouldRecommend}
                onChange={(e) => setNewReview({ ...newReview, wouldRecommend: e.target.checked })}
              />
              <Label htmlFor="recommend">I would recommend this property to others</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview}>Submit Review</Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {review.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified Tenant
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{review.propertyType}</span>
                      <span>•</span>
                      <span>{review.rentDuration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-gray-700 mb-4">{review.content}</p>

              {/* Pros and Cons */}
              {(review.pros.length > 0 || review.cons.length > 0) && (
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {review.pros.length > 0 && (
                    <div>
                      <h5 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        Pros
                      </h5>
                      <ul className="space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                        <ThumbsDown className="w-4 h-4" />
                        Cons
                      </h5>
                      <ul className="space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendation */}
              {review.wouldRecommend && (
                <div className="flex items-center gap-2 mb-4 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Recommends this property</span>
                </div>
              )}

              {/* Landlord Response */}
              {review.landlordResponse && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      Response from {review.landlordResponse.respondedBy}
                    </span>
                    <span className="text-sm text-blue-600">
                      {new Date(review.landlordResponse.respondedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-blue-700">{review.landlordResponse.content}</p>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600">
                    <ThumbsDown className="w-4 h-4" />
                    Not Helpful ({review.notHelpful})
                  </button>
                </div>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600">
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

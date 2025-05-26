"use client"

import { useState } from "react"
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Flag, Reply, Star, Shield, Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
    verified: boolean
    tenantHistory?: {
      property: string
      duration: string
      verified: boolean
    }
  }
  content: string
  rating?: number
  category: "general" | "landlord" | "property" | "neighborhood"
  timestamp: string
  likes: number
  dislikes: number
  replies: Comment[]
  helpful: boolean
}

interface PropertyCommentsProps {
  propertyAddress: string
  comments: Comment[]
  onAddComment?: (comment: string, rating?: number, category?: string) => void
}

const mockComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "Sarah M.",
      avatar: "/placeholder.svg?height=40&width=40&query=woman+avatar",
      verified: true,
      tenantHistory: {
        property: "123 Oak Street",
        duration: "2019-2021",
        verified: true,
      },
    },
    content:
      "Lived here for 2 years and had an amazing experience! Sarah (the owner) is incredibly responsive and professional. The building is well-maintained and the location is perfect for commuting. Highly recommend!",
    rating: 5,
    category: "general",
    timestamp: "2024-01-10T10:30:00Z",
    likes: 12,
    dislikes: 0,
    replies: [
      {
        id: "1-1",
        user: {
          name: "Mike Chen",
          avatar: "/placeholder.svg?height=40&width=40&query=man+avatar",
          verified: true,
        },
        content: "Totally agree! Sarah was great when I had maintenance issues.",
        timestamp: "2024-01-10T14:20:00Z",
        likes: 3,
        dislikes: 0,
        replies: [],
        helpful: true,
        category: "landlord",
      },
    ],
    helpful: true,
  },
  {
    id: "2",
    user: {
      name: "David L.",
      avatar: "/placeholder.svg?height=40&width=40&query=man+avatar+2",
      verified: true,
      tenantHistory: {
        property: "456 Market Street",
        duration: "2020-2022",
        verified: true,
      },
    },
    content:
      "Great neighborhood with excellent walkability. Close to BART and plenty of restaurants. The building has good amenities including a gym and rooftop deck. Only minor issue was occasional noise from the street, but that's expected in this area.",
    rating: 4,
    category: "neighborhood",
    timestamp: "2024-01-08T16:45:00Z",
    likes: 8,
    dislikes: 1,
    replies: [],
    helpful: true,
  },
  {
    id: "3",
    user: {
      name: "Jennifer K.",
      avatar: "/placeholder.svg?height=40&width=40&query=woman+avatar+2",
      verified: false,
    },
    content:
      "Considering renting here. Can anyone share more about the parking situation and if utilities are included?",
    category: "general",
    timestamp: "2024-01-15T09:15:00Z",
    likes: 2,
    dislikes: 0,
    replies: [],
    helpful: false,
  },
]

export function PropertyComments({ propertyAddress, comments = mockComments, onAddComment }: PropertyCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(0)
  const [newCategory, setNewCategory] = useState("general")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment, newRating || undefined, newCategory)
      setNewComment("")
      setNewRating(0)
      setNewCategory("general")
    }
  }

  const handleSubmitReply = (parentId: string) => {
    if (replyText.trim()) {
      // Handle reply submission
      console.log("Reply to", parentId, ":", replyText)
      setReplyText("")
      setReplyingTo(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "landlord":
        return "bg-blue-100 text-blue-800"
      case "property":
        return "bg-green-100 text-green-800"
      case "neighborhood":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-8 mt-3" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
          <AvatarFallback>
            {comment.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.user.name}</span>
                {comment.user.verified && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge className={`text-xs ${getCategoryColor(comment.category)}`}>
                  {comment.category.charAt(0).toUpperCase() + comment.category.slice(1)}
                </Badge>
              </div>
              <span className="text-sm text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
            </div>

            {/* Tenant History */}
            {comment.user.tenantHistory && (
              <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
                <div className="flex items-center gap-1 text-blue-700">
                  <MapPin className="w-3 h-3" />
                  <span>Former tenant: {comment.user.tenantHistory.property}</span>
                  <Calendar className="w-3 h-3 ml-2" />
                  <span>{comment.user.tenantHistory.duration}</span>
                  {comment.user.tenantHistory.verified && <Shield className="w-3 h-3 ml-1 text-green-600" />}
                </div>
              </div>
            )}

            {/* Rating */}
            {comment.rating && (
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < comment.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-sm font-medium ml-1">{comment.rating}/5</span>
              </div>
            )}

            {/* Comment Content */}
            <p className="text-gray-700 mb-3">{comment.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
                <ThumbsDown className="w-4 h-4" />
                <span>{comment.dislikes}</span>
              </button>
              {!isReply && (
                <button
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
              )}
              <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
                <Flag className="w-4 h-4" />
                Report
              </button>
              {comment.helpful && <Badge className="bg-green-100 text-green-800 text-xs">Helpful</Badge>}
            </div>
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 ml-4">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  <Send className="w-4 h-4 mr-1" />
                  Reply
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-3">{comment.replies.map((reply) => renderComment(reply, true))}</div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Community Reviews & Comments
        </CardTitle>
        <CardDescription>Real experiences from verified tenants and neighbors for {propertyAddress}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold mb-3">Share Your Experience</h4>

          {/* Rating */}
          <div className="mb-3">
            <label className="text-sm font-medium mb-2 block">Rate this property (optional)</label>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 cursor-pointer ${
                    i < newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                  }`}
                  onClick={() => setNewRating(i + 1)}
                />
              ))}
              {newRating > 0 && (
                <button className="ml-2 text-sm text-gray-500 hover:text-gray-700" onClick={() => setNewRating(0)}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="text-sm font-medium mb-2 block">Category</label>
            <div className="flex gap-2">
              {["general", "landlord", "property", "neighborhood"].map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded text-sm ${
                    newCategory === category ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setNewCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Comment Text */}
          <Textarea
            placeholder="Share your experience about the property, landlord, neighborhood, or ask questions..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-3"
            rows={3}
          />

          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Comments are moderated and verified tenants are prioritized</p>
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>

        <Separator />

        {/* Comments List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">
              {comments.length} Comment{comments.length !== 1 ? "s" : ""}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>{comments.filter((c) => c.user.verified).length} verified users</span>
            </div>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No comments yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">{comments.map((comment) => renderComment(comment))}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

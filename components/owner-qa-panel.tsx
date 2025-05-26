"use client"

import { useState } from "react"
import { MessageSquare, Send, Clock, CheckCircle, Phone, Mail, Calendar, Star, HelpCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface QAItem {
  id: string
  question: string
  answer?: string
  askedBy: string
  askedAt: string
  answeredAt?: string
  category: "pets" | "parking" | "utilities" | "lease" | "amenities" | "general"
  helpful: number
}

interface OwnerQAPanelProps {
  ownerName: string
  ownerAvatar?: string
  responseStats: {
    responseRate: number
    averageResponseTime: string
    totalQuestions: number
  }
  qaItems: QAItem[]
  onAskQuestion?: (question: string, category: string) => void
}

const mockQAItems: QAItem[] = [
  {
    id: "1",
    question: "Are pets allowed in this property?",
    answer:
      "Yes, cats and small dogs are welcome with a $200 pet deposit. We have a dog park nearby and pet-friendly policies.",
    askedBy: "Jennifer M.",
    askedAt: "2024-01-10T10:00:00Z",
    answeredAt: "2024-01-10T11:30:00Z",
    category: "pets",
    helpful: 8,
  },
  {
    id: "2",
    question: "Is parking included in the rent?",
    answer:
      "One parking spot is included in the rent. Additional spots are available for $150/month in our secure garage.",
    askedBy: "Mike R.",
    askedAt: "2024-01-08T14:20:00Z",
    answeredAt: "2024-01-08T15:45:00Z",
    category: "parking",
    helpful: 12,
  },
  {
    id: "3",
    question: "What utilities are included?",
    answer:
      "Water, sewer, and trash are included. Tenants are responsible for electricity, gas, and internet. Average utility cost is around $80-120/month.",
    askedBy: "Sarah K.",
    askedAt: "2024-01-05T09:15:00Z",
    answeredAt: "2024-01-05T10:20:00Z",
    category: "utilities",
    helpful: 15,
  },
  {
    id: "4",
    question: "What's the minimum lease term?",
    answer:
      "We offer 12-month leases as standard. 6-month leases are available with a small premium. Month-to-month after the initial term.",
    askedBy: "David L.",
    askedAt: "2024-01-03T16:30:00Z",
    answeredAt: "2024-01-03T18:00:00Z",
    category: "lease",
    helpful: 6,
  },
  {
    id: "5",
    question: "Are there any upcoming renovations planned?",
    askedBy: "Lisa P.",
    askedAt: "2024-01-15T11:00:00Z",
    category: "general",
    helpful: 0,
  },
]

const mockResponseStats = {
  responseRate: 98,
  averageResponseTime: "< 2 hours",
  totalQuestions: 47,
}

export function OwnerQAPanel({
  ownerName,
  ownerAvatar,
  responseStats = mockResponseStats,
  qaItems = mockQAItems,
  onAskQuestion,
}: OwnerQAPanelProps) {
  const [newQuestion, setNewQuestion] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [showAllQuestions, setShowAllQuestions] = useState(false)

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const handleSubmitQuestion = () => {
    if (newQuestion.trim()) {
      onAskQuestion?.(newQuestion, selectedCategory)
      setNewQuestion("")
      setSelectedCategory("general")
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pets":
        return "🐕"
      case "parking":
        return "🚗"
      case "utilities":
        return "💡"
      case "lease":
        return "📋"
      case "amenities":
        return "🏊"
      default:
        return "❓"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "pets":
        return "bg-green-100 text-green-800"
      case "parking":
        return "bg-blue-100 text-blue-800"
      case "utilities":
        return "bg-yellow-100 text-yellow-800"
      case "lease":
        return "bg-purple-100 text-purple-800"
      case "amenities":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const quickQuestions = [
    { text: "Are pets allowed?", category: "pets" },
    { text: "Is parking included?", category: "parking" },
    { text: "What utilities are included?", category: "utilities" },
    { text: "What's the lease term?", category: "lease" },
  ]

  const displayedQuestions = showAllQuestions ? qaItems : qaItems.slice(0, 3)
  const answeredQuestions = qaItems.filter((item) => item.answer)
  const pendingQuestions = qaItems.filter((item) => !item.answer)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Ask {ownerName}
        </CardTitle>
        <CardDescription>Get answers directly from the property owner</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Owner Response Stats */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={ownerAvatar || "/placeholder.svg"} />
              <AvatarFallback>
                {ownerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{ownerName}</h4>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Verified Owner</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{responseStats.responseRate}%</div>
              <div className="text-xs text-green-700">Response Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{responseStats.averageResponseTime}</div>
              <div className="text-xs text-green-700">Avg Response</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{responseStats.totalQuestions}</div>
              <div className="text-xs text-green-700">Questions Answered</div>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div>
          <h4 className="font-semibold mb-3">Quick Questions</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((q, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-2"
                onClick={() => {
                  setNewQuestion(q.text)
                  setSelectedCategory(q.category)
                }}
              >
                <span className="mr-2">{getCategoryIcon(q.category)}</span>
                {q.text}
              </Button>
            ))}
          </div>
        </div>

        {/* Ask Question Form */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Ask Your Question</h4>

          {/* Category Selection */}
          <div className="mb-3">
            <label className="text-sm font-medium mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {["general", "pets", "parking", "utilities", "lease", "amenities"].map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>{getCategoryIcon(category)}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <Textarea
            placeholder="Ask about pets, parking, lease terms, amenities, or anything else..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="mb-3"
            rows={3}
          />

          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Owner typically responds within {responseStats.averageResponseTime}</p>
            <Button onClick={handleSubmitQuestion} disabled={!newQuestion.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Send Question
            </Button>
          </div>
        </div>

        <Separator />

        {/* Q&A History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Recent Q&A</h4>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{answeredQuestions.length} answered</span>
              <span>{pendingQuestions.length} pending</span>
            </div>
          </div>

          <div className="space-y-4">
            {displayedQuestions.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                {/* Question */}
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.question}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                          {getCategoryIcon(item.category)} {item.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Asked by {item.askedBy} • {formatTimeAgo(item.askedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answer */}
                {item.answer ? (
                  <div className="ml-8">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700">{item.answer}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Answered {formatTimeAgo(item.answeredAt!)}</span>
                          <button className="flex items-center gap-1 hover:text-blue-600">
                            <Star className="w-3 h-3" />
                            Helpful ({item.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="ml-8">
                    <div className="flex items-center gap-2 text-sm text-yellow-600">
                      <Clock className="w-4 h-4" />
                      <span>Waiting for owner response...</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {qaItems.length > 3 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => setShowAllQuestions(!showAllQuestions)}>
                {showAllQuestions ? "Show Less" : `View All ${qaItems.length} Questions`}
              </Button>
            </div>
          )}
        </div>

        {/* Contact Options */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Need Immediate Help?</h4>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

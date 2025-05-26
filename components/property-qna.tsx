"use client"

import { useState } from "react"
import { MessageSquare, Send, User, Calendar, CheckCircle, Clock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QnAItem {
  id: string
  question: string
  answer?: string
  askedBy: string
  askedByAvatar?: string
  askedAt: string
  answeredBy?: string
  answeredAt?: string
  category: string
  helpful: number
  verified: boolean
  status: "pending" | "answered" | "featured"
}

interface PropertyQnAProps {
  propertyId: string
  ownerName: string
}

export function PropertyQnA({ propertyId, ownerName }: PropertyQnAProps) {
  const [qnaItems, setQnaItems] = useState<QnAItem[]>([
    {
      id: "qna_001",
      question: "Are pets allowed in this property?",
      answer:
        "Yes, we welcome cats and small dogs (under 25 lbs) with a $200 pet deposit and $50/month pet rent. We require vaccination records and a pet interview.",
      askedBy: "Jennifer M.",
      askedByAvatar: "/placeholder-user.jpg",
      askedAt: "2024-01-20",
      answeredBy: ownerName,
      answeredAt: "2024-01-20",
      category: "pets",
      helpful: 15,
      verified: true,
      status: "featured",
    },
    {
      id: "qna_002",
      question: "Is parking included with the rental?",
      answer:
        "One covered parking spot is included in the rent. Additional spots are available for $150/month on a first-come, first-served basis.",
      askedBy: "David L.",
      askedByAvatar: "/placeholder-user.jpg",
      askedAt: "2024-01-18",
      answeredBy: ownerName,
      answeredAt: "2024-01-18",
      category: "parking",
      helpful: 12,
      verified: true,
      status: "answered",
    },
    {
      id: "qna_003",
      question: "What utilities are included in the rent?",
      answer:
        "Water, sewer, and trash are included. Tenants are responsible for electricity, gas, internet, and cable. Average utility costs are around $150-200/month.",
      askedBy: "Sarah K.",
      askedByAvatar: "/placeholder-user.jpg",
      askedAt: "2024-01-15",
      answeredBy: ownerName,
      answeredAt: "2024-01-15",
      category: "utilities",
      helpful: 18,
      verified: true,
      status: "answered",
    },
    {
      id: "qna_004",
      question: "What is the lease term and are short-term rentals available?",
      answer:
        "Standard lease term is 12 months. We can consider 6-month leases with a 10% premium. Short-term rentals (under 6 months) are not available.",
      askedBy: "Mike R.",
      askedByAvatar: "/placeholder-user.jpg",
      askedAt: "2024-01-12",
      answeredBy: ownerName,
      answeredAt: "2024-01-13",
      category: "lease",
      helpful: 8,
      verified: true,
      status: "answered",
    },
    {
      id: "qna_005",
      question: "Is there a washer and dryer in the unit?",
      askedBy: "Lisa P.",
      askedByAvatar: "/placeholder-user.jpg",
      askedAt: "2024-01-22",
      category: "amenities",
      helpful: 0,
      verified: true,
      status: "pending",
    },
  ])

  const [newQuestion, setNewQuestion] = useState("")
  const [questionCategory, setQuestionCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const categories = [
    { value: "general", label: "General" },
    { value: "pets", label: "Pets" },
    { value: "parking", label: "Parking" },
    { value: "utilities", label: "Utilities" },
    { value: "amenities", label: "Amenities" },
    { value: "lease", label: "Lease Terms" },
    { value: "neighborhood", label: "Neighborhood" },
    { value: "maintenance", label: "Maintenance" },
  ]

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return

    const question: QnAItem = {
      id: `qna_${Date.now()}`,
      question: newQuestion,
      askedBy: "Current User",
      askedAt: new Date().toISOString().split("T")[0],
      category: questionCategory || "general",
      helpful: 0,
      verified: true,
      status: "pending",
    }

    setQnaItems([question, ...qnaItems])
    setNewQuestion("")
    setQuestionCategory("")
  }

  const filteredAndSortedItems = qnaItems
    .filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.answer && item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = filterCategory === "all" || item.category === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "helpful":
          return b.helpful - a.helpful
        case "oldest":
          return new Date(a.askedAt).getTime() - new Date(b.askedAt).getTime()
        case "unanswered":
          return (a.status === "pending" ? -1 : 1) - (b.status === "pending" ? -1 : 1)
        default: // newest
          return new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime()
      }
    })

  const featuredQuestions = qnaItems.filter((item) => item.status === "featured")
  const pendingQuestions = qnaItems.filter((item) => item.status === "pending")
  const answeredQuestions = qnaItems.filter((item) => item.status === "answered")

  return (
    <div className="space-y-6">
      {/* Q&A Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Questions & Answers
          </CardTitle>
          <CardDescription>Get answers directly from {ownerName} and the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{qnaItems.length}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{answeredQuestions.length}</div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingQuestions.length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Questions */}
      {featuredQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Featured Questions</CardTitle>
            <CardDescription>Most helpful questions and answers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredQuestions.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-blue-900">{item.question}</h4>
                    <Badge className="bg-blue-500 text-white">Featured</Badge>
                  </div>
                  {item.answer && <p className="text-blue-800 text-sm mb-2">{item.answer}</p>}
                  <div className="flex items-center justify-between text-xs text-blue-600">
                    <span>Asked by {item.askedBy}</span>
                    <span>{item.helpful} found helpful</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ask Question Form */}
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>Get answers about this property from {ownerName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Category</Label>
            <Select value={questionCategory} onValueChange={setQuestionCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Your Question</Label>
            <Textarea
              placeholder="Ask about pets, parking, lease terms, amenities, or anything else..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmitQuestion} disabled={!newQuestion.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setNewQuestion("")
                setQuestionCategory("")
              }}
            >
              Clear
            </Button>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Tips for better answers:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Be specific about what you want to know</li>
              <li>• Check existing questions first to avoid duplicates</li>
              <li>• Choose the right category for faster responses</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search questions and answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
            <SelectItem value="unanswered">Unanswered First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Q&A List */}
      <div className="space-y-4">
        {filteredAndSortedItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={item.askedByAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {item.askedBy
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{item.askedBy}</span>
                      {item.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {categories.find((c) => c.value === item.category)?.label || item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.askedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === "featured" && <Badge className="bg-blue-500 text-white">Featured</Badge>}
                  {item.status === "pending" && (
                    <Badge className="bg-orange-100 text-orange-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                  {item.status === "answered" && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Answered
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">{item.question}</h4>
                {item.answer ? (
                  <div className="bg-gray-50 border-l-4 border-blue-400 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Answer from {item.answeredBy}</span>
                      {item.answeredAt && (
                        <span className="text-sm text-blue-600">{new Date(item.answeredAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ) : (
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-800">Waiting for answer from {ownerName}</span>
                    </div>
                  </div>
                )}
              </div>

              {item.answer && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                    <CheckCircle className="w-4 h-4" />
                    Helpful ({item.helpful})
                  </button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Follow Up
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Be the first to ask a question about this property"}
            </p>
            {(searchQuery || filterCategory !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setFilterCategory("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

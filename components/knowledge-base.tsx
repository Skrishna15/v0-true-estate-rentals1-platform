"use client"

import { useState } from "react"
import { Book, Search, ChevronRight, Clock, User, ThumbsUp, Eye, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Article {
  id: string
  title: string
  description: string
  content: string
  category: string
  readTime: number
  author: string
  publishedAt: string
  views: number
  likes: number
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
}

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const categories = [
    { id: "all", name: "All Articles", count: 24 },
    { id: "verification", name: "Property Verification", count: 8 },
    { id: "trust-scores", name: "Trust Scores", count: 6 },
    { id: "scam-prevention", name: "Scam Prevention", count: 5 },
    { id: "market-analysis", name: "Market Analysis", count: 3 },
    { id: "legal", name: "Legal & Contracts", count: 2 },
  ]

  const articles: Article[] = [
    {
      id: "verify-ownership",
      title: "How to Verify Property Ownership",
      description: "Complete guide to verifying legitimate property ownership and avoiding rental scams",
      content: `
        <h2>Understanding Property Ownership Verification</h2>
        <p>Property ownership verification is the cornerstone of safe rental transactions. This comprehensive guide will walk you through the essential steps to confirm legitimate ownership and protect yourself from rental scams.</p>
        
        <h3>1. Official Documentation</h3>
        <p>Always request and verify these key documents:</p>
        <ul>
          <li><strong>Property Deed:</strong> The legal document showing current ownership</li>
          <li><strong>Tax Assessment Records:</strong> Proof of property tax payments</li>
          <li><strong>Business License:</strong> If the owner operates as a business entity</li>
          <li><strong>Government-issued ID:</strong> To match the name on ownership documents</li>
        </ul>

        <h3>2. Cross-Reference Multiple Sources</h3>
        <p>Use TrueEstate's verification system which cross-references:</p>
        <ul>
          <li>ATTOM Data property records</li>
          <li>County assessor databases</li>
          <li>Business registration records</li>
          <li>Professional identity verification</li>
        </ul>

        <h3>3. Red Flags to Watch For</h3>
        <p>Be cautious if you encounter:</p>
        <ul>
          <li>Reluctance to provide ownership documents</li>
          <li>Pressure to send money before viewing</li>
          <li>Prices significantly below market rate</li>
          <li>Communication only through email or text</li>
          <li>Requests for wire transfers or gift cards</li>
        </ul>

        <h3>4. TrueEstate's Verification Process</h3>
        <p>Our platform automatically verifies:</p>
        <ul>
          <li>Property ownership through multiple databases</li>
          <li>Owner identity using professional verification services</li>
          <li>Business entity registration and licensing</li>
          <li>Historical ownership and transaction records</li>
        </ul>

        <h3>5. What to Do If Something Seems Wrong</h3>
        <p>If you suspect fraudulent activity:</p>
        <ul>
          <li>Do not send any money</li>
          <li>Report the listing to TrueEstate</li>
          <li>Contact local authorities if necessary</li>
          <li>Use our scam reporting feature</li>
        </ul>
      `,
      category: "verification",
      readTime: 8,
      author: "Sarah Johnson, Real Estate Expert",
      publishedAt: "2024-01-15",
      views: 2847,
      likes: 156,
      difficulty: "beginner",
      tags: ["verification", "ownership", "scam-prevention", "documents"],
    },
    {
      id: "trust-scores-explained",
      title: "Understanding Trust Scores",
      description: "Learn how TrueEstate calculates trust scores and what they mean for your rental decisions",
      content: `
        <h2>What Are Trust Scores?</h2>
        <p>Trust scores are TrueEstate's proprietary rating system that evaluates property owners and listings based on multiple verification factors and historical data.</p>

        <h3>How Trust Scores Are Calculated</h3>
        <p>Our AI-powered system analyzes over 50 data points including:</p>
        <ul>
          <li><strong>Identity Verification (25%):</strong> Government ID, professional profiles, background checks</li>
          <li><strong>Property Ownership (30%):</strong> Legal documentation, tax records, ownership history</li>
          <li><strong>Business Verification (20%):</strong> Business licenses, corporate registration, professional standing</li>
          <li><strong>Community Feedback (15%):</strong> Tenant reviews, response rates, communication quality</li>
          <li><strong>Platform History (10%):</strong> Account age, transaction history, compliance record</li>
        </ul>

        <h3>Trust Score Ranges</h3>
        <ul>
          <li><strong>90-100%:</strong> Highly Trusted - Comprehensive verification completed</li>
          <li><strong>80-89%:</strong> Trusted - Most verification criteria met</li>
          <li><strong>70-79%:</strong> Moderately Trusted - Basic verification with some gaps</li>
          <li><strong>Below 70%:</strong> Proceed with Caution - Limited verification</li>
        </ul>

        <h3>Using Trust Scores Effectively</h3>
        <p>Trust scores should be one factor in your decision-making process:</p>
        <ul>
          <li>Higher scores indicate more thorough verification</li>
          <li>Consider the specific verification categories</li>
          <li>Read individual reviews and comments</li>
          <li>Ask questions about any verification gaps</li>
        </ul>
      `,
      category: "trust-scores",
      readTime: 6,
      author: "Michael Chen, Data Scientist",
      publishedAt: "2024-01-12",
      views: 1923,
      likes: 89,
      difficulty: "intermediate",
      tags: ["trust-scores", "verification", "ai", "data-analysis"],
    },
    {
      id: "rental-scam-prevention",
      title: "Complete Guide to Rental Scam Prevention",
      description: "Protect yourself from rental scams with this comprehensive prevention guide",
      content: `
        <h2>The Reality of Rental Scams</h2>
        <p>Rental scams cost Americans over $5 billion annually. This guide provides essential knowledge to protect yourself from fraudulent listings and fake landlords.</p>

        <h3>Common Rental Scam Types</h3>
        <ul>
          <li><strong>Fake Listings:</strong> Properties that don't exist or aren't for rent</li>
          <li><strong>Identity Theft:</strong> Scammers posing as legitimate property owners</li>
          <li><strong>Advance Fee Fraud:</strong> Requesting money before property viewing</li>
          <li><strong>Bait and Switch:</strong> Showing one property, renting another</li>
          <li><strong>Overpayment Scams:</strong> Fake checks with requests for refunds</li>
        </ul>

        <h3>Warning Signs</h3>
        <p>Be alert for these red flags:</p>
        <ul>
          <li>Prices significantly below market rate</li>
          <li>Landlord claims to be out of town/country</li>
          <li>Pressure to act quickly or send money immediately</li>
          <li>Poor grammar or spelling in communications</li>
          <li>Requests for wire transfers, gift cards, or cryptocurrency</li>
          <li>Reluctance to meet in person or show the property</li>
        </ul>

        <h3>Protection Strategies</h3>
        <ul>
          <li><strong>Use Verified Platforms:</strong> Stick to platforms like TrueEstate that verify ownership</li>
          <li><strong>Meet in Person:</strong> Always view the property and meet the landlord</li>
          <li><strong>Verify Identity:</strong> Check ID and cross-reference with property records</li>
          <li><strong>Research Market Rates:</strong> Know typical rental prices in the area</li>
          <li><strong>Trust Your Instincts:</strong> If something feels wrong, investigate further</li>
        </ul>

        <h3>TrueEstate's Scam Prevention Features</h3>
        <ul>
          <li>Real-time ownership verification</li>
          <li>AI-powered scam detection</li>
          <li>Community reporting system</li>
          <li>Secure communication channels</li>
          <li>Verified landlord profiles</li>
        </ul>
      `,
      category: "scam-prevention",
      readTime: 10,
      author: "Jennifer Martinez, Consumer Protection Specialist",
      publishedAt: "2024-01-08",
      views: 3456,
      likes: 234,
      difficulty: "beginner",
      tags: ["scam-prevention", "safety", "fraud", "protection"],
    },
  ]

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mb-4">
            ← Back to Knowledge Base
          </Button>

          <div className="flex items-center gap-2 mb-4">
            <Badge className="capitalize">{selectedArticle.category.replace("-", " ")}</Badge>
            <Badge variant="outline" className="capitalize">
              {selectedArticle.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {selectedArticle.readTime} min read
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{selectedArticle.description}</p>

          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{selectedArticle.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{selectedArticle.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{selectedArticle.likes} likes</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />

        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedArticle.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Published on {new Date(selectedArticle.publishedAt).toLocaleDateString()}
            </div>
            <Button variant="outline" size="sm">
              <ThumbsUp className="w-4 h-4 mr-1" />
              Helpful ({selectedArticle.likes})
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Knowledge Base Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Knowledge Base
          </CardTitle>
          <CardDescription>
            Learn everything about property verification, trust scores, and rental safety
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles, guides, and tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {categories.slice(1).map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === category.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold mb-2">{category.name}</h3>
              <p className="text-2xl font-bold text-blue-600">{category.count}</p>
              <p className="text-sm text-gray-600">articles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => setSelectedArticle(article)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="capitalize">{article.category.replace("-", " ")}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {article.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {article.readTime} min
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {article.likes} likes
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or browse different categories</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

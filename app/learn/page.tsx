import { Building, BookOpen, Search, Users, Clock, Eye, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const knowledgeCategories = [
  {
    title: "Property Verification",
    count: 8,
    color: "text-blue-600",
  },
  {
    title: "Trust Scores",
    count: 6,
    color: "text-blue-600",
  },
  {
    title: "Scam Prevention",
    count: 5,
    color: "text-blue-600",
  },
  {
    title: "Market Analysis",
    count: 3,
    color: "text-blue-600",
  },
  {
    title: "Legal & Contracts",
    count: 2,
    color: "text-blue-600",
  },
]

const featuredArticles = [
  {
    category: "Verification",
    difficulty: "Beginner",
    duration: "8 min",
    title: "How to Verify Property Ownership",
    description: "Complete guide to verifying legitimate property ownership and avoiding rental scams",
    author: "Sarah Johnson, Real Estate Expert",
    views: "2,847 views",
    likes: "156 likes",
    tags: ["Verification", "Beginner"],
  },
  {
    category: "Trust Scores",
    difficulty: "Intermediate",
    duration: "6 min",
    title: "Understanding Trust Scores",
    description: "Learn how TrueEstate calculates trust scores and what they mean for your rental decisions",
    author: "Michael Chen, Data Scientist",
    views: "1,923 views",
    likes: "89 likes",
    tags: ["Trust Scores", "Intermediate"],
  },
  {
    category: "Scam Prevention",
    difficulty: "Beginner",
    duration: "10 min",
    title: "Complete Guide to Rental Scam Prevention",
    description: "Protect yourself from rental scams with this comprehensive prevention guide",
    author: "Jennifer Martinez, Consumer Protection Specialist",
    views: "3,456 views",
    likes: "234 likes",
    tags: ["Scam Prevention", "Beginner"],
  },
]

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">TrueEstate</h1>
                <p className="text-xs text-gray-600">Clarity before Capital</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/properties" className="text-gray-600 hover:text-blue-600">
                Search Properties
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Knowledge Base Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
          </div>
          <p className="text-gray-600 mb-8">
            Learn everything about property verification, trust scores, and rental safety
          </p>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Search articles, guides, and tutorials..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Articles (24)</SelectItem>
                <SelectItem value="verification">Property Verification</SelectItem>
                <SelectItem value="trust">Trust Scores</SelectItem>
                <SelectItem value="scam">Scam Prevention</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {knowledgeCategories.map((category, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <div className={`text-3xl font-bold ${category.color} mb-1`}>{category.count}</div>
                <div className="text-sm text-gray-500">articles</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Real Estate Knowledge Center */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Real Estate Knowledge Center</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access comprehensive guides, market insights, and professional resources for real estate professionals
          </p>
        </div>

        {/* Featured Articles */}
        <div className="space-y-6">
          {featuredArticles.map((article, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    {/* Article Tags */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant={article.difficulty === "Beginner" ? "default" : "secondary"}
                        className="bg-black text-white"
                      >
                        {article.category}
                      </Badge>
                      <Badge variant="outline">{article.difficulty}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {article.duration}
                      </div>
                    </div>

                    {/* Article Title and Description */}
                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.description}</p>

                    {/* Author and Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {article.views}
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        {article.likes}
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-gray-900 text-white py-12 -mx-4">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">TrueEstate</h3>
                    <p className="text-sm text-gray-400">Clarity before Capital</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">© 2024 TrueEstate. All rights reserved.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>About Us</div>
                  <div>Careers</div>
                  <div>Contact</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>FAQ</div>
                  <div>Blog</div>
                  <div>Terms of Service</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>Twitter</div>
                  <div>LinkedIn</div>
                  <div>Facebook</div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

import { Building, BookOpen, Shield, Search, Users, TrendingUp, FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const educationalContent = [
  {
    category: "Getting Started",
    articles: [
      {
        title: "How to Verify Property Ownership",
        description: "Learn the essential steps to verify if a landlord actually owns the property they're renting.",
        readTime: "5 min read",
        difficulty: "Beginner",
        icon: Shield,
      },
      {
        title: "Understanding Trust Scores",
        description: "Discover how our AI-powered trust scoring system evaluates landlord credibility.",
        readTime: "7 min read",
        difficulty: "Beginner",
        icon: TrendingUp,
      },
      {
        title: "Reading Property Documents",
        description: "A guide to understanding deeds, titles, and other ownership documents.",
        readTime: "10 min read",
        difficulty: "Intermediate",
        icon: FileText,
      },
    ],
  },
  {
    category: "Scam Prevention",
    articles: [
      {
        title: "Red Flags: Spotting Rental Scams",
        description: "Common warning signs that indicate a rental listing might be fraudulent.",
        readTime: "6 min read",
        difficulty: "Beginner",
        icon: AlertTriangle,
      },
      {
        title: "Wire Transfer Scams: What to Avoid",
        description: "Why legitimate landlords never ask for wire transfers and what to do instead.",
        readTime: "4 min read",
        difficulty: "Beginner",
        icon: AlertTriangle,
      },
      {
        title: "Fake Listing Detection",
        description: "Tools and techniques to identify fake property listings before you visit.",
        readTime: "8 min read",
        difficulty: "Intermediate",
        icon: Search,
      },
    ],
  },
  {
    category: "Investment Intelligence",
    articles: [
      {
        title: "Analyzing Property Owner Portfolios",
        description: "How to research and evaluate a property owner's investment history and patterns.",
        readTime: "12 min read",
        difficulty: "Advanced",
        icon: Users,
      },
      {
        title: "Market Trends and Wealth Mapping",
        description: "Using our wealth map to identify investment opportunities and market trends.",
        readTime: "15 min read",
        difficulty: "Advanced",
        icon: TrendingUp,
      },
      {
        title: "Due Diligence for Real Estate Investors",
        description: "Complete checklist for verifying properties and owners before investing.",
        readTime: "20 min read",
        difficulty: "Advanced",
        icon: FileText,
      },
    ],
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
                <p className="text-xs text-gray-600">Knowledge Center</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/learn" className="font-semibold text-blue-600">
                Learn
              </Link>
              <Link href="/properties" className="text-gray-600 hover:text-blue-600">
                Properties
              </Link>
              <Link href="/wealth-map" className="text-gray-600 hover:text-blue-600">
                Wealth Map
              </Link>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm mb-6">
            <BookOpen className="w-4 h-4" />
            Knowledge Center
          </div>
          <h1 className="text-4xl font-bold mb-4">Learn Real Estate Intelligence</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the art of property verification, scam prevention, and investment analysis with our comprehensive
            guides.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
            <div className="text-sm text-gray-600">Expert Guides</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
            <div className="text-sm text-gray-600">Users Educated</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Scam Prevention Rate</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Access</div>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="space-y-12">
          {educationalContent.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.articles.map((article, articleIndex) => (
                  <Card key={articleIndex} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <article.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <Badge
                          variant={
                            article.difficulty === "Beginner"
                              ? "default"
                              : article.difficulty === "Intermediate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {article.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                        <Button variant="outline" size="sm">
                          Read Article
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Featured Guide */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Complete Rental Safety Guide</h3>
                <p className="text-gray-600 mb-6">
                  Our comprehensive 50-page guide covers everything from initial property search to lease signing,
                  ensuring you never fall victim to rental scams.
                </p>
                <div className="flex gap-4">
                  <Button size="lg">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Download Free Guide
                  </Button>
                  <Button variant="outline" size="lg">
                    Preview Guide
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <img
                  src="/placeholder.svg?height=300&width=250&text=Safety+Guide"
                  alt="Rental Safety Guide"
                  className="mx-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">Ready to Apply Your Knowledge?</h3>
          <p className="text-gray-600 mb-6">
            Start using TrueEstate's verification tools to make informed real estate decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Shield className="w-5 h-5 mr-2" />
              Start Verifying Properties
            </Button>
            <Button variant="outline" size="lg">
              <Search className="w-5 h-5 mr-2" />
              Explore Wealth Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

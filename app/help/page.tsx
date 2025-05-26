import { Search, Shield, Users, Building, HelpCircle, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const categories = [
    {
      icon: Search,
      title: "Getting Started",
      description: "Learn how to use TrueEstate Rentals",
      articles: [
        "How to search for properties",
        "Understanding verification badges",
        "Creating your account",
        "Setting up alerts",
      ],
    },
    {
      icon: Shield,
      title: "Verification Process",
      description: "How we verify owners and properties",
      articles: [
        "Owner verification explained",
        "Property verification process",
        "Trust score calculation",
        "Reporting suspicious listings",
      ],
    },
    {
      icon: Users,
      title: "Reviews & Ratings",
      description: "Community feedback system",
      articles: [
        "How to leave a review",
        "Review guidelines",
        "Reporting inappropriate content",
        "Understanding ratings",
      ],
    },
    {
      icon: Building,
      title: "Property Owners",
      description: "Information for property owners",
      articles: [
        "Claiming your property",
        "Verification requirements",
        "Managing your listings",
        "Responding to reviews",
      ],
    },
  ]

  const faqs = [
    {
      question: "How accurate is the ownership information?",
      answer:
        "Our ownership data is sourced from public records and verified through multiple channels. We maintain a 95%+ accuracy rate and update information regularly.",
    },
    {
      question: "Can I trust the reviews on the platform?",
      answer:
        "All reviews are from verified users who have had actual interactions with the property or owner. We have strict policies against fake reviews.",
    },
    {
      question: "What if I find incorrect information?",
      answer:
        "You can report incorrect information through our platform. We investigate all reports and update information within 24-48 hours.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we use industry-standard encryption and security measures to protect your personal information. We never sell your data to third parties.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to your questions about TrueEstate Rentals
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Search help articles..." className="pl-10 pr-4 py-3" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <category.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li
                        key={articleIndex}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                        {article}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>Can't find what you're looking for? Our support team is here to help.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>Contact Support</Button>
              <Button variant="outline">Schedule a Call</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

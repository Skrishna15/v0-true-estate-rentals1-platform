import { Building, Shield, TrendingUp, Users, MapPin, CheckCircle, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"

const features = [
  {
    icon: Shield,
    title: "Trust & Verification",
    description: "Verified property ownership with comprehensive trust scores and scam protection.",
    items: ["Owner verification", "Trust score badges", "Scam alerts", "Document validation"],
  },
  {
    icon: TrendingUp,
    title: "Insights & Analytics",
    description: "Deep market insights and wealth analytics for informed real estate decisions.",
    items: ["Market trends", "Property analytics", "Investment insights", "Neighborhood data"],
  },
  {
    icon: Users,
    title: "Community & Interaction",
    description: "Connect with verified owners and access community-driven insights.",
    items: ["Owner Q&A", "Community reviews", "Expert insights", "Discussion forums"],
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "First-time Renter",
    content:
      "TrueEstate helped me avoid a rental scam. The trust scores and verification gave me confidence in my decision.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Real Estate Investor",
    content:
      "The wealth map and analytics tools are incredible. I can see ownership patterns and make better investment decisions.",
    rating: 5,
  },
  {
    name: "Jennifer Martinez",
    role: "Property Manager",
    content:
      "Our clients love the transparency. The verification system has significantly reduced fraudulent inquiries.",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">Trusted by 50,000+ users</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Clarity before Capital
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              TrueEstate combines a user-friendly rental platform with a powerful Wealth Map — serving renters,
              investors, and real estate professionals with verified, transparent ownership and wealth insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/wealth-map">
                  Explore Wealth Map
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/learn">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TrueEstate?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the tools and insights you need to make confident real estate decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wealth Map Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Interactive Wealth Map</h2>
            <p className="text-xl text-gray-600 mb-8">
              Visualize property ownership patterns and wealth distribution across any location
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700">Interactive Map Preview</p>
                  <p className="text-gray-500">Explore properties with verified ownership data</p>
                </div>
              </div>
            </div>
            <Button size="lg" asChild>
              <Link href="/wealth-map">
                Launch Wealth Map
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied users who trust TrueEstate</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join TrueEstate today and gain access to verified property data and powerful analytics tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/signin">Sign Up Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/learn">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
  )
}

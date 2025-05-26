import { Building, Shield, Users, TrendingUp, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">About TrueEstate Rentals</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing real estate transparency by providing verified ownership data, comprehensive property
            insights, and community-driven reviews to help everyone make informed decisions.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Real estate transactions should be transparent, fair, and accessible to everyone. We believe that by
              providing verified ownership data and community insights, we can level the playing field for renters,
              buyers, and investors.
            </p>
            <p className="text-gray-600">
              Our platform combines cutting-edge technology with comprehensive data sources to deliver the most accurate
              and up-to-date property information available.
            </p>
          </div>
          <div className="bg-blue-50 p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Why Transparency Matters</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600">Prevents fraud and scams</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600">Enables informed decision-making</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600">Builds trust between parties</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600">Promotes fair market practices</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe in open, honest, and verifiable information for all real estate transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our platform is powered by community insights and verified user experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We leverage cutting-edge technology to solve real-world real estate challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Building className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real estate information should be accessible and understandable for everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            We're a diverse team of real estate professionals, technologists, and data scientists passionate about
            making real estate more transparent and accessible.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <CardTitle>Sarah Johnson</CardTitle>
                <CardDescription>CEO & Founder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Former real estate agent with 15+ years of experience in property management and sales.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <CardTitle>Michael Chen</CardTitle>
                <CardDescription>CTO</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Tech veteran with expertise in data analytics and machine learning applications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <CardTitle>Emily Rodriguez</CardTitle>
                <CardDescription>Head of Data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Data scientist specializing in real estate market analysis and predictive modeling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

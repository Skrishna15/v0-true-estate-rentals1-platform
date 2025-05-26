"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Shield,
  TrendingUp,
  Users,
  Code,
  Play,
  Github,
  ExternalLink,
  MapPin,
  Search,
  BarChart3,
  Eye,
  Zap,
  Globe,
  Database,
  Smartphone,
} from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Title",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-white">TrueEstate</h1>
          </div>
          <h2 className="text-3xl font-semibold text-white/90">Transparent Rentals & Wealth Intelligence</h2>
          <p className="text-xl text-white/70 max-w-2xl">
            The first platform combining user-friendly rentals with powerful wealth mapping for complete market
            transparency
          </p>
        </div>
        <div className="flex space-x-6 text-white/60">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>For Renters</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>For Investors</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>For Professionals</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "The Problem",
    content: (
      <div className="flex flex-col justify-center h-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-white mb-8">The Problem</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            The rental market operates in darkness, leaving all stakeholders frustrated and uninformed
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Lack of Transparency</h3>
              <p className="text-white/70">
                Renters can't verify property ownership or get reliable information about landlords and property history
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Verification Issues</h3>
              <p className="text-white/70">
                No standardized way to verify legitimate property owners, leading to scams and fraudulent listings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Scattered Insights</h3>
              <p className="text-white/70">
                Investment data and market insights are fragmented across multiple platforms, making analysis difficult
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Badge variant="secondary" className="bg-white/20 text-white text-lg px-6 py-2">
            $200B+ market operating without transparency
          </Badge>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Our Solution",
    content: (
      <div className="flex flex-col justify-center h-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-white mb-8">Our Solution</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            TrueEstate brings unprecedented transparency to the rental market through verified data and intelligent
            insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Verified Ownership</h3>
              <p className="text-white/70">
                Real-time verification of property ownership through public records and blockchain technology
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Transparent Platform</h3>
              <p className="text-white/70">
                User-friendly rental search with complete transparency on ownership, pricing history, and property
                details
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Wealth Mapping</h3>
              <p className="text-white/70">
                Interactive wealth heatmaps showing property values, ownership patterns, and investment opportunities
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-lg px-6 py-2">
            First platform combining rentals + wealth intelligence
          </Badge>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Key Features",
    content: (
      <div className="flex flex-col justify-center h-full space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-white mb-8">Key Features</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Owner Verification</h3>
              <p className="text-white/70 text-sm">
                Instant verification of property ownership through multiple data sources
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Smart Property Search</h3>
              <p className="text-white/70 text-sm">
                Advanced filters with ownership data, price history, and neighborhood insights
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Wealth Heatmaps</h3>
              <p className="text-white/70 text-sm">
                Visual representation of property values and ownership concentration
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Investment Analysis</h3>
              <p className="text-white/70 text-sm">ROI calculations, market trends, and portfolio optimization tools</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Real-time Data</h3>
              <p className="text-white/70 text-sm">
                Live updates on property listings, price changes, and market movements
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Multi-user Platform</h3>
              <p className="text-white/70 text-sm">
                Tailored experiences for renters, investors, and real estate professionals
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Market Opportunity",
    content: (
      <div className="flex flex-col justify-center h-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-white mb-8">Market Opportunity</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Massive and growing market with clear demand for transparency and intelligence
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-4xl font-bold text-green-400">$200B+</div>
              <h3 className="text-xl font-semibold text-white">US Rental Market</h3>
              <p className="text-white/70">Annual rental market size with 44M rental households and growing demand</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-4xl font-bold text-blue-400">$30B+</div>
              <h3 className="text-xl font-semibold text-white">PropTech Sector</h3>
              <p className="text-white/70">Rapidly growing PropTech market with 25% annual growth rate</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-4xl font-bold text-purple-400">$15T+</div>
              <h3 className="text-xl font-semibold text-white">Real Estate Assets</h3>
              <p className="text-white/70">Total US residential real estate value seeking better transparency tools</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">Growing Demand</h3>
              <ul className="space-y-2 text-white/70">
                <li>• 73% of renters want ownership verification</li>
                <li>• 68% of investors seek better market data</li>
                <li>• 81% want transparent pricing history</li>
                <li>• 45% growth in PropTech investment</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">Market Trends</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Digital-first rental experiences</li>
                <li>• Demand for verified platforms</li>
                <li>• Integration of investment tools</li>
                <li>• Real-time market intelligence</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Business Model",
    content: (
      <div className="flex flex-col justify-center h-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-white mb-8">Business Model</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Multi-tier revenue model serving different user segments with scalable pricing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Renters</h3>
                <div className="text-3xl font-bold text-green-400">Freemium</div>
              </div>
              <div className="space-y-3">
                <div className="text-white/90 font-medium">Free Tier:</div>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>• Basic property search</li>
                  <li>• Owner verification</li>
                  <li>• Basic neighborhood data</li>
                </ul>
                <div className="text-white/90 font-medium">Premium ($9.99/mo):</div>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>• Advanced filters</li>
                  <li>• Price history</li>
                  <li>• Alerts & notifications</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Investors</h3>
                <div className="text-3xl font-bold text-blue-400">$49-199/mo</div>
              </div>
              <div className="space-y-3">
                <div className="text-white/90 font-medium">Pro ($49/mo):</div>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>• Wealth mapping</li>
                  <li>• Investment analysis</li>
                  <li>• Portfolio tracking</li>
                </ul>
                <div className="text-white/90 font-medium">Enterprise ($199/mo):</div>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>• Advanced analytics</li>
                  <li>• API access</li>
                  <li>• Custom reports</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Professionals</h3>
                <div className="text-3xl font-bold text-purple-400">Custom</div>
              </div>
              <div className="space-y-3">
                <div className="text-white/90 font-medium">Enterprise Solutions:</div>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>• White-label platform</li>
                  <li>• Custom integrations</li>
                  <li>• Dedicated support</li>
                  <li>• Volume discounts</li>
                  <li>• Training & onboarding</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Badge variant="secondary" className="bg-white/20 text-white text-lg px-6 py-2">
            Projected $10M ARR by Year 3
          </Badge>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: "Technology Stack",
    content: (
      <div className="flex flex-col justify-center h-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-white mb-8">Technology Stack</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Modern, scalable architecture built for performance and reliability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Frontend</h3>
              <div className="space-y-2 text-white/70 text-sm">
                <div>Next.js 15</div>
                <div>React 18</div>
                <div>TypeScript</div>
                <div>Tailwind CSS</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Database className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Backend</h3>
              <div className="space-y-2 text-white/70 text-sm">
                <div>Node.js</div>
                <div>MongoDB</div>
                <div>Redis Cache</div>
                <div>GraphQL API</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Mapping</h3>
              <div className="space-y-2 text-white/70 text-sm">
                <div>Mapbox GL</div>
                <div>Google Maps</div>
                <div>Geospatial APIs</div>
                <div>Custom Overlays</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Data Sources</h3>
              <div className="space-y-2 text-white/70 text-sm">
                <div>ATTOM Data</div>
                <div>RentCast API</div>
                <div>Census Data</div>
                <div>Public Records</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security & Verification</span>
              </h3>
              <ul className="space-y-2 text-white/70">
                <li>• Blockchain verification system</li>
                <li>• Multi-source data validation</li>
                <li>• End-to-end encryption</li>
                <li>• GDPR & CCPA compliant</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>Infrastructure</span>
              </h3>
              <ul className="space-y-2 text-white/70">
                <li>• Vercel deployment</li>
                <li>• CDN optimization</li>
                <li>• Auto-scaling architecture</li>
                <li>• 99.9% uptime SLA</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "Demo & Next Steps",
    content: (
      <div className="flex flex-col justify-center h-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-white mb-8">Demo & Next Steps</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Experience TrueEstate today and join us in revolutionizing the rental market
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Live Demo</h3>
              <p className="text-white/70">Experience the platform with real data and interactive features</p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Demo
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <Github className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Open Source</h3>
              <p className="text-white/70">Explore our codebase and contribute to the future of PropTech</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Roadmap</h3>
              <p className="text-white/70">See what's coming next and how we're scaling the platform</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Roadmap
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">Immediate Next Steps</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Q1 2024</h4>
                  <ul className="space-y-2 text-white/70">
                    <li>• Launch beta platform</li>
                    <li>• Onboard first 1,000 users</li>
                    <li>• Integrate 5 major data sources</li>
                    <li>• Raise seed funding</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Q2 2024</h4>
                  <ul className="space-y-2 text-white/70">
                    <li>• Mobile app launch</li>
                    <li>• Enterprise partnerships</li>
                    <li>• Advanced analytics features</li>
                    <li>• Expand to 10 major cities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-white">Ready to Transform Real Estate?</h3>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                Schedule Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function TrueEstatePitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const exportToPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">TrueEstate</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-white/70 text-sm">
              {currentSlide + 1} / {slides.length}
            </span>
            <Button
              onClick={exportToPDF}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Export PDF
            </Button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-1 px-6 pb-6">
          <div className="h-full transition-all duration-500 ease-in-out">{slides[currentSlide].content}</div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-6">
          <Button
            onClick={prevSlide}
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? "bg-white" : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
            disabled={currentSlide === slides.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="sr-only">Press left/right arrow keys to navigate slides</div>
    </div>
  )
}

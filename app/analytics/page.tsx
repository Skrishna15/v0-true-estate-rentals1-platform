"use client"

import { useState } from "react"
import { Building, TrendingUp, BarChart3, PieChart, DollarSign, Users, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [region, setRegion] = useState("all")

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
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/properties" className="text-gray-600 hover:text-blue-600">
                Properties
              </Link>
              <Link href="/analytics" className="font-semibold text-blue-600">
                Analytics
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                Profile
              </Link>
              <Button variant="outline">Sign Out</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Market Analytics</h1>
            <p className="text-gray-600">Real-time insights into property markets and ownership patterns</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="sf">San Francisco</SelectItem>
                <SelectItem value="la">Los Angeles</SelectItem>
                <SelectItem value="seattle">Seattle</SelectItem>
                <SelectItem value="nyc">New York</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-green-600">$63.7M</p>
                  <p className="text-xs text-green-600">+12.5% from last month</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Properties</p>
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                  <p className="text-xs text-blue-600">+8.3% from last month</p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trusted Owners</p>
                  <p className="text-2xl font-bold text-purple-600">342</p>
                  <p className="text-xs text-purple-600">+15.2% from last month</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Trust Score</p>
                  <p className="text-2xl font-bold text-orange-600">91%</p>
                  <p className="text-xs text-orange-600">+2.1% from last month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Market Trends
              </CardTitle>
              <CardDescription>Property values and market activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Market trend chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Trust Score Distribution
              </CardTitle>
              <CardDescription>Breakdown of owner trust scores across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm">90-100% (Excellent)</span>
                  </div>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm">80-89% (Good)</span>
                  </div>
                  <span className="font-semibold">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm">70-79% (Fair)</span>
                  </div>
                  <span className="font-semibold">18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm">Below 70% (Poor)</span>
                  </div>
                  <span className="font-semibold">5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Markets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Top Markets by Activity
              </CardTitle>
              <CardDescription>Most active real estate markets on our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { city: "San Francisco, CA", properties: 324, value: "$18.2M", growth: "+15%" },
                  { city: "Los Angeles, CA", properties: 287, value: "$15.8M", growth: "+12%" },
                  { city: "Seattle, WA", properties: 198, value: "$12.1M", growth: "+18%" },
                  { city: "New York, NY", properties: 156, value: "$22.4M", growth: "+8%" },
                  { city: "Austin, TX", properties: 134, value: "$8.9M", growth: "+25%" },
                ].map((market, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{market.city}</h4>
                      <p className="text-sm text-gray-600">
                        {market.properties} properties • {market.value}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{market.growth}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Platform Activity
              </CardTitle>
              <CardDescription>Latest verifications and property additions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New property verified", location: "Mission District, SF", time: "2 hours ago" },
                  { action: "Owner trust score updated", location: "Downtown LA", time: "4 hours ago" },
                  { action: "Scam property flagged", location: "Capitol Hill, Seattle", time: "6 hours ago" },
                  { action: "Background check completed", location: "Brooklyn, NY", time: "8 hours ago" },
                  { action: "New owner registered", location: "South Austin, TX", time: "12 hours ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.location}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>AI-powered analysis of current market conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Market Trend</h4>
                <p className="text-sm text-blue-700">
                  Property values in verified listings are trending 8% higher than market average, indicating premium
                  for transparency.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Trust Impact</h4>
                <p className="text-sm text-green-700">
                  Properties with 90%+ trust scores rent 15% faster and command 5% higher prices on average.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Scam Prevention</h4>
                <p className="text-sm text-orange-700">
                  Our verification system has prevented an estimated $2.3M in rental fraud losses this month.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OwnerMiniDashboardProps {
  ownerName: string
  portfolioData: {
    totalProperties: number
    totalValue: number
    cities: { name: string; count: number; value: number; trend: "up" | "down" | "stable" }[]
    propertyTypes: { type: string; count: number; percentage: number }[]
    recentActivity: {
      date: string
      action: "purchased" | "sold" | "renovated" | "listed"
      property: string
      amount?: number
    }[]
    performance: {
      monthlyRevenue: number
      occupancyRate: number
      averageRent: number
      portfolioGrowth: number
    }
  }
}

const mockPortfolioData = {
  totalProperties: 12,
  totalValue: 8200000,
  cities: [
    { name: "San Francisco", count: 8, value: 5200000, trend: "up" as const },
    { name: "Oakland", count: 3, value: 2100000, trend: "stable" as const },
    { name: "Berkeley", count: 1, value: 900000, trend: "up" as const },
  ],
  propertyTypes: [
    { type: "Apartments", count: 7, percentage: 58 },
    { type: "Single Family", count: 3, percentage: 25 },
    { type: "Condos", count: 2, percentage: 17 },
  ],
  recentActivity: [
    {
      date: "2024-01-15",
      action: "purchased" as const,
      property: "2-unit building on Pine St",
      amount: 1200000,
    },
    {
      date: "2024-01-08",
      action: "renovated" as const,
      property: "123 Oak Street unit 2A",
      amount: 45000,
    },
    {
      date: "2023-12-20",
      action: "listed" as const,
      property: "456 Market Street",
      amount: 2800000,
    },
    {
      date: "2023-12-10",
      action: "sold" as const,
      property: "789 Mission Street",
      amount: 950000,
    },
  ],
  performance: {
    monthlyRevenue: 42000,
    occupancyRate: 96,
    averageRent: 3500,
    portfolioGrowth: 12.5,
  },
}

export function OwnerMiniDashboard({ ownerName, portfolioData = mockPortfolioData }: OwnerMiniDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "purchased":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />
      case "sold":
        return <ArrowDownRight className="w-4 h-4 text-blue-600" />
      case "renovated":
        return <Building className="w-4 h-4 text-purple-600" />
      case "listed":
        return <Activity className="w-4 h-4 text-orange-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <ArrowDownRight className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {ownerName}'s Portfolio Dashboard
        </CardTitle>
        <CardDescription>Real-time insights and analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">{portfolioData.totalProperties}</div>
                <div className="text-sm text-blue-600">Properties</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">{formatCurrency(portfolioData.totalValue)}</div>
                <div className="text-sm text-green-600">Total Value</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">{portfolioData.performance.portfolioGrowth}%</div>
                <div className="text-sm text-purple-600">Growth YoY</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-800">{portfolioData.cities.length}</div>
                <div className="text-sm text-orange-600">Markets</div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Financial Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Revenue</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(portfolioData.performance.monthlyRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Occupancy Rate</span>
                    <span className="font-semibold">{portfolioData.performance.occupancyRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Rent</span>
                    <span className="font-semibold">{formatCurrency(portfolioData.performance.averageRent)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Portfolio Health</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Diversification</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Exposure</span>
                    <Badge className="bg-blue-100 text-blue-800">Balanced</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            {/* Geographic Distribution */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Geographic Distribution
              </h4>
              <div className="space-y-3">
                {portfolioData.cities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded" style={{ opacity: 1 - index * 0.2 }}></div>
                      <div>
                        <span className="font-medium">{city.name}</span>
                        <div className="text-sm text-gray-600">{city.count} properties</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{formatCurrency(city.value)}</span>
                        {getTrendIcon(city.trend)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((city.value / portfolioData.totalValue) * 100)}% of portfolio
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Type Distribution */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Property Type Distribution
              </h4>
              <div className="space-y-3">
                {portfolioData.propertyTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: `hsl(${index * 120}, 70%, 50%)`,
                        }}
                      ></div>
                      <span className="font-medium">{type.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{type.count} properties</div>
                      <div className="text-sm text-gray-600">{type.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Recent Activity Timeline */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Recent Portfolio Activity
              </h4>
              <div className="space-y-4">
                {portfolioData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{activity.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {new Date(activity.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.property}</p>
                      {activity.amount && (
                        <p className="text-sm font-semibold text-green-600">{formatCurrency(activity.amount)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Timeline
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

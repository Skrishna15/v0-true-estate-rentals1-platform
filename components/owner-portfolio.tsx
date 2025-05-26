"use client"

import { useState } from "react"
import { MapPin, DollarSign, TrendingUp, Star, Shield, Calendar, BarChart3, Eye, Home } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OwnerPortfolioProps {
  ownerId: string
  ownerData: {
    name: string
    company: string
    avatar: string
    trustScore: number
    totalProperties: number
    totalValue: string
    joinDate: string
    responseRate: string
    responseTime: string
    portfolio: {
      properties: Array<{
        id: string
        address: string
        value: string
        type: string
        bedrooms: number
        bathrooms: number
        sqft: number
        rent: string
        status: "available" | "occupied" | "maintenance"
        images: string[]
        yearBuilt: number
        lastRenovated?: number
        tenantRating: number
        occupancyHistory: string
      }>
      analytics: {
        totalRevenue: string
        occupancyRate: string
        avgTenantStay: string
        maintenanceScore: number
        responseScore: number
        satisfactionScore: number
      }
      markets: Array<{
        city: string
        properties: number
        totalValue: string
        avgRent: string
        occupancyRate: string
      }>
    }
  }
}

export function OwnerPortfolio({ ownerId, ownerData }: OwnerPortfolioProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Add console log to debug
  console.log("OwnerPortfolio rendering with data:", ownerData)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return "🟢"
      case "occupied":
        return "🏠"
      case "maintenance":
        return "🔧"
      default:
        return "⚪"
    }
  }

  // Ensure we have data before rendering
  if (!ownerData || !ownerData.portfolio) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading portfolio data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-green-100">
                <AvatarImage src={ownerData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-green-500 text-white text-lg font-bold">
                  {ownerData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{ownerData.name}</CardTitle>
                <CardDescription className="text-lg">{ownerData.company}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    {ownerData.trustScore}% Trust Score
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    Since {ownerData.joinDate}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{ownerData.totalValue}</div>
              <div className="text-sm text-gray-600">Total Portfolio Value</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Portfolio Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Portfolio Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{ownerData.totalProperties}</div>
              <div className="text-sm text-gray-600">Properties</div>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{ownerData.portfolio.analytics.occupancyRate}</div>
              <div className="text-sm text-gray-600">Occupancy</div>
            </div>
            <div className="text-center bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{ownerData.portfolio.analytics.totalRevenue}</div>
              <div className="text-sm text-gray-600">Annual Revenue</div>
            </div>
            <div className="text-center bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{ownerData.portfolio.analytics.avgTenantStay}</div>
              <div className="text-sm text-gray-600">Avg Tenant Stay</div>
            </div>
            <div className="text-center bg-indigo-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-indigo-600">{ownerData.responseRate}</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
            <div className="text-center bg-rose-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-rose-600">{ownerData.responseTime}</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
          </div>

          {/* Performance Scores */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Maintenance Score</span>
                <span className="text-lg font-bold text-green-600">
                  {ownerData.portfolio.analytics.maintenanceScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${ownerData.portfolio.analytics.maintenanceScore}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Response Score</span>
                <span className="text-lg font-bold text-blue-600">
                  {ownerData.portfolio.analytics.responseScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${ownerData.portfolio.analytics.responseScore}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Satisfaction Score</span>
                <span className="text-lg font-bold text-purple-600">
                  {ownerData.portfolio.analytics.satisfactionScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${ownerData.portfolio.analytics.satisfactionScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Tabs */}
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Properties ({ownerData.totalProperties})
          </TabsTrigger>
          <TabsTrigger value="markets" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Markets ({ownerData.portfolio.markets.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Property Portfolio</h3>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>

          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {ownerData.portfolio.properties.map((property) => (
              <Card
                key={property.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedProperty === property.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedProperty(selectedProperty === property.id ? null : property.id)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={property.images[0] || "/placeholder.svg?height=200&width=300"}
                      alt={property.address}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge className={getStatusColor(property.status)}>
                        {getStatusIcon(property.status)} {property.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-black/70 text-white">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {property.value}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{property.rent}/month</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{property.tenantRating}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.sqft} sqft</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{property.type}</Badge>
                      <div className="text-xs text-gray-500">Built {property.yearBuilt}</div>
                    </div>

                    {selectedProperty === property.id && (
                      <div className="mt-4 pt-4 border-t space-y-3 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Occupancy History:</span>
                            <div className="font-medium">{property.occupancyHistory}</div>
                          </div>
                          {property.lastRenovated && (
                            <div>
                              <span className="text-gray-600">Last Renovated:</span>
                              <div className="font-medium">{property.lastRenovated}</div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            Location
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Markets Tab */}
        <TabsContent value="markets" className="space-y-4">
          <h3 className="text-lg font-semibold">Market Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownerData.portfolio.markets.map((market, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{market.city}</span>
                    <Badge variant="outline">{market.properties} properties</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Value:</span>
                      <span className="font-semibold text-green-600">{market.totalValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Rent:</span>
                      <span className="font-semibold">{market.avgRent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Occupancy:</span>
                      <span className="font-semibold text-blue-600">{market.occupancyRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Portfolio Analytics</h3>

          {/* Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue & Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Monthly Revenue Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rental Income</span>
                      <span className="font-semibold text-green-600">$45,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Property Management</span>
                      <span className="font-semibold text-blue-600">$3,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Maintenance Costs</span>
                      <span className="font-semibold text-red-600">-$2,800</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Net Income</span>
                        <span className="font-bold text-green-600">$45,600</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Tenant Satisfaction</span>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Maintenance Response</span>
                        <span className="text-sm font-medium">98%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "98%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Property Condition</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ownerData.portfolio.properties.slice(0, 3).map((property, index) => (
                  <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{property.address}</div>
                        <div className="text-sm text-gray-600">{property.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{property.rent}/mo</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {property.tenantRating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

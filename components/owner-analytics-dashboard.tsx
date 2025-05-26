"use client"

import { BarChart3, TrendingUp, Building, DollarSign, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OwnerAnalyticsDashboardProps {
  owner: {
    name: string
    company?: string
    totalProperties: number
    totalValue: string
    portfolio: {
      cities: { name: string; count: number; value: string }[]
      propertyTypes: { type: string; count: number }[]
      recentActivity: { action: string; property: string; date: string }[]
    }
  }
}

export function OwnerAnalyticsDashboard({ owner }: OwnerAnalyticsDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Owner Portfolio Analytics
        </CardTitle>
        <CardDescription>Complete portfolio insights for {owner.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{owner.totalProperties}</div>
            <div className="text-sm text-blue-600">Total Properties</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{owner.totalValue}</div>
            <div className="text-sm text-green-600">Portfolio Value</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{owner.portfolio.cities.length}</div>
            <div className="text-sm text-purple-600">Markets</div>
          </div>
        </div>

        {/* Property Distribution by City */}
        <div>
          <h4 className="font-semibold mb-3">Property Distribution by City</h4>
          <div className="space-y-3">
            {owner.portfolio.cities.map((city, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="font-medium">{city.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{city.count} properties</span>
                  <Badge variant="outline">{city.value}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div>
          <h4 className="font-semibold mb-3">Property Types</h4>
          <div className="grid grid-cols-2 gap-3">
            {owner.portfolio.propertyTypes.map((type, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{type.type}</span>
                <Badge>{type.count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Recent Activity
          </h4>
          <div className="space-y-3">
            {owner.portfolio.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.property}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

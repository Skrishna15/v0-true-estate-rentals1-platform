"use client"

import { MapPin, DollarSign, Star, Shield, BarChart3, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface OwnerPortfolioSimpleProps {
  ownerData: {
    name: string
    company: string
    avatar: string
    trustScore: number
    totalProperties: number
    totalValue: string
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
        tenantRating: number
      }>
    }
  }
}

export function OwnerPortfolioSimple({ ownerData }: OwnerPortfolioSimpleProps) {
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

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
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
            <h3 className="text-2xl font-bold">{ownerData.name}</h3>
            <p className="text-lg text-gray-600">{ownerData.company}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-green-500 text-white">
                <Shield className="w-3 h-3 mr-1" />
                {ownerData.trustScore}% Trust Score
              </Badge>
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold text-green-600">{ownerData.totalValue}</div>
            <div className="text-sm text-gray-600">Total Portfolio Value</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{ownerData.totalProperties}</div>
            <div className="text-sm text-gray-600">Properties</div>
          </div>
          <div className="text-center bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">96%</div>
            <div className="text-sm text-gray-600">Occupancy</div>
          </div>
          <div className="text-center bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div>
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Property Portfolio ({ownerData.portfolio.properties.length} Properties)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownerData.portfolio.properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={property.images[0] || "/placeholder.svg?height=200&width=300"}
                    alt={property.address}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
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
                      <h5 className="font-semibold text-lg">{property.rent}/month</h5>
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

                  <Button size="sm" className="w-full mt-3">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Market Distribution */}
      <div>
        <h4 className="text-xl font-bold mb-4">Market Distribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>San Francisco</span>
                <Badge variant="outline">8 properties</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Value:</span>
                  <span className="font-semibold text-green-600">$6.8M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Rent:</span>
                  <span className="font-semibold">$5,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Occupancy:</span>
                  <span className="font-semibold text-blue-600">96%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Oakland</span>
                <Badge variant="outline">3 properties</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Value:</span>
                  <span className="font-semibold text-green-600">$1.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Rent:</span>
                  <span className="font-semibold">$3,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Occupancy:</span>
                  <span className="font-semibold text-blue-600">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Berkeley</span>
                <Badge variant="outline">1 property</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Value:</span>
                  <span className="font-semibold text-green-600">$200K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Rent:</span>
                  <span className="font-semibold">$2,900</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Occupancy:</span>
                  <span className="font-semibold text-blue-600">100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

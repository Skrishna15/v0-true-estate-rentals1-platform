"use client"

import { useState } from "react"
import { Shield, TrendingUp, Building, Star, MapPin, ChevronRight, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Property {
  id: string
  owner: string
  company: string
  totalValue: string
  properties: number
  locations: string[]
  trustScore: number
  recentActivity: string
  coordinates: [number, number]
  address: string
  propertyType: string
  yearBuilt: number
  lastSale: string
  marketValue: number
  rentEstimate: number
  neighborhood: string
  walkScore: number
  crimeRate: string
  appreciation: number
  verified: boolean
  scamReports: number
  tenantReviews: number
}

interface TopVerifiedOwnersPanelProps {
  properties: Property[]
  selectedOwner: string | null
  onOwnerSelect: (ownerId: string | null) => void
}

export function TopVerifiedOwnersPanel({ properties, selectedOwner, onOwnerSelect }: TopVerifiedOwnersPanelProps) {
  const [sortBy, setSortBy] = useState<"trust" | "value" | "properties">("trust")

  // Sort properties based on selected criteria
  const sortedProperties = [...properties]
    .sort((a, b) => {
      switch (sortBy) {
        case "trust":
          return b.trustScore - a.trustScore
        case "value":
          return (
            Number.parseFloat(b.totalValue.replace(/[$M]/g, "")) - Number.parseFloat(a.totalValue.replace(/[$M]/g, ""))
          )
        case "properties":
          return b.properties - a.properties
        default:
          return b.trustScore - a.trustScore
      }
    })
    .slice(0, 8) // Show top 8 owners

  const getTrustScoreColor = (score: number) => {
    if (score >= 95) return "bg-emerald-500"
    if (score >= 90) return "bg-green-500"
    if (score >= 85) return "bg-yellow-500"
    if (score >= 80) return "bg-orange-500"
    return "bg-red-500"
  }

  const getTrustScoreLabel = (score: number) => {
    if (score >= 95) return "Exceptional"
    if (score >= 90) return "Excellent"
    if (score >= 85) return "Very Good"
    if (score >= 80) return "Good"
    return "Fair"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Top Verified Owners</CardTitle>
              <CardDescription>Highest trust scores and portfolio values</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Users className="w-3 h-3 mr-1" />
            {properties.filter((p) => p.verified).length} Verified
          </Badge>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={sortBy === "trust" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("trust")}
            className="text-xs"
          >
            <Shield className="w-3 h-3 mr-1" />
            Trust Score
          </Button>
          <Button
            variant={sortBy === "value" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("value")}
            className="text-xs"
          >
            <DollarSign className="w-3 h-3 mr-1" />
            Portfolio Value
          </Button>
          <Button
            variant={sortBy === "properties" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("properties")}
            className="text-xs"
          >
            <Building className="w-3 h-3 mr-1" />
            Properties
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
        {sortedProperties.map((owner, index) => (
          <div
            key={owner.id}
            className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedOwner === owner.id
                ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md"
                : "bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200"
            }`}
            onClick={() => onOwnerSelect(selectedOwner === owner.id ? null : owner.id)}
          >
            {/* Rank Badge */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {index + 1}
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials(owner.owner)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {owner.owner}
                  </h4>
                  <p className="text-sm text-gray-600">{owner.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`${getTrustScoreColor(owner.trustScore)} text-white text-xs px-2 py-0.5`}
                      style={{ backgroundColor: getTrustScoreColor(owner.trustScore).replace("bg-", "") }}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {owner.trustScore}%
                    </Badge>
                    <span className="text-xs text-gray-500">{getTrustScoreLabel(owner.trustScore)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                {owner.scamReports === 0 && (
                  <div className="flex items-center gap-1 text-green-600 text-xs mb-1">
                    <Shield className="w-3 h-3" />
                    Scam-Free
                  </div>
                )}
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    selectedOwner === owner.id ? "rotate-90" : ""
                  }`}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded-lg text-center">
                <div className="text-xs text-green-600 font-medium">Portfolio</div>
                <div className="font-bold text-green-800 text-sm">{owner.totalValue}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">Properties</div>
                <div className="font-bold text-blue-800 text-sm">{owner.properties}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2 rounded-lg text-center">
                <div className="text-xs text-purple-600 font-medium">Rating</div>
                <div className="font-bold text-purple-800 text-sm flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {owner.tenantReviews?.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Markets */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">
                <span className="font-medium">Markets:</span> {owner.locations.slice(0, 2).join(", ")}
                {owner.locations.length > 2 && ` +${owner.locations.length - 2} more`}
              </span>
            </div>

            {/* Expanded Details */}
            {selectedOwner === owner.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-in slide-in-from-top-2 duration-300">
                {/* Recent Activity */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800 text-sm">Recent Activity</span>
                  </div>
                  <p className="text-sm text-blue-700">{owner.recentActivity}</p>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Walk Score</div>
                    <div className="font-semibold text-gray-800">{owner.walkScore}/100</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Crime Rate</div>
                    <div className="font-semibold text-gray-800">{owner.crimeRate}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Appreciation</div>
                    <div className="font-semibold text-green-600">+{owner.appreciation?.toFixed(1)}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Avg Rent</div>
                    <div className="font-semibold text-gray-800">${owner.rentEstimate?.toLocaleString()}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/property/${owner.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Building className="w-4 h-4 mr-2" />
                      View Portfolio
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* View All Button */}
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={() => window.open("/owners", "_blank")}>
            <Users className="w-4 h-4 mr-2" />
            View All Verified Owners
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

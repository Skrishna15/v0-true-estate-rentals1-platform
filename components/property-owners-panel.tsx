"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, TrendingUp, MapPin, Building, Star, Shield, ChevronRight } from "lucide-react"
import Link from "next/link"

interface PropertyOwner {
  id: string
  name: string
  rank: number
  trustScore: number
  portfolioValue: number
  propertyCount: number
  primaryAddress: string
  city: string
  state: string
  verified: boolean
  avatar?: string
  growthRate: number
  recentActivity: string
}

const topOwners: PropertyOwner[] = [
  {
    id: "owner-1",
    name: "Michael Chen",
    rank: 1,
    trustScore: 88,
    portfolioValue: 15700000,
    propertyCount: 23,
    primaryAddress: "456 Pine Avenue",
    city: "Los Angeles",
    state: "CA",
    verified: true,
    growthRate: 12.5,
    recentActivity: "2 days ago",
  },
  {
    id: "owner-2",
    name: "Sarah Johnson",
    rank: 2,
    trustScore: 95,
    portfolioValue: 8200000,
    propertyCount: 12,
    primaryAddress: "123 Oak Street",
    city: "San Francisco",
    state: "CA",
    verified: true,
    growthRate: 8.3,
    recentActivity: "1 week ago",
  },
  {
    id: "owner-3",
    name: "David Rodriguez",
    rank: 3,
    trustScore: 92,
    portfolioValue: 6800000,
    propertyCount: 15,
    primaryAddress: "789 Maple Drive",
    city: "Seattle",
    state: "WA",
    verified: true,
    growthRate: 15.2,
    recentActivity: "3 days ago",
  },
  {
    id: "owner-4",
    name: "Emily Zhang",
    rank: 4,
    trustScore: 89,
    portfolioValue: 5900000,
    propertyCount: 9,
    primaryAddress: "321 Cedar Lane",
    city: "Austin",
    state: "TX",
    verified: false,
    growthRate: 6.7,
    recentActivity: "5 days ago",
  },
  {
    id: "owner-5",
    name: "Robert Kim",
    rank: 5,
    trustScore: 94,
    portfolioValue: 4300000,
    propertyCount: 8,
    primaryAddress: "654 Birch Street",
    city: "Denver",
    state: "CO",
    verified: true,
    growthRate: 9.1,
    recentActivity: "1 day ago",
  },
]

interface PropertyOwnersPanelProps {
  isVisible: boolean
  onToggle: () => void
}

export function PropertyOwnersPanel({ isVisible, onToggle }: PropertyOwnersPanelProps) {
  const [owners, setOwners] = useState<PropertyOwner[]>(topOwners)
  const [sortBy, setSortBy] = useState<"value" | "count" | "trust">("value")

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50"
    if (score >= 80) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />
    if (rank <= 3) return <Star className="w-4 h-4 text-gray-400" />
    return <span className="text-sm font-bold text-gray-500">#{rank}</span>
  }

  const sortedOwners = [...owners].sort((a, b) => {
    switch (sortBy) {
      case "value":
        return b.portfolioValue - a.portfolioValue
      case "count":
        return b.propertyCount - a.propertyCount
      case "trust":
        return b.trustScore - a.trustScore
      default:
        return a.rank - b.rank
    }
  })

  if (!isVisible) {
    return (
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-30">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 rotate-90"
        >
          <Building className="w-4 h-4 mr-2" />
          Property Owners
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-2xl z-30 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900">Property Owners</h3>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            ×
          </Button>
        </div>
        <p className="text-sm text-gray-600">Ranked by portfolio value</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {owners.length} Total Owners
          </Badge>
          <Badge variant="outline" className="text-xs">
            Live Data
          </Badge>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex gap-1">
          <Button
            variant={sortBy === "value" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("value")}
            className="text-xs"
          >
            Value
          </Button>
          <Button
            variant={sortBy === "count" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("count")}
            className="text-xs"
          >
            Count
          </Button>
          <Button
            variant={sortBy === "trust" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("trust")}
            className="text-xs"
          >
            Trust
          </Button>
        </div>
      </div>

      {/* Owners List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {sortedOwners.map((owner, index) => (
            <Card key={owner.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  {/* Rank & Avatar */}
                  <div className="flex flex-col items-center gap-1">
                    {getRankIcon(owner.rank)}
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={owner.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {owner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Owner Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">{owner.name}</h4>
                      {owner.verified && <Shield className="w-3 h-3 text-green-500 flex-shrink-0" />}
                    </div>

                    <div className="text-xs text-gray-500 mb-2">#{owner.rank} by portfolio value</div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Total Value:</span>
                        <span className="font-bold text-green-600">{formatCurrency(owner.portfolioValue)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Properties:</span>
                        <span className="font-semibold">{owner.propertyCount}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Trust Score:</span>
                        <Badge className={`text-xs ${getTrustScoreColor(owner.trustScore)}`}>{owner.trustScore}%</Badge>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {owner.city}, {owner.state}
                      </span>
                    </div>

                    {/* Growth Indicator */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">+{owner.growthRate}%</span>
                      </div>
                      <span className="text-xs text-gray-400">{owner.recentActivity}</span>
                    </div>

                    {/* View Profile Button */}
                    <Link href={`/owner/${owner.id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                        View Profile
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50">
        <Button variant="outline" size="sm" className="w-full text-xs">
          View All Property Owners
        </Button>
      </div>
    </div>
  )
}

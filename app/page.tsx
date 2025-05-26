"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Building, Search, User, Bell, Menu, Play, Eye, Clock, MapPin, Star, Share, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  const featuredProperties = [
    {
      id: 1,
      title: "Luxury Downtown Condo - Owner Verified ✓",
      thumbnail: "/placeholder.svg?height=180&width=320&query=modern luxury condo downtown",
      views: "2.3K views",
      timeAgo: "2 days ago",
      owner: "Sarah Johnson Properties",
      trustScore: 95,
      price: "$3,200/month",
    },
    {
      id: 2,
      title: "Spacious Family Home - Transparent Pricing",
      thumbnail: "/placeholder.svg?height=180&width=320&query=family house suburban",
      views: "1.8K views",
      timeAgo: "5 days ago",
      owner: "Metro Real Estate",
      trustScore: 88,
      price: "$2,800/month",
    },
    {
      id: 3,
      title: "Studio Apartment - Perfect for Students",
      thumbnail: "/placeholder.svg?height=180&width=320&query=studio apartment modern",
      views: "956 views",
      timeAgo: "1 week ago",
      owner: "Campus Housing LLC",
      trustScore: 92,
      price: "$1,400/month",
    },
    {
      id: 4,
      title: "Penthouse with City Views - Premium Location",
      thumbnail: "/placeholder.svg?height=180&width=320&query=penthouse city view",
      views: "4.1K views",
      timeAgo: "3 days ago",
      owner: "Elite Properties",
      trustScore: 97,
      price: "$5,500/month",
    },
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* YouTube-style Header */}
      <header className="border-b bg-white sticky top-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl hidden sm:block">TrueEstate</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search properties, owners, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="rounded-r-none border-r-0 focus:border-blue-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="rounded-l-none px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-l-0"
                variant="outline"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button variant="ghost" size="sm">
                  <Bell className="w-5 h-5" />
                </Button>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/signin">
                  <User className="w-4 h-4 mr-2" />
                  Sign in
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex max-w-screen-2xl mx-auto">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Featured Property Video/Content */}
          <div className="mb-6">
            <div className="aspect-video bg-black rounded-lg relative overflow-hidden mb-4">
              <img
                src="/placeholder.svg?height=480&width=854&query=luxury real estate property tour"
                alt="Featured Property"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Button size="lg" className="rounded-full w-16 h-16">
                  <Play className="w-8 h-8" />
                </Button>
              </div>
              <Badge className="absolute top-4 left-4 bg-red-600">LIVE TOUR</Badge>
              <Badge className="absolute top-4 right-4 bg-green-600">VERIFIED OWNER</Badge>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h1 className="text-xl font-semibold">
                Luxury Downtown Penthouse - Complete Property Tour & Owner Interview
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  2,347 views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />2 days ago
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Downtown San Francisco
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40&query=professional woman" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Sarah Johnson Properties</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <span>1.2K subscribers</span>
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        95% Trust Score
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline">Subscribe</Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-lg text-green-600 mb-2">$4,200/month</div>
                <p className="text-sm text-gray-700">
                  Experience luxury living in this stunning 2-bedroom penthouse with panoramic city views.
                  Owner-verified property with complete transparency on pricing, fees, and building amenities. Take a
                  virtual tour and meet the owner directly through our platform.
                </p>
                <Button className="mt-3">Schedule Viewing</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Related Properties */}
        <div className="w-96 p-6 border-l">
          <h3 className="font-semibold mb-4">Related Properties</h3>
          <div className="space-y-4">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={property.thumbnail || "/placeholder.svg"}
                        alt={property.title}
                        className="w-40 h-24 object-cover rounded"
                      />
                      <Badge className="absolute bottom-1 right-1 text-xs bg-black bg-opacity-70">TOUR</Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{property.title}</h4>
                      <p className="text-xs text-gray-600 mb-1">{property.owner}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{property.views}</span>
                        <span>•</span>
                        <span>{property.timeAgo}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-green-600 text-sm">{property.price}</span>
                        <Badge variant="secondary" className="text-xs">
                          {property.trustScore}% Trust
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-3">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/wealth-map">
                <MapPin className="w-4 h-4 mr-2" />
                Explore Wealth Map
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/properties">
                <Building className="w-4 h-4 mr-2" />
                Browse All Properties
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

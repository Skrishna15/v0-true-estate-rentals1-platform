"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Building, Search, User, Bell, Menu, Play, Share, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  const relatedProperties = [
    {
      id: 1,
      title: "Ghibli Chill 🏠 Studying, coffee, reading, healing 🎧 Ghibli Music",
      thumbnail: "/placeholder.svg?height=94&width=168&query=ghibli+house+anime+style",
      channel: "Relaxing Ghibli Piano",
      views: "835K views",
      timeAgo: "4 months ago",
      duration: "1:35:40",
      verified: true,
    },
    {
      id: 2,
      title: "威斯汀：习近平政治冷酷上的自白许诺全文，习近平全盘...",
      thumbnail: "/placeholder.svg?height=94&width=168&query=modern+apartment+building",
      channel: "威斯汀",
      views: "240K views",
      timeAgo: "13 hours ago",
      duration: "28:37",
      verified: false,
      isNew: true,
    },
    {
      id: 3,
      title: "4 Hours Chopin for Studying, Concentration & Relaxation",
      thumbnail: "/placeholder.svg?height=94&width=168&query=classical+music+piano",
      channel: "HALIDONMUSIC",
      views: "18M views",
      timeAgo: "3 years ago",
      duration: "4:00:59",
      verified: true,
      category: "Fundraiser",
    },
    {
      id: 4,
      title: "Just Listen! Frequency Of God 1111 Hz Unexplainable ...",
      thumbnail: "/placeholder.svg?height=94&width=168&query=spiritual+frequency+meditation",
      channel: "Frequency Harmony",
      views: "3.5M views",
      timeAgo: "8 months ago",
      duration: "3:33:33",
      verified: false,
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
      <header className="border-b bg-white sticky top-0 z-50 px-4 py-2">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-6 h-6" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">TrueEstate</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="flex">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="rounded-r-none border-gray-300 focus:border-blue-500 h-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="rounded-l-none px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-l-0 h-10"
                variant="outline"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button variant="ghost" size="sm" className="p-2">
                  <Bell className="w-6 h-6" />
                </Button>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50" asChild>
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
          {/* Main Video/Property Area */}
          <div className="mb-6">
            {/* Video Player Area */}
            <div className="aspect-video bg-black rounded-lg relative overflow-hidden mb-4">
              {!session ? (
                // Sign in prompt when not authenticated
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white">
                  <h2 className="text-2xl font-semibold mb-2">Sign in to confirm you're not a bot</h2>
                  <p className="text-gray-300 mb-4">
                    This helps protect our community.{" "}
                    <Link href="/learn" className="text-blue-400 hover:underline">
                      Learn more
                    </Link>
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full" asChild>
                    <Link href="/signin">Sign in</Link>
                  </Button>
                </div>
              ) : (
                // Property content when authenticated
                <>
                  <img
                    src="/placeholder.svg?height=480&width=854&query=luxury+real+estate+property+tour"
                    alt="Property Tour"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Button size="lg" className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-700">
                      <Play className="w-8 h-8 ml-1" />
                    </Button>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-red-600">LIVE</Badge>
                </>
              )}
            </div>

            {/* Property Info */}
            <div className="space-y-4">
              <h1 className="text-xl font-semibold">TrueEstate</h1>

              <div className="text-sm text-gray-600">Unlisted</div>

              {/* Channel Info & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">y21cd028</span>
                    </div>
                    <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">Subscribe</Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 rounded-full">
                    <Button variant="ghost" size="sm" className="rounded-l-full px-4">
                      👍 0
                    </Button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <Button variant="ghost" size="sm" className="rounded-r-full px-4">
                      👎
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full px-4">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full px-4">
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Video Stats */}
              <div className="text-sm text-gray-600">No views • 3 minutes ago</div>

              {/* Description */}
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm">
                  A walkthrough of the key features of the TrueEstate Rentals platform: ownership verification, wealth
                  map, property filtering, and reporting tools.
                  <button className="text-blue-600 hover:underline ml-1">...more</button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Related Content */}
        <div className="w-96 p-6">
          <div className="space-y-2">
            {relatedProperties.map((property) => (
              <div key={property.id} className="flex gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div className="relative flex-shrink-0">
                  <img
                    src={property.thumbnail || "/placeholder.svg"}
                    alt={property.title}
                    className="w-42 h-24 object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                    {property.duration}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium line-clamp-2 mb-1 leading-tight">{property.title}</h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <span>{property.channel}</span>
                      {property.verified && <span className="text-gray-500">✓</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{property.views}</span>
                      <span>•</span>
                      <span>{property.timeAgo}</span>
                      {property.isNew && (
                        <Badge variant="secondary" className="text-xs ml-1">
                          New
                        </Badge>
                      )}
                    </div>
                    {property.category && (
                      <Badge variant="outline" className="text-xs">
                        {property.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="p-1 flex-shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Heart,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Building2,
  Filter,
  Grid,
  List,
  ContrastIcon as Compare,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchResultsProps {
  properties: any[]
  onPropertySelect?: (property: any) => void
  onBookmark?: (property: any) => void
  onCompare?: (properties: any[]) => void
  loading?: boolean
  searchQuery?: string
}

export function SearchResults({
  properties,
  onPropertySelect,
  onBookmark,
  onCompare,
  loading = false,
  searchQuery = "",
}: SearchResultsProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Set<string>>(new Set())

  // Add this helper function at the top of the component
  const showNotification = (message: string, color: string) => {
    const notification = document.createElement("div")
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: system-ui;
        font-size: 14px;
        font-weight: 500;
      ">
        ${message}
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  const handleViewDetails = (property: any) => {
    // Try to navigate to property details page
    try {
      const propertyId = property.id || property._id || `property-${Date.now()}`
      router.push(`/property/${propertyId}`)
    } catch (error) {
      console.error("Navigation error:", error)
      // Fallback: call onPropertySelect if navigation fails
      onPropertySelect?.(property)
    }
  }

  const handleBookmark = async (property: any) => {
    try {
      // Get current user from localStorage
      const userData = localStorage.getItem("trueestate_user")
      if (!userData) {
        alert("Please sign in to bookmark properties")
        return
      }

      const user = JSON.parse(userData)
      const propertyId = property.id || property._id || `property-${Date.now()}`
      const isCurrentlyBookmarked = bookmarkedProperties.has(propertyId)

      if (isCurrentlyBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks?propertyId=${propertyId}&userId=${user.id || "demo-user"}`, {
          method: "DELETE",
        })

        if (response.ok) {
          const newBookmarked = new Set(bookmarkedProperties)
          newBookmarked.delete(propertyId)
          setBookmarkedProperties(newBookmarked)

          // Show success message
          showNotification("✓ Bookmark removed", "#6b7280")
        }
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id || "demo-user",
            propertyId: propertyId,
            propertyData: {
              address: property.address,
              owner: property.owner?.name || property.owner,
              value: property.value || property.price,
              trustScore: property.trustScore || property.owner?.trustScore,
              coordinates: property.coordinates,
            },
            notes: "",
            tags: [],
          }),
        })

        const result = await response.json()

        if (result.success) {
          const newBookmarked = new Set(bookmarkedProperties)
          newBookmarked.add(propertyId)
          setBookmarkedProperties(newBookmarked)

          // Show success message
          showNotification("✓ Property bookmarked!", "#10b981")

          // Trigger bookmark list refresh
          window.dispatchEvent(new CustomEvent("bookmarkAdded", { detail: property }))
        } else {
          throw new Error(result.error || "Failed to bookmark property")
        }
      }

      onBookmark?.(property)
    } catch (error) {
      console.error("Bookmark error:", error)
      showNotification("⚠ Failed to update bookmark", "#ef4444")
    }
  }

  const handleCompareToggle = (propertyId: string) => {
    const newSelected = selectedForComparison.includes(propertyId)
      ? selectedForComparison.filter((id) => id !== propertyId)
      : [...selectedForComparison, propertyId].slice(0, 4) // Max 4 properties

    setSelectedForComparison(newSelected)
  }

  const handleCompare = () => {
    const selectedProperties = properties.filter((p) => selectedForComparison.includes(p.id || p._id))
    onCompare?.(selectedProperties)
  }

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.marketValue || a.price || 0) - (b.marketValue || b.price || 0)
      case "price-high":
        return (b.marketValue || b.price || 0) - (a.marketValue || a.price || 0)
      case "trust-score":
        return (b.trustScore || b.owner?.trustScore || 0) - (a.trustScore || a.owner?.trustScore || 0)
      case "newest":
        return new Date(b.lastSale || b.createdAt || 0).getTime() - new Date(a.lastSale || a.createdAt || 0).getTime()
      case "sqft":
        return (b.sqft || 0) - (a.sqft || 0)
      default:
        return 0
    }
  })

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case "stable":
        return <Minus className="w-4 h-4 text-gray-500" />
      default:
        return null
    }
  }

  const getRiskLevel = (trustScore: number, scamReports: number) => {
    if (scamReports > 0) return { level: "High", color: "text-red-600 bg-red-50" }
    if (trustScore >= 90) return { level: "Low", color: "text-green-600 bg-green-50" }
    if (trustScore >= 80) return { level: "Medium", color: "text-yellow-600 bg-yellow-50" }
    return { level: "High", color: "text-red-600 bg-red-50" }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-y-4">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Searching properties...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (properties.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No properties found</h3>
              <p className="text-gray-600">
                {searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your search criteria"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Search Results
                <Badge variant="secondary">{properties.length} properties</Badge>
              </CardTitle>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-1">
                  Results for "<span className="font-medium">{searchQuery}</span>"
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedForComparison.length > 1 && (
                <Button onClick={handleCompare} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Compare className="w-4 h-4 mr-1" />
                  Compare ({selectedForComparison.length})
                </Button>
              )}
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded px-2 py-1"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="trust-score">Trust Score</option>
                <option value="newest">Newest</option>
                <option value="sqft">Square Footage</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing {properties.length} of {properties.length} results
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results List/Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {sortedProperties.map((property) => {
          const propertyId = property.id || property._id || `property-${Date.now()}`
          const trustScore = property.trustScore || property.owner?.trustScore || 75
          const risk = getRiskLevel(trustScore, property.scamReports || 0)
          const isBookmarked = bookmarkedProperties.has(propertyId)
          const isSelected = selectedForComparison.includes(propertyId)

          return (
            <Card
              key={propertyId}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
            >
              <CardContent className="p-6">
                {viewMode === "list" ? (
                  // List View
                  <div className="flex gap-6">
                    {/* Property Image Placeholder */}
                    <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{property.address}</h3>
                          <p className="text-sm text-gray-600">
                            {property.city}, {property.state}
                          </p>
                          <p className="text-xs text-gray-500">
                            Owner: {property.owner?.name || property.owner || "Unknown"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBookmark(property)
                            }}
                            className={isBookmarked ? "text-red-500" : "text-gray-400"}
                          >
                            <Heart className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCompareToggle(propertyId)
                            }}
                            className={isSelected ? "text-blue-600 bg-blue-50" : "text-gray-400"}
                          >
                            <Compare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Price</div>
                          <div className="font-semibold text-green-600">
                            {property.value || property.price || "N/A"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Trust Score</div>
                          <div className="flex items-center gap-1">
                            <span
                              className={`font-semibold ${
                                trustScore >= 90
                                  ? "text-green-600"
                                  : trustScore >= 80
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {trustScore}%
                            </span>
                            {property.verified && <Shield className="w-3 h-3 text-green-500" />}
                          </div>
                        </div>
                        {property.sqft && (
                          <div>
                            <div className="text-xs text-gray-500">Sq Ft</div>
                            <div className="font-medium">{property.sqft.toLocaleString()}</div>
                          </div>
                        )}
                        {property.bedrooms && (
                          <div>
                            <div className="text-xs text-gray-500">Beds/Baths</div>
                            <div className="font-medium">
                              {property.bedrooms}bd / {property.bathrooms}ba
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge className={risk.color}>{risk.level} Risk</Badge>
                          {property.marketTrend && (
                            <div className="flex items-center gap-1">
                              {getTrendIcon(property.marketTrend)}
                              <span className="text-xs capitalize">{property.marketTrend}</span>
                            </div>
                          )}
                          {property.verified && <Badge className="bg-green-100 text-green-800">Verified Owner</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetails(property)
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Focus on map
                              window.dispatchEvent(new CustomEvent("focusProperty", { detail: property }))
                            }}
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            Show on Map
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Grid View
                  <div className="space-y-4">
                    {/* Property Image Placeholder */}
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>

                    {/* Property Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{property.address}</h3>
                          <p className="text-sm text-gray-600">
                            {property.city}, {property.state}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBookmark(property)
                            }}
                            className={isBookmarked ? "text-red-500" : "text-gray-400"}
                          >
                            <Heart className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCompareToggle(propertyId)
                            }}
                            className={isSelected ? "text-blue-600" : "text-gray-400"}
                          >
                            <Compare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-lg font-bold text-green-600">
                        {property.value || property.price || "N/A"}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Trust:</span>
                          <span
                            className={`ml-1 font-medium ${
                              trustScore >= 90
                                ? "text-green-600"
                                : trustScore >= 80
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {trustScore}%
                          </span>
                        </div>
                        {property.sqft && (
                          <div>
                            <span className="text-gray-500">Sq Ft:</span>
                            <span className="ml-1 font-medium">{property.sqft.toLocaleString()}</span>
                          </div>
                        )}
                        {property.bedrooms && (
                          <div>
                            <span className="text-gray-500">Beds:</span>
                            <span className="ml-1 font-medium">{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div>
                            <span className="text-gray-500">Baths:</span>
                            <span className="ml-1 font-medium">{property.bathrooms}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={risk.color} variant="secondary">
                          {risk.level} Risk
                        </Badge>
                        {property.verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetails(property)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.dispatchEvent(new CustomEvent("focusProperty", { detail: property }))
                          }}
                        >
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More Button (if needed) */}
      {properties.length > 10 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Properties
          </Button>
        </div>
      )}
    </div>
  )
}

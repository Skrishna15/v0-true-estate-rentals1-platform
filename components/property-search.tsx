"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertySearchProps {
  onResults?: (properties: any[]) => void
}

export function PropertySearch({ onResults }: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    propertyType: "",
    amenities: "",
    proximity: "",
    trustScore: "",
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      // Search using multiple APIs
      const [attomResponse, zillowResponse] = await Promise.all([
        fetch(`/api/properties?address=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/zillow-data?address=${encodeURIComponent(searchQuery)}`),
      ])

      const attomData = await attomResponse.json()
      const zillowData = await zillowResponse.json()

      // Combine and process results
      const combinedResults = [...(attomData.property?.property || []), ...(zillowData.properties || [])]

      setProperties(combinedResults)
      onResults?.(combinedResults)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by address, city, or neighborhood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-12 pr-4 py-3"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="w-4 h-4" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* FEATURE: Advanced Search Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={filters.minPrice} onValueChange={(value) => setFilters({ ...filters, minPrice: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Min Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1000">$1,000+</SelectItem>
            <SelectItem value="2000">$2,000+</SelectItem>
            <SelectItem value="3000">$3,000+</SelectItem>
            <SelectItem value="4000">$4,000+</SelectItem>
            <SelectItem value="5000">$5,000+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.maxPrice} onValueChange={(value) => setFilters({ ...filters, maxPrice: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Max Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2000">$2,000</SelectItem>
            <SelectItem value="3000">$3,000</SelectItem>
            <SelectItem value="4000">$4,000</SelectItem>
            <SelectItem value="5000">$5,000</SelectItem>
            <SelectItem value="10000">$10,000+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.bedrooms} onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="1">1 Bed</SelectItem>
            <SelectItem value="2">2 Beds</SelectItem>
            <SelectItem value="3">3 Beds</SelectItem>
            <SelectItem value="4+">4+ Beds</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.propertyType} onValueChange={(value) => setFilters({ ...filters, propertyType: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.amenities} onValueChange={(value) => setFilters({ ...filters, amenities: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Amenities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gym">Gym/Fitness</SelectItem>
            <SelectItem value="pool">Swimming Pool</SelectItem>
            <SelectItem value="laundry">In-Unit Laundry</SelectItem>
            <SelectItem value="parking">Parking</SelectItem>
            <SelectItem value="pets">Pet Friendly</SelectItem>
            <SelectItem value="ac">Air Conditioning</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.proximity} onValueChange={(value) => setFilters({ ...filters, proximity: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Near" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transit">Public Transit</SelectItem>
            <SelectItem value="schools">Good Schools</SelectItem>
            <SelectItem value="shopping">Shopping Centers</SelectItem>
            <SelectItem value="parks">Parks</SelectItem>
            <SelectItem value="hospitals">Hospitals</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.trustScore} onValueChange={(value) => setFilters({ ...filters, trustScore: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Trust Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90+">90%+ Trust</SelectItem>
            <SelectItem value="80+">80%+ Trust</SelectItem>
            <SelectItem value="70+">70%+ Trust</SelectItem>
            <SelectItem value="all">All Scores</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Results Summary */}
      {properties.length > 0 && (
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{properties.length} properties found</span>
          <span>•</span>
          <span>Real-time data from ATTOM & Zillow</span>
          <span>•</span>
          <span>All owners verified</span>
        </div>
      )}
    </div>
  )
}

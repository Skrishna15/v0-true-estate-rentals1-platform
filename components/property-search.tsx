"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, MapPin, DollarSign, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertySearchProps {
  onResults: (results: any[]) => void
}

export function PropertySearch({ onResults }: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    propertyType: "any",
    state: "any",
  })
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append("address", searchQuery)

      if (filters.minPrice) params.append("minPrice", filters.minPrice)
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)
      if (filters.propertyType !== "any") params.append("propertyType", filters.propertyType)
      if (filters.state !== "any") params.append("state", filters.state)

      const response = await fetch(`/api/properties?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        onResults(data.properties)
      } else {
        console.error("Search failed:", data.error)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      propertyType: "any",
      state: "any",
    })
  }

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "").length

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by address, city, state, or ZIP code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="h-12 px-4">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && <Badge className="ml-2 bg-blue-600 text-white">{activeFiltersCount}</Badge>}
        </Button>
        <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="h-12 px-6">
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  <Home className="w-4 h-4 inline mr-1" />
                  Property Type
                </label>
                <Select
                  value={filters.propertyType}
                  onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any type</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  State
                </label>
                <Select value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any state</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" onClick={clearFilters} disabled={activeFiltersCount === 0}>
                Clear Filters
              </Button>
              <Button onClick={handleSearch} disabled={isSearching}>
                Apply Filters & Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Search Suggestions */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Quick searches:</span>
        {["New York", "California", "Texas", "Florida", "Seattle", "Los Angeles", "Miami"].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery(suggestion)
              setTimeout(handleSearch, 100)
            }}
            className="text-xs"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}

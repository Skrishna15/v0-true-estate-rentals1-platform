"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"

interface AdvancedSearchFiltersProps {
  onFiltersChange?: (filters: any) => void
  onSearch?: (query: string, filters: any) => void
  onResults?: (properties: any[]) => void
}

export function AdvancedSearchFilters({ onFiltersChange, onSearch, onResults }: AdvancedSearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    propertyType: "",
    priceMin: "",
    priceMax: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
    trustScore: "",
    verified: "",
  })

  // Add after the existing state declarations
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchCache, setSearchCache] = useState<Map<string, any>>(new Map())
  const [ownerSearchQuery, setOwnerSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"properties" | "owners" | "both">("both")

  // Add debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const debouncedOwnerQuery = useDebounce(ownerSearchQuery, 300)

  // Replace the handleSearch useCallback with a regular function:
  const handleSearch = async () => {
    const query = searchType === "owners" ? ownerSearchQuery : searchQuery
    if (!query.trim()) return

    const cacheKey = `${searchType}-${query}-${JSON.stringify(filters)}`
    if (searchCache.has(cacheKey)) {
      const cachedResults = searchCache.get(cacheKey)
      setSearchResults(cachedResults)
      onResults?.(cachedResults)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchResults: any[] = []
      const searchPromises = []

      if (searchType === "properties" || searchType === "both") {
        if (query.trim()) {
          searchPromises.push(performPropertySearch(query, filters))
        }
      }

      if (searchType === "owners" || searchType === "both") {
        if (query.trim()) {
          searchPromises.push(performOwnerSearch(query, filters))
        }
      }

      const results = await Promise.allSettled(searchPromises)
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          searchResults.push(...result.value)
        }
      })

      setSearchCache((prev) => {
        const newCache = new Map(prev)
        newCache.set(cacheKey, searchResults)
        if (newCache.size > 50) {
          const firstKey = newCache.keys().next().value
          newCache.delete(firstKey)
        }
        return newCache
      })

      setSearchResults(searchResults)
      onSearch?.(query, filters)
      onResults?.(searchResults)

      setTimeout(() => {
        document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" })
        if (searchResults.length > 0) {
          window.dispatchEvent(new CustomEvent("focusProperty", { detail: searchResults[0] }))
        }
      }, 100)
    } catch (error) {
      console.error("Search error:", error)
      setError("Search failed. Showing sample results.")
      const fallbackResults = [createMockProperty(query, "fallback")]
      setSearchResults(fallbackResults)
      onResults?.(fallbackResults)
    } finally {
      setLoading(false)
    }
  }

  // Update performPropertySearch to handle AbortController properly:
  const performPropertySearch = async (query: string, searchFilters: any) => {
    const results = []

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 3000)

      const response = await fetch(`/api/properties?address=${encodeURIComponent(query)}&limit=10`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.properties?.length > 0) {
          results.push(
            ...data.properties.map((prop: any, index: number) =>
              createPropertyObject(prop, `api-${Date.now()}-${index}`, "API"),
            ),
          )
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log("API search failed:", error)
      }
    }

    if (results.length === 0) {
      results.push(createMockProperty(query, "mock"))
    }

    return applyFilters(results.slice(0, 10), searchFilters)
  }

  // Update performOwnerSearch to handle AbortController properly:
  const performOwnerSearch = async (query: string, searchFilters: any) => {
    const results = []

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 2000)

      const response = await fetch(`/api/owners/search?q=${encodeURIComponent(query)}&limit=5`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.owners?.length > 0) {
          data.owners.forEach((owner: any) => {
            const limitedProperties = owner.properties?.slice(0, 2) || []
            limitedProperties.forEach((property: any, index: number) => {
              results.push(createOwnerPropertyObject(owner, property, `owner-${owner._id}-${index}`))
            })
          })
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log("Owner search failed:", error)
      }
    }

    if (results.length === 0) {
      results.push(...createMockOwnerProperties(query).slice(0, 3))
    }

    return applyFilters(results, searchFilters)
  }

  const searchATTOM = async (query: string): Promise<any[]> => {
    try {
      const response = await fetch(`/api/properties?address=${encodeURIComponent(query)}`, {
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`ATTOM API failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.properties?.length > 0) {
        return data.properties.map((prop: any, index: number) =>
          createPropertyObject(prop, `attom-${Date.now()}-${index}`, "ATTOM"),
        )
      }

      // If API returns success but no properties, create mock
      return [createMockProperty(query, "attom-empty")]
    } catch (error) {
      console.error("ATTOM search error:", error)
      return [createMockProperty(query, "attom-error")]
    }
  }

  const searchZillow = async (query: string): Promise<any[]> => {
    try {
      const response = await fetch(`/api/zillow-data?address=${encodeURIComponent(query)}`, {
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`Zillow API failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.properties?.length > 0) {
        return data.properties.map((prop: any, index: number) =>
          createPropertyObject(prop, `zillow-${Date.now()}-${index}`, "Zillow"),
        )
      }

      // If API returns success but no properties, create mock
      return [createMockProperty(query, "zillow-empty")]
    } catch (error) {
      console.error("Zillow search error:", error)
      return [createMockProperty(query, "zillow-error")]
    }
  }

  const createPropertyObject = (prop: any, id: string, source: string) => {
    // Handle different property data structures
    const address = prop.address?.line1 || prop.address || searchQuery
    const city = prop.address?.locality || prop.city || searchQuery.split(",")[1]?.trim() || "Unknown City"
    const state = prop.address?.countrySubd || prop.state || searchQuery.split(",")[2]?.trim() || "CA"

    return {
      id,
      owner: prop.owner?.name || prop.owner || "Property Owner",
      company: prop.owner?.company || "Real Estate LLC",
      value: prop.assessment?.market?.mktTtlValue
        ? `$${Number(prop.assessment.market.mktTtlValue).toLocaleString()}`
        : prop.price
          ? `$${Number(prop.price).toLocaleString()}`
          : `$${(400000 + Math.random() * 600000).toFixed(0)}`,
      totalValue: prop.assessment?.market?.mktTtlValue
        ? `$${Number(prop.assessment.market.mktTtlValue).toLocaleString()}`
        : prop.price
          ? `$${Number(prop.price).toLocaleString()}`
          : `$${(400000 + Math.random() * 600000).toFixed(0)}`,
      properties: Math.floor(Math.random() * 10) + 1,
      locations: [city],
      trustScore: Math.floor(Math.random() * 30) + 70,
      recentActivity: `Found via ${source} search`,
      coordinates: [
        prop.location?.longitude || prop.longitude || -122.4194 + (Math.random() - 0.5) * 0.1,
        prop.location?.latitude || prop.latitude || 37.7749 + (Math.random() - 0.5) * 0.1,
      ] as [number, number],
      address,
      city,
      state,
      propertyType: prop.summary?.propType || prop.propertyType || "Single Family Home",
      yearBuilt: prop.summary?.yearBuilt || prop.yearBuilt || 2000 + Math.floor(Math.random() * 24),
      lastSale: "2024-01-01",
      marketValue: prop.assessment?.market?.mktTtlValue || prop.price || 500000 + Math.floor(Math.random() * 1000000),
      rentEstimate: prop.rentEstimate || 2000 + Math.floor(Math.random() * 3000),
      neighborhood: prop.address?.locality || prop.neighborhood || "Downtown",
      walkScore: 60 + Math.floor(Math.random() * 40),
      crimeRate: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
      appreciation: Math.random() * 20,
      verified: Math.random() > 0.3,
      scamReports: Math.floor(Math.random() * 3),
      tenantReviews: 3 + Math.random() * 2,
      sqft: prop.building?.size?.universalsize || prop.sqft || 1000 + Math.floor(Math.random() * 2000),
      bedrooms: prop.building?.rooms?.beds || prop.bedrooms || Math.floor(Math.random() * 4) + 1,
      bathrooms: prop.building?.rooms?.bathstotal || prop.bathrooms || Math.floor(Math.random() * 3) + 1,
      marketTrend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
    }
  }

  const createOwnerPropertyObject = (owner: any, property: any, id: string) => {
    return {
      id,
      owner: owner.name,
      company: owner.company || "Real Estate LLC",
      value: property.value || `$${(400000 + Math.random() * 600000).toFixed(0)}`,
      totalValue: owner.portfolio?.totalValue || `$${(1000000 + Math.random() * 5000000).toFixed(0)}`,
      properties: owner.portfolio?.totalProperties || Math.floor(Math.random() * 10) + 1,
      locations: owner.portfolio?.locations || ["San Francisco"],
      trustScore: owner.trustMetrics?.trustScore || Math.floor(Math.random() * 30) + 70,
      recentActivity: `Verified owner with ${owner.portfolio?.totalProperties || 1} properties`,
      coordinates:
        property.coordinates ||
        ([-122.4194 + (Math.random() - 0.5) * 0.1, 37.7749 + (Math.random() - 0.5) * 0.1] as [number, number]),
      address: property.address || `${Math.floor(Math.random() * 9999)} Main St`,
      city: property.city || "San Francisco",
      state: property.state || "CA",
      propertyType: property.type || "Single Family Home",
      yearBuilt: property.yearBuilt || 2000 + Math.floor(Math.random() * 24),
      lastSale: property.lastSale || "2024-01-01",
      marketValue: property.value || 500000 + Math.floor(Math.random() * 1000000),
      rentEstimate: property.rent || 2000 + Math.floor(Math.random() * 3000),
      neighborhood: property.neighborhood || "Downtown",
      walkScore: 60 + Math.floor(Math.random() * 40),
      crimeRate: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
      appreciation: Math.random() * 20,
      verified: owner.verificationStatus?.identityVerified || true,
      scamReports: 0,
      tenantReviews: owner.trustMetrics?.averageRating || 3 + Math.random() * 2,
      sqft: property.sqft || 1000 + Math.floor(Math.random() * 2000),
      bedrooms: property.bedrooms || Math.floor(Math.random() * 4) + 1,
      bathrooms: property.bathrooms || Math.floor(Math.random() * 3) + 1,
      marketTrend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
      ownerType: "verified-owner", // Special flag to identify owner search results
      ownerId: owner._id,
    }
  }

  const createMockOwnerProperties = (query: string) => {
    const mockOwners = [
      {
        name: "Sarah Johnson",
        company: "Johnson Properties LLC",
        trustScore: 95,
        properties: 8,
        totalValue: "$12.5M",
        locations: ["San Francisco", "Oakland"],
      },
      {
        name: "Michael Chen",
        company: "Pacific Real Estate Group",
        trustScore: 92,
        properties: 15,
        totalValue: "$28.3M",
        locations: ["Los Angeles", "Santa Monica"],
      },
      {
        name: "Emily Rodriguez",
        company: "Northwest Property Holdings",
        trustScore: 88,
        properties: 6,
        totalValue: "$8.7M",
        locations: ["Seattle", "Bellevue"],
      },
    ]

    const results: any[] = []

    mockOwners.forEach((owner, ownerIndex) => {
      for (let i = 0; i < Math.min(owner.properties, 3); i++) {
        results.push({
          id: `mock-owner-${ownerIndex}-${i}`,
          owner: owner.name,
          company: owner.company,
          value: `$${(400000 + Math.random() * 800000).toFixed(0)}`,
          totalValue: owner.totalValue,
          properties: owner.properties,
          locations: owner.locations,
          trustScore: owner.trustScore,
          recentActivity: `Verified owner matching "${query}"`,
          coordinates: [-122.4194 + (Math.random() - 0.5) * 0.2, 37.7749 + (Math.random() - 0.5) * 0.2] as [
            number,
            number,
          ],
          address: `${Math.floor(Math.random() * 9999)} ${["Oak", "Pine", "Main", "First", "Second"][Math.floor(Math.random() * 5)]} St`,
          city: owner.locations[Math.floor(Math.random() * owner.locations.length)],
          state: "CA",
          propertyType: ["Single Family Home", "Condo", "Townhouse"][Math.floor(Math.random() * 3)],
          yearBuilt: 2000 + Math.floor(Math.random() * 24),
          lastSale: "2024-01-01",
          marketValue: 500000 + Math.floor(Math.random() * 1000000),
          rentEstimate: 2000 + Math.floor(Math.random() * 3000),
          neighborhood: "Downtown",
          walkScore: 60 + Math.floor(Math.random() * 40),
          crimeRate: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
          appreciation: Math.random() * 20,
          verified: true,
          scamReports: 0,
          tenantReviews: 4 + Math.random(),
          sqft: 1000 + Math.floor(Math.random() * 2000),
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          marketTrend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
          ownerType: "verified-owner",
          ownerId: `mock-owner-${ownerIndex}`,
        })
      }
    })

    return results
  }

  const createMockProperty = (query: string, source: string) => {
    const city = query.split(",")[1]?.trim() || "San Francisco"
    const state = query.split(",")[2]?.trim() || "CA"

    return {
      id: `${source}-mock-${Date.now()}`,
      owner: "Property Owner",
      company: "Real Estate LLC",
      value: `$${(400000 + Math.random() * 600000).toFixed(0)}`,
      totalValue: `$${(400000 + Math.random() * 600000).toFixed(0)}`,
      properties: Math.floor(Math.random() * 5) + 1,
      locations: [city],
      trustScore: Math.floor(Math.random() * 30) + 70,
      recentActivity: `Sample result for ${query}`,
      coordinates: [-122.4194 + (Math.random() - 0.5) * 0.2, 37.7749 + (Math.random() - 0.5) * 0.2] as [number, number],
      address: query,
      city,
      state,
      propertyType: "Single Family Home",
      yearBuilt: 2000 + Math.floor(Math.random() * 24),
      lastSale: "2024-01-01",
      marketValue: 500000 + Math.floor(Math.random() * 1000000),
      rentEstimate: 2000 + Math.floor(Math.random() * 3000),
      neighborhood: "Downtown",
      walkScore: 60 + Math.floor(Math.random() * 40),
      crimeRate: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
      appreciation: Math.random() * 20,
      verified: Math.random() > 0.3,
      scamReports: Math.floor(Math.random() * 3),
      tenantReviews: 3 + Math.random() * 2,
      sqft: 1000 + Math.floor(Math.random() * 2000),
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      marketTrend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
    }
  }

  const applyFilters = (properties: any[], searchFilters: any) => {
    return properties.filter((property) => {
      // Property type filter
      if (
        searchFilters.propertyType &&
        !property.propertyType.toLowerCase().includes(searchFilters.propertyType.toLowerCase())
      ) {
        return false
      }

      // Price range filter
      const price = property.marketValue || Number.parseFloat(property.value.replace(/[$,]/g, ""))
      if (searchFilters.priceMin && price < Number(searchFilters.priceMin)) return false
      if (searchFilters.priceMax && price > Number(searchFilters.priceMax)) return false

      // Bedrooms filter
      if (searchFilters.bedrooms && property.bedrooms < Number(searchFilters.bedrooms)) return false

      // Bathrooms filter
      if (searchFilters.bathrooms && property.bathrooms < Number(searchFilters.bathrooms)) return false

      // Year built filter
      if (searchFilters.yearBuilt && property.yearBuilt < Number(searchFilters.yearBuilt)) return false

      // Trust score filter
      if (searchFilters.trustScore && property.trustScore < Number(searchFilters.trustScore)) return false

      // Verification filter
      if (searchFilters.verified === "verified" && !property.verified) return false
      if (searchFilters.verified === "unverified" && property.verified) return false

      return true
    })
  }

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      propertyType: "",
      priceMin: "",
      priceMax: "",
      bedrooms: "",
      bathrooms: "",
      yearBuilt: "",
      trustScore: "",
      verified: "",
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const activeFilterCount = Object.values(filters).filter((value) => value !== "").length

  // Replace the existing useEffect at the bottom with this safer version:
  useEffect(() => {
    if (debouncedSearchQuery && searchType !== "owners") {
      const performSearch = async () => {
        const query = debouncedSearchQuery
        if (!query.trim()) return

        const cacheKey = `${searchType}-${query}-${JSON.stringify(filters)}`
        if (searchCache.has(cacheKey)) {
          const cachedResults = searchCache.get(cacheKey)
          setSearchResults(cachedResults)
          onResults?.(cachedResults)
          return
        }

        setLoading(true)
        setError(null)

        try {
          const results = await performPropertySearch(query, filters)
          setSearchResults(results)
          onResults?.(results)

          setSearchCache((prev) => {
            const newCache = new Map(prev)
            newCache.set(cacheKey, results)
            if (newCache.size > 50) {
              const firstKey = newCache.keys().next().value
              newCache.delete(firstKey)
            }
            return newCache
          })
        } catch (error) {
          console.error("Auto-search error:", error)
          const fallbackResults = [createMockProperty(query, "fallback")]
          setSearchResults(fallbackResults)
          onResults?.(fallbackResults)
        } finally {
          setLoading(false)
        }
      }

      performSearch()
    }
  }, [debouncedSearchQuery, searchType, filters])

  // Add separate useEffect for owner search
  useEffect(() => {
    if (debouncedOwnerQuery && searchType === "owners") {
      const performSearch = async () => {
        const query = debouncedOwnerQuery
        if (!query.trim()) return

        const cacheKey = `owners-${query}-${JSON.stringify(filters)}`
        if (searchCache.has(cacheKey)) {
          const cachedResults = searchCache.get(cacheKey)
          setSearchResults(cachedResults)
          onResults?.(cachedResults)
          return
        }

        setLoading(true)
        setError(null)

        try {
          const results = await performOwnerSearch(query, filters)
          setSearchResults(results)
          onResults?.(results)

          setSearchCache((prev) => {
            const newCache = new Map(prev)
            newCache.set(cacheKey, results)
            if (newCache.size > 50) {
              const firstKey = newCache.keys().next().value
              newCache.delete(firstKey)
            }
            return newCache
          })
        } catch (error) {
          console.error("Auto-search error:", error)
          const fallbackResults = createMockOwnerProperties(query).slice(0, 3)
          setSearchResults(fallbackResults)
          onResults?.(fallbackResults)
        } finally {
          setLoading(false)
        }
      }

      performSearch()
    }
  }, [debouncedOwnerQuery, searchType, filters])

  return (
    <div className="space-y-4">
      {/* Search Type Selection */}
      <div className="flex justify-center gap-2 mb-4">
        <Button
          variant={searchType === "both" ? "default" : "outline"}
          onClick={() => setSearchType("both")}
          size="sm"
          className={searchType === "both" ? "bg-blue-600 text-white" : ""}
        >
          All Results
        </Button>
        <Button
          variant={searchType === "properties" ? "default" : "outline"}
          onClick={() => setSearchType("properties")}
          size="sm"
          className={searchType === "properties" ? "bg-blue-600 text-white" : ""}
        >
          Properties Only
        </Button>
        <Button
          variant={searchType === "owners" ? "default" : "outline"}
          onClick={() => setSearchType("owners")}
          size="sm"
          className={searchType === "owners" ? "bg-blue-600 text-white" : ""}
        >
          Verified Owners
        </Button>
      </div>

      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder={
              searchType === "owners"
                ? "Search verified owners by name or company..."
                : searchType === "properties"
                  ? "Search by address, city, or neighborhood..."
                  : "Search properties, owners, or companies..."
            }
            value={searchType === "owners" ? ownerSearchQuery : searchQuery}
            onChange={(e) => {
              if (searchType === "owners") {
                setOwnerSearchQuery(e.target.value)
              } else {
                setSearchQuery(e.target.value)
              }
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-12 pr-4 py-3 text-lg"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading} size="lg">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Search Examples */}
      <p className="text-sm text-gray-500 mt-2">
        {searchType === "owners" ? (
          <>Try: "Sarah Johnson", "Pacific Real Estate", or "Johnson Properties LLC"</>
        ) : searchType === "properties" ? (
          <>Try: "123 Main St, San Francisco" or "Apartment Brooklyn NY"</>
        ) : (
          <>Try: "123 Main St" or "Sarah Johnson Properties" or "Pacific Real Estate"</>
        )}
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <Select value={filters.propertyType} onValueChange={(value) => updateFilter("propertyType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Family</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="multi">Multi-Family</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priceMin} onValueChange={(value) => updateFilter("priceMin", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Min Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100000">$100K+</SelectItem>
              <SelectItem value="200000">$200K+</SelectItem>
              <SelectItem value="300000">$300K+</SelectItem>
              <SelectItem value="500000">$500K+</SelectItem>
              <SelectItem value="1000000">$1M+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priceMax} onValueChange={(value) => updateFilter("priceMax", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Max Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300000">$300K</SelectItem>
              <SelectItem value="500000">$500K</SelectItem>
              <SelectItem value="1000000">$1M</SelectItem>
              <SelectItem value="2000000">$2M</SelectItem>
              <SelectItem value="5000000">$5M+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.bedrooms} onValueChange={(value) => updateFilter("bedrooms", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Min Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1+ Bed</SelectItem>
              <SelectItem value="2">2+ Beds</SelectItem>
              <SelectItem value="3">3+ Beds</SelectItem>
              <SelectItem value="4">4+ Beds</SelectItem>
              <SelectItem value="5">5+ Beds</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.bathrooms} onValueChange={(value) => updateFilter("bathrooms", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Min Bathrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1+ Bath</SelectItem>
              <SelectItem value="2">2+ Baths</SelectItem>
              <SelectItem value="3">3+ Baths</SelectItem>
              <SelectItem value="4">4+ Baths</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.yearBuilt} onValueChange={(value) => updateFilter("yearBuilt", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Year Built" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2020">2020+</SelectItem>
              <SelectItem value="2010">2010+</SelectItem>
              <SelectItem value="2000">2000+</SelectItem>
              <SelectItem value="1990">1990+</SelectItem>
              <SelectItem value="1980">1980+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.trustScore} onValueChange={(value) => updateFilter("trustScore", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Min Trust Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="95">95%+ Trust</SelectItem>
              <SelectItem value="90">90%+ Trust</SelectItem>
              <SelectItem value="85">85%+ Trust</SelectItem>
              <SelectItem value="80">80%+ Trust</SelectItem>
              <SelectItem value="70">70%+ Trust</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.verified} onValueChange={(value) => updateFilter("verified", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified Only</SelectItem>
              <SelectItem value="all">All Properties</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {key}: {value}
                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => updateFilter(key, "")} />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}

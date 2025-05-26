"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, MapPin, Building, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Property {
  id: string
  address: string
  city: string
  state: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  type: string
  rating: number
  verified: boolean
  image: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  const mockProperties: Property[] = [
    {
      id: "1",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      price: 3500,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      type: "Apartment",
      rating: 4.5,
      verified: true,
      image: "/placeholder.svg?height=200&width=300&query=modern apartment",
    },
    {
      id: "2",
      address: "456 Oak Ave",
      city: "San Francisco",
      state: "CA",
      price: 4200,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1500,
      type: "House",
      rating: 4.8,
      verified: true,
      image: "/placeholder.svg?height=200&width=300&query=house exterior",
    },
    {
      id: "3",
      address: "789 Pine St",
      city: "San Francisco",
      state: "CA",
      price: 2800,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 800,
      type: "Studio",
      rating: 4.2,
      verified: false,
      image: "/placeholder.svg?height=200&width=300&query=studio apartment",
    },
  ]

  useEffect(() => {
    if (query) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setProperties(
          mockProperties.filter(
            (p) =>
              p.address.toLowerCase().includes(query.toLowerCase()) ||
              p.city.toLowerCase().includes(query.toLowerCase()),
          ),
        )
        setLoading(false)
      }, 500)
    }
  }, [query])

  const handleSearch = () => {
    if (query.trim()) {
      setLoading(true)
      setTimeout(() => {
        setProperties(mockProperties)
        setLoading(false)
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Properties</h1>

          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by address, city, or owner name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 pr-4 py-3"
              />
            </div>
            <Button onClick={handleSearch} className="px-6">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
            <Button variant="outline" className="px-6">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.address}
                    className="w-full h-48 object-cover"
                  />
                  {property.verified && <Badge className="absolute top-2 right-2 bg-green-600">Verified</Badge>}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{property.address}</CardTitle>
                  <CardDescription>
                    {property.city}, {property.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">${property.price}/mo</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{property.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    <span>{property.bedrooms} bed</span>
                    <span>{property.bathrooms} bath</span>
                    <span>{property.sqft} sqft</span>
                  </div>
                  <Button className="w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start your search</h3>
            <p className="text-gray-600">Enter an address, city, or owner name to find properties</p>
          </div>
        )}
      </div>
    </div>
  )
}

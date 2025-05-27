"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Shield, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Property {
  id: string
  title: string
  owner: string
  address: string
  city: string
  state: string
  price: string
  bedrooms: number
  bathrooms: number
  sqft: string
  trustScore: number
  image: string
  type: string
}

const allProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    owner: "Sarah Johnson",
    address: "123 Market St",
    city: "San Francisco",
    state: "CA",
    price: "$3,200/month",
    bedrooms: 2,
    bathrooms: 2,
    sqft: "1,200",
    trustScore: 95,
    image: "/placeholder.svg?height=200&width=300&query=modern apartment",
    type: "Apartment",
  },
  {
    id: "2",
    title: "Cozy Family House",
    owner: "Michael Chen",
    address: "456 Oak Avenue",
    city: "Austin",
    state: "TX",
    price: "$2,800/month",
    bedrooms: 3,
    bathrooms: 2,
    sqft: "1,800",
    trustScore: 92,
    image: "/placeholder.svg?height=200&width=300&query=family house",
    type: "House",
  },
  {
    id: "3",
    title: "Luxury Condo",
    owner: "Maria Garcia",
    address: "789 Ocean Drive",
    city: "Miami",
    state: "FL",
    price: "$4,500/month",
    bedrooms: 2,
    bathrooms: 3,
    sqft: "1,500",
    trustScore: 98,
    image: "/placeholder.svg?height=200&width=300&query=luxury condo",
    type: "Condo",
  },
  {
    id: "4",
    title: "Urban Loft",
    owner: "David Kim",
    address: "321 Broadway",
    city: "New York",
    state: "NY",
    price: "$3,800/month",
    bedrooms: 1,
    bathrooms: 1,
    sqft: "900",
    trustScore: 89,
    image: "/placeholder.svg?height=200&width=300&query=urban loft",
    type: "Loft",
  },
  {
    id: "5",
    title: "Suburban Villa",
    owner: "Jennifer Martinez",
    address: "654 Pine Street",
    city: "Seattle",
    state: "WA",
    price: "$3,500/month",
    bedrooms: 4,
    bathrooms: 3,
    sqft: "2,200",
    trustScore: 94,
    image: "/placeholder.svg?height=200&width=300&query=suburban villa",
    type: "House",
  },
  {
    id: "6",
    title: "Downtown Studio",
    owner: "Robert Wilson",
    address: "987 Main Street",
    city: "Chicago",
    state: "IL",
    price: "$1,800/month",
    bedrooms: 0,
    bathrooms: 1,
    sqft: "600",
    trustScore: 87,
    image: "/placeholder.svg?height=200&width=300&query=downtown studio",
    type: "Studio",
  },
  {
    id: "7",
    title: "Beachfront Condo",
    owner: "Lisa Chen",
    address: "456 Beach Boulevard",
    city: "San Diego",
    state: "CA",
    price: "$4,200/month",
    bedrooms: 2,
    bathrooms: 2,
    sqft: "1,400",
    trustScore: 96,
    image: "/placeholder.svg?height=200&width=300&query=beachfront condo",
    type: "Condo",
  },
  {
    id: "8",
    title: "Historic Townhouse",
    owner: "James Thompson",
    address: "123 Heritage Lane",
    city: "Boston",
    state: "MA",
    price: "$3,600/month",
    bedrooms: 3,
    bathrooms: 2,
    sqft: "1,600",
    trustScore: 91,
    image: "/placeholder.svg?height=200&width=300&query=historic townhouse",
    type: "Townhouse",
  },
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(allProperties)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("price")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    let filtered = allProperties

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.owner.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by type
    if (filterBy !== "all") {
      filtered = filtered.filter((property) => property.type.toLowerCase() === filterBy.toLowerCase())
    }

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return Number.parseInt(a.price.replace(/[^0-9]/g, "")) - Number.parseInt(b.price.replace(/[^0-9]/g, ""))
        case "trustScore":
          return b.trustScore - a.trustScore
        case "bedrooms":
          return b.bedrooms - a.bedrooms
        default:
          return 0
      }
    })

    setProperties(filtered)
  }, [searchQuery, sortBy, filterBy])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Properties</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search properties, locations, or owners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="loft">Loft</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="trustScore">Trust Score</SelectItem>
                <SelectItem value="bedrooms">Bedrooms</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {properties.length} of {allProperties.length} properties
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      <div className="container mx-auto px-4 py-8">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {properties.map((property) => (
              <Card
                key={property.id}
                className={`overflow-hidden hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex" : ""}`}
              >
                <div className={viewMode === "list" ? "w-48 flex-shrink-0" : "relative"}>
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className={`object-cover ${viewMode === "list" ? "w-full h-full" : "w-full h-48"}`}
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    <Shield className="w-3 h-3 mr-1" />
                    {property.trustScore}%
                  </Badge>
                </div>

                <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{property.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.address}, {property.city}, {property.state}
                  </div>

                  <div className="text-sm text-gray-600 mb-3">Owner: {property.owner}</div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{property.bedrooms} bed</span>
                    <span>{property.bathrooms} bath</span>
                    <span>{property.sqft} sqft</span>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/property/${property.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

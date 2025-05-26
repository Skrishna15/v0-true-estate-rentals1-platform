import { Search, MapPin, Shield, FileText, Star, Building } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const properties = [
  {
    id: 1,
    address: "123 Oak Street, San Francisco, CA",
    price: "$4,500/month",
    owner: "Sarah Johnson",
    trustScore: 95,
    verified: true,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    address: "456 Pine Avenue, Los Angeles, CA",
    price: "$3,200/month",
    owner: "Michael Chen",
    trustScore: 88,
    verified: true,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.6,
    reviews: 18,
  },
  {
    id: 3,
    address: "789 Maple Drive, Seattle, WA",
    price: "$2,800/month",
    owner: "Emily Rodriguez",
    trustScore: 92,
    verified: true,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 1,
    bathrooms: 1,
    rating: 4.9,
    reviews: 31,
  },
  {
    id: 4,
    address: "321 Cedar Lane, Portland, OR",
    price: "$2,400/month",
    owner: "David Kim",
    trustScore: 85,
    verified: true,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 2,
    bathrooms: 1,
    rating: 4.5,
    reviews: 12,
  },
  {
    id: 5,
    address: "654 Birch Street, Denver, CO",
    price: "$2,100/month",
    owner: "Jessica Brown",
    trustScore: 90,
    verified: true,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.7,
    reviews: 22,
  },
  {
    id: 6,
    address: "987 Willow Avenue, Austin, TX",
    price: "$1,900/month",
    owner: "Robert Wilson",
    trustScore: 87,
    verified: true,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.4,
    reviews: 15,
  },
]

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">TrueEstate</h1>
                <p className="text-xs text-gray-600">Clarity before Capital</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/wealth-map" className="text-gray-600 hover:text-blue-600">
                Wealth Map
              </Link>
              <Link href="/properties" className="font-semibold text-blue-600">
                Property Search
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Verified Properties</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Search by address, city, or neighborhood..." className="pl-12 pr-4 py-3" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2000">$0 - $2,000</SelectItem>
                  <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                  <SelectItem value="3000-4000">$3,000 - $4,000</SelectItem>
                  <SelectItem value="4000+">$4,000+</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bed</SelectItem>
                  <SelectItem value="2">2 Beds</SelectItem>
                  <SelectItem value="3">3 Beds</SelectItem>
                  <SelectItem value="4+">4+ Beds</SelectItem>
                </SelectContent>
              </Select>

              <Select>
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

              <Button>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{properties.length} properties found</span>
            <span>•</span>
            <span>All properties verified</span>
            <span>•</span>
            <span>Average trust score: 89%</span>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link key={property.id} href={`/property/${property.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.address}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {/* Trust Score Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`${property.trustScore >= 90 ? "bg-green-500" : property.trustScore >= 80 ? "bg-yellow-500" : "bg-red-500"} text-white`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {property.trustScore}% Trust
                    </Badge>
                  </div>
                  {property.verified && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-500 text-white">
                        <FileText className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{property.price}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {property.rating} ({property.reviews})
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{property.address}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {property.owner
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">Owner: {property.owner}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Properties
          </Button>
        </div>
      </div>
    </div>
  )
}

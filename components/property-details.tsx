"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Heart,
  Share2,
  Download,
  MapPin,
  Calendar,
  Home,
  User,
  TrendingUp,
  Shield,
  FileText,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Bell,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

interface PropertyDetailsProps {
  propertyId: string
  onBack: () => void
}

interface TransactionHistory {
  date: string
  price: number
  type: "sale" | "refinance" | "listing"
  buyer?: string
  seller?: string
}

interface OwnershipHistory {
  owner: string
  startDate: string
  endDate?: string
  acquisitionPrice?: number
  ownerType: "individual" | "entity"
  trustScore: number
}

const mockPropertyDetails = {
  id: "1",
  address: "123 Market Street",
  city: "San Francisco",
  state: "CA",
  zipCode: "94102",
  coordinates: [37.7749, -122.4194],
  currentValue: 2500000,
  lastSalePrice: 2300000,
  lastSaleDate: "2023-06-15",
  size: 2200,
  lotSize: 0.15,
  bedrooms: 3,
  bathrooms: 2,
  propertyType: "Condo",
  yearBuilt: 2018,
  parkingSpaces: 2,
  amenities: ["Gym", "Pool", "Concierge", "Rooftop Deck", "In-unit Laundry"],
  description:
    "Stunning modern condo in the heart of San Francisco with panoramic city views. Features high-end finishes, floor-to-ceiling windows, and access to premium building amenities.",
  images: [
    "/placeholder.svg?height=400&width=600&query=modern+condo+living+room",
    "/placeholder.svg?height=400&width=600&query=modern+kitchen+granite",
    "/placeholder.svg?height=400&width=600&query=bedroom+city+view",
    "/placeholder.svg?height=400&width=600&query=bathroom+marble",
    "/placeholder.svg?height=400&width=600&query=building+exterior",
  ],
  currentOwner: {
    name: "Sarah Johnson",
    type: "individual" as const,
    netWorth: 15000000,
    confidence: 85,
    acquisitionDate: "2023-06-15",
    acquisitionPrice: 2300000,
    trustScore: 92,
    backgroundCheck: true,
    verificationStatus: "verified" as const,
  },
  transactionHistory: [
    {
      date: "2023-06-15",
      price: 2300000,
      type: "sale" as const,
      buyer: "Sarah Johnson",
      seller: "Michael Rodriguez",
    },
    {
      date: "2021-03-20",
      price: 2100000,
      type: "sale" as const,
      buyer: "Michael Rodriguez",
      seller: "Bay Area Development LLC",
    },
    {
      date: "2018-11-10",
      price: 1850000,
      type: "sale" as const,
      buyer: "Bay Area Development LLC",
      seller: "Original Developer",
    },
  ] as TransactionHistory[],
  ownershipHistory: [
    {
      owner: "Sarah Johnson",
      startDate: "2023-06-15",
      acquisitionPrice: 2300000,
      ownerType: "individual" as const,
      trustScore: 92,
    },
    {
      owner: "Michael Rodriguez",
      startDate: "2021-03-20",
      endDate: "2023-06-15",
      acquisitionPrice: 2100000,
      ownerType: "individual" as const,
      trustScore: 88,
    },
    {
      owner: "Bay Area Development LLC",
      startDate: "2018-11-10",
      endDate: "2021-03-20",
      acquisitionPrice: 1850000,
      ownerType: "entity" as const,
      trustScore: 75,
    },
  ] as OwnershipHistory[],
  marketData: {
    pricePerSqFt: 1136,
    marketTrend: "increasing" as const,
    daysOnMarket: 0,
    priceHistory: [
      { date: "2018-11", price: 1850000 },
      { date: "2021-03", price: 2100000 },
      { date: "2023-06", price: 2300000 },
      { date: "2024-01", price: 2500000 },
    ],
    comparableProperties: [
      { address: "456 Mission St", price: 2400000, size: 2100, pricePerSqFt: 1143 },
      { address: "789 Howard St", price: 2600000, size: 2300, pricePerSqFt: 1130 },
      { address: "321 Folsom St", price: 2350000, size: 2150, pricePerSqFt: 1093 },
    ],
  },
  riskFactors: [
    { type: "low", description: "Owner has strong financial background" },
    { type: "medium", description: "Property in earthquake zone" },
    { type: "low", description: "Building is relatively new (2018)" },
  ],
  dataSource: {
    lastUpdated: "2024-01-15",
    sources: ["ATTOM Data", "Zillow", "Public Records", "MLS"],
    confidence: 94,
  },
}

export function PropertyDetails({ propertyId, onBack }: PropertyDetailsProps) {
  const [property] = useState(mockPropertyDetails)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateAppreciation = () => {
    const firstPrice = property.transactionHistory[property.transactionHistory.length - 1].price
    const currentPrice = property.currentValue
    return (((currentPrice - firstPrice) / firstPrice) * 100).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Map
              </Button>
              <div>
                <h1 className="text-xl font-bold">{property.address}</h1>
                <p className="text-gray-600">
                  {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsBookmarked(!isBookmarked)}>
                <Heart className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current text-red-500" : ""}`} />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={property.images[selectedImageIndex] || "/placeholder.svg"}
                    alt={`${property.address} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {selectedImageIndex + 1} / {property.images.length}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                          selectedImageIndex === index ? "border-blue-500" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Information Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="ownership">Ownership</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="market">Market Data</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Basic Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Property Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Property Type</span>
                          <span className="font-medium">{property.propertyType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year Built</span>
                          <span className="font-medium">{property.yearBuilt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Living Area</span>
                          <span className="font-medium">{property.size.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lot Size</span>
                          <span className="font-medium">{property.lotSize} acres</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bedrooms</span>
                          <span className="font-medium">{property.bedrooms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bathrooms</span>
                          <span className="font-medium">{property.bathrooms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Parking</span>
                          <span className="font-medium">{property.parkingSpaces} spaces</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price/sq ft</span>
                          <span className="font-medium">${property.marketData.pricePerSqFt}</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h4 className="font-semibold mb-3">Description</h4>
                      <p className="text-gray-700">{property.description}</p>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h4 className="font-semibold mb-3">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ownership" className="space-y-6">
                {/* Current Owner */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Current Owner
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{property.currentOwner.name}</h3>
                          <Badge className="mt-1">
                            {property.currentOwner.type === "individual" ? "Individual" : "Entity"}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="font-semibold">{property.currentOwner.trustScore}% Trust Score</span>
                          </div>
                          {property.currentOwner.backgroundCheck && (
                            <div className="flex items-center gap-2 mt-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-600">Background Verified</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estimated Net Worth</span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(property.currentOwner.netWorth)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confidence Level</span>
                            <span className="font-medium">{property.currentOwner.confidence}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Acquisition Date</span>
                            <span className="font-medium">{formatDate(property.currentOwner.acquisitionDate)}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Acquisition Price</span>
                            <span className="font-medium">
                              {formatCurrency(property.currentOwner.acquisitionPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Equity</span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(property.currentValue - property.currentOwner.acquisitionPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Verification Status</span>
                            <Badge className="bg-green-500 text-white">Verified</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ownership History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ownership History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {property.ownershipHistory.map((owner, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{owner.owner}</h4>
                              <Badge variant="outline" className="mt-1">
                                {owner.ownerType === "individual" ? "Individual" : "Entity"}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span className="font-medium">{owner.trustScore}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Period</span>
                              <div className="font-medium">
                                {formatDate(owner.startDate)} - {owner.endDate ? formatDate(owner.endDate) : "Present"}
                              </div>
                            </div>
                            {owner.acquisitionPrice && (
                              <div>
                                <span className="text-gray-600">Acquisition Price</span>
                                <div className="font-medium">{formatCurrency(owner.acquisitionPrice)}</div>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-600">Duration</span>
                              <div className="font-medium">
                                {owner.endDate
                                  ? `${Math.round((new Date(owner.endDate).getTime() - new Date(owner.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365 * 100)) / 100} years`
                                  : "Current"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                {/* Transaction History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Transaction History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {property.transactionHistory.map((transaction, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    transaction.type === "sale"
                                      ? "bg-green-500"
                                      : transaction.type === "refinance"
                                        ? "bg-blue-500"
                                        : "bg-yellow-500"
                                  }
                                >
                                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </Badge>
                                <span className="font-semibold">{formatDate(transaction.date)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-lg">{formatCurrency(transaction.price)}</div>
                            </div>
                          </div>
                          {transaction.buyer && transaction.seller && (
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Buyer</span>
                                <div className="font-medium">{transaction.buyer}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Seller</span>
                                <div className="font-medium">{transaction.seller}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="market" className="space-y-6">
                {/* Market Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Market Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Value</span>
                          <span className="font-semibold text-green-600">{formatCurrency(property.currentValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price per sq ft</span>
                          <span className="font-medium">${property.marketData.pricePerSqFt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Appreciation</span>
                          <span className="font-semibold text-green-600">+{calculateAppreciation()}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Market Trend</span>
                          <Badge className="bg-green-500 text-white">
                            {property.marketData.marketTrend === "increasing" ? "Increasing" : "Stable"}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold">Price History</h4>
                        {property.marketData.priceHistory.map((entry, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">{entry.date}</span>
                            <span className="font-medium">{formatCurrency(entry.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comparable Properties */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comparable Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {property.marketData.comparableProperties.map((comp, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{comp.address}</h4>
                              <p className="text-sm text-gray-600">{comp.size.toLocaleString()} sq ft</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatCurrency(comp.price)}</div>
                              <div className="text-sm text-gray-600">${comp.pricePerSqFt}/sq ft</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk" className="space-y-6">
                {/* Risk Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {property.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          {risk.type === "low" ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          ) : risk.type === "medium" ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <Badge
                              className={
                                risk.type === "low"
                                  ? "bg-green-100 text-green-800"
                                  : risk.type === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {risk.type.toUpperCase()} RISK
                            </Badge>
                            <p className="mt-1 text-sm">{risk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Data Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Data Sources & Confidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Overall Confidence</span>
                        <div className="flex items-center gap-2">
                          <Progress value={property.dataSource.confidence} className="w-24" />
                          <span className="font-semibold">{property.dataSource.confidence}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="font-medium">{formatDate(property.dataSource.lastUpdated)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-2">Data Sources</span>
                        <div className="flex flex-wrap gap-2">
                          {property.dataSource.sources.map((source, index) => (
                            <Badge key={index} variant="outline">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(property.currentValue)}</div>
                  <div className="text-sm text-gray-600">Current Value</div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trust Score</span>
                    <Badge className="bg-green-500 text-white">{property.currentOwner.trustScore}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Owner Type</span>
                    <span className="font-medium">
                      {property.currentOwner.type === "individual" ? "Individual" : "Entity"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Sale</span>
                    <span className="font-medium">{formatDate(property.lastSaleDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Appreciation</span>
                    <span className="font-semibold text-green-600">+{calculateAppreciation()}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Compare Properties
                </Button>
                <Button variant="outline" className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Price Alert
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with Team
                </Button>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Interactive Map</p>
                    <p className="text-xs text-gray-400">Click to view on map</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coordinates</span>
                    <span className="font-medium">
                      {property.coordinates[0]}, {property.coordinates[1]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Neighborhood</span>
                    <span className="font-medium">SOMA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Walk Score</span>
                    <span className="font-medium">95/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

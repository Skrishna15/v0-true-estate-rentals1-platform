"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { User, Star, Mail, Phone, MessageCircle, Flag, Shield, Eye, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PropertyDetailsPage() {
  const params = useParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/properties/${params.id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch property: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.property) {
          setProperty(data.property)
        } else {
          // Fallback: create a mock property if API fails
          setProperty({
            id: params.id,
            address: "Property Address",
            city: "City",
            state: "State",
            value: "$500,000",
            propertyType: "Single Family",
            yearBuilt: 2020,
            sqft: 2000,
            bedrooms: 3,
            bathrooms: 2,
            owner: {
              name: "Property Owner",
              email: "owner@example.com",
              phone: "(555) 123-4567",
              company: "Real Estate LLC",
              trustScore: 85,
              verified: true,
              backgroundCheck: true,
              businessVerified: true,
              documentsVerified: true,
              yearsActive: 5,
              portfolio: {
                totalProperties: 10,
                totalValue: "$5M",
                propertyTypes: ["Single Family", "Condo"],
                locations: ["City"],
                averageRent: 2500,
              },
            },
          })
        }
      } catch (err) {
        console.error("Error fetching property:", err)
        setError("Failed to load property details")

        // Create a fallback property
        setProperty({
          id: params.id,
          address: "Property Address",
          city: "City",
          state: "State",
          value: "$500,000",
          propertyType: "Single Family",
          yearBuilt: 2020,
          sqft: 2000,
          bedrooms: 3,
          bathrooms: 2,
          owner: {
            name: "Property Owner",
            email: "owner@example.com",
            phone: "(555) 123-4567",
            company: "Real Estate LLC",
            trustScore: 85,
            verified: true,
            backgroundCheck: true,
            businessVerified: true,
            documentsVerified: true,
            yearsActive: 5,
            portfolio: {
              totalProperties: 10,
              totalValue: "$5M",
              propertyTypes: ["Single Family", "Condo"],
              locations: ["City"],
              averageRent: 2500,
            },
          },
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.address}</h1>
              <p className="text-gray-600">
                {property.city}, {property.state}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Property Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-2xl font-bold text-green-600">{property.value}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Property Type</div>
                    <div className="font-semibold">{property.propertyType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Year Built</div>
                    <div className="font-semibold">{property.yearBuilt}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Square Feet</div>
                    <div className="font-semibold">{property.sqft?.toLocaleString()}</div>
                  </div>
                  {property.bedrooms && (
                    <div>
                      <div className="text-sm text-gray-500">Bedrooms</div>
                      <div className="font-semibold">{property.bedrooms}</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div>
                      <div className="text-sm text-gray-500">Bathrooms</div>
                      <div className="font-semibold">{property.bathrooms}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Images Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Property Images</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Property Owner Information
                  {property.owner?.verified && (
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Owner
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Owner Profile */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {property.owner?.name?.charAt(0) || "O"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{property.owner?.name || "Property Owner"}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{property.owner?.trustScore || 85}% Trust Score</span>
                      </div>
                    </div>
                    {property.owner?.company && <p className="text-gray-600 mb-2">{property.owner.company}</p>}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {property.owner?.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{property.owner.email}</span>
                        </div>
                      )}
                      {property.owner?.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{property.owner.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Trust Metrics */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{property.owner?.trustScore || 85}%</div>
                    <div className="text-sm text-gray-600">Trust Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {property.owner?.portfolio?.totalProperties || 10}
                    </div>
                    <div className="text-sm text-gray-600">Properties Owned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {property.owner?.portfolio?.totalValue || "$5M"}
                    </div>
                    <div className="text-sm text-gray-600">Portfolio Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{property.owner?.yearsActive || 5}</div>
                    <div className="text-sm text-gray-600">Years Active</div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Verification Status</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${property.owner?.verified ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <span className="text-sm">Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          property.owner?.backgroundCheck ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-sm">Background Check</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          property.owner?.businessVerified ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-sm">Business Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          property.owner?.documentsVerified ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-sm">Documents Verified</span>
                    </div>
                  </div>
                </div>

                {/* Portfolio Overview */}
                {property.owner?.portfolio && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Portfolio Overview</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Property Types</div>
                        <div className="flex flex-wrap gap-1">
                          {(property.owner.portfolio.propertyTypes || ["Single Family", "Condo"]).map(
                            (type: string) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Locations</div>
                        <div className="flex flex-wrap gap-1">
                          {(property.owner.portfolio.locations || [property.city]).map((location: string) => (
                            <Badge key={location} variant="outline" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Owner
                  </Button>
                  <Button variant="outline">
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

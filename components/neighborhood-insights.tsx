"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  MapPin,
  School,
  Hospital,
  Train,
  ShoppingCart,
  Coffee,
  Star,
  Clock,
  Navigation,
  Wifi,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NeighborhoodInsightsProps {
  propertyAddress: string
  coordinates: [number, number]
}

interface PlaceData {
  name: string
  rating: number
  distance: string
  walkTime?: string
  type: string
  priceLevel?: number
  isOpen?: boolean
}

const mockNeighborhoodData = {
  walkScore: 95,
  transitScore: 88,
  bikeScore: 82,
  schools: [
    {
      name: "Lincoln Elementary School",
      rating: 4.5,
      distance: "0.3 miles",
      walkTime: "6 min",
      type: "Elementary",
      priceLevel: 0,
    },
    {
      name: "Roosevelt Middle School",
      rating: 4.2,
      distance: "0.7 miles",
      walkTime: "14 min",
      type: "Middle School",
      priceLevel: 0,
    },
    {
      name: "Washington High School",
      rating: 4.0,
      distance: "1.2 miles",
      walkTime: "24 min",
      type: "High School",
      priceLevel: 0,
    },
  ],
  healthcare: [
    {
      name: "UCSF Medical Center",
      rating: 4.3,
      distance: "0.8 miles",
      walkTime: "16 min",
      type: "Hospital",
      priceLevel: 3,
    },
    {
      name: "Mission Bay Urgent Care",
      rating: 4.1,
      distance: "0.4 miles",
      walkTime: "8 min",
      type: "Urgent Care",
      priceLevel: 2,
    },
    {
      name: "CVS Pharmacy",
      rating: 3.8,
      distance: "0.2 miles",
      walkTime: "4 min",
      type: "Pharmacy",
      priceLevel: 1,
    },
  ],
  transit: [
    {
      name: "Montgomery BART Station",
      rating: 4.0,
      distance: "0.5 miles",
      walkTime: "10 min",
      type: "BART",
      priceLevel: 0,
    },
    {
      name: "Market St & 3rd St (Muni)",
      rating: 3.5,
      distance: "0.1 miles",
      walkTime: "2 min",
      type: "Bus Stop",
      priceLevel: 0,
    },
    {
      name: "Embarcadero Station",
      rating: 4.2,
      distance: "0.7 miles",
      walkTime: "14 min",
      type: "Muni Metro",
      priceLevel: 0,
    },
  ],
  amenities: [
    {
      name: "Whole Foods Market",
      rating: 4.2,
      distance: "0.3 miles",
      walkTime: "6 min",
      type: "Grocery",
      priceLevel: 3,
      isOpen: true,
    },
    {
      name: "Blue Bottle Coffee",
      rating: 4.4,
      distance: "0.2 miles",
      walkTime: "4 min",
      type: "Coffee",
      priceLevel: 2,
      isOpen: true,
    },
    {
      name: "Westfield San Francisco Centre",
      rating: 4.0,
      distance: "0.4 miles",
      walkTime: "8 min",
      type: "Shopping",
      priceLevel: 3,
      isOpen: true,
    },
  ],
  safety: {
    crimeRate: "Low",
    walkSafety: 4.2,
    nightSafety: 3.8,
    policeResponse: "< 5 min",
  },
}

export function NeighborhoodInsights({ propertyAddress, coordinates }: NeighborhoodInsightsProps) {
  const [data, setData] = useState(mockNeighborhoodData)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // In production, this would fetch real data from Google Places API or HERE API
    const fetchNeighborhoodData = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // Use mock data for now
        setData(mockNeighborhoodData)
      } catch (error) {
        console.error("Error fetching neighborhood data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNeighborhoodData()
  }, [coordinates])

  const getPlaceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "elementary":
      case "middle school":
      case "high school":
        return School
      case "hospital":
      case "urgent care":
      case "pharmacy":
        return Hospital
      case "bart":
      case "bus stop":
      case "muni metro":
        return Train
      case "grocery":
        return ShoppingCart
      case "coffee":
        return Coffee
      case "shopping":
        return ShoppingCart
      default:
        return MapPin
    }
  }

  const getPriceLevelText = (level: number) => {
    switch (level) {
      case 0:
        return "Free"
      case 1:
        return "$"
      case 2:
        return "$$"
      case 3:
        return "$$$"
      case 4:
        return "$$$$"
      default:
        return "N/A"
    }
  }

  const renderPlaceList = (places: PlaceData[], title: string, icon: React.ElementType) => {
    const IconComponent = icon
    return (
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <IconComponent className="w-4 h-4" />
          {title}
        </h4>
        <div className="space-y-3">
          {places.map((place, index) => {
            const PlaceIcon = getPlaceIcon(place.type)
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <PlaceIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="font-medium text-sm">{place.name}</h5>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{place.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      <span>{place.distance}</span>
                    </div>
                    {place.walkTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{place.walkTime} walk</span>
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {place.type}
                    </Badge>
                    {place.priceLevel !== undefined && place.priceLevel > 0 && (
                      <span className="font-medium">{getPriceLevelText(place.priceLevel)}</span>
                    )}
                    {place.isOpen !== undefined && (
                      <Badge className={place.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {place.isOpen ? "Open" : "Closed"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Neighborhood Insights
          </CardTitle>
          <CardDescription>Loading real-time neighborhood data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing neighborhood amenities...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Neighborhood Insights
        </CardTitle>
        <CardDescription>Live data for {propertyAddress}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Walkability Scores */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.walkScore}</div>
                <div className="text-sm text-green-700">Walk Score</div>
                <div className="text-xs text-gray-600 mt-1">Walker's Paradise</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.transitScore}</div>
                <div className="text-sm text-blue-700">Transit Score</div>
                <div className="text-xs text-gray-600 mt-1">Excellent Transit</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.bikeScore}</div>
                <div className="text-sm text-purple-700">Bike Score</div>
                <div className="text-xs text-gray-600 mt-1">Very Bikeable</div>
              </div>
            </div>

            {/* Safety Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Safety & Security
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Crime Rate</span>
                    <Badge className="bg-green-100 text-green-800">{data.safety.crimeRate}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Walk Safety</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{data.safety.walkSafety}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Night Safety</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{data.safety.nightSafety}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Police Response</span>
                    <span className="text-sm font-medium">{data.safety.policeResponse}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <School className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-medium">{data.schools.length} Schools</div>
                <div className="text-xs text-gray-600">Within 1 mile</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Hospital className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="font-medium">{data.healthcare.length} Healthcare</div>
                <div className="text-xs text-gray-600">Nearby facilities</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Train className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-medium">{data.transit.length} Transit</div>
                <div className="text-xs text-gray-600">Public transport</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            {renderPlaceList(data.schools, "Schools & Education", School)}
          </TabsContent>

          <TabsContent value="transport" className="space-y-6">
            {renderPlaceList(data.transit, "Public Transportation", Train)}
          </TabsContent>

          <TabsContent value="amenities" className="space-y-6">
            {renderPlaceList(data.healthcare, "Healthcare", Hospital)}
            {renderPlaceList(data.amenities, "Shopping & Dining", ShoppingCart)}
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Wifi className="w-4 h-4 mr-2" />
            View Full Neighborhood Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

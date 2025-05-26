"use client"

import { useState } from "react"
import { ContrastIcon as Compare, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PropertyComparisonProps {
  availableProperties: any[]
  onCompare?: (properties: any[]) => void
}

export function PropertyComparison({ availableProperties, onCompare }: PropertyComparisonProps) {
  const [selectedProperties, setSelectedProperties] = useState<any[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const addToComparison = (property: any) => {
    if (selectedProperties.length < 4 && !selectedProperties.find((p) => p.id === property.id)) {
      const newSelection = [...selectedProperties, property]
      setSelectedProperties(newSelection)
      onCompare?.(newSelection)
    }
  }

  const removeFromComparison = (propertyId: string) => {
    const newSelection = selectedProperties.filter((p) => p.id !== propertyId)
    setSelectedProperties(newSelection)
    onCompare?.(newSelection)
  }

  const clearComparison = () => {
    setSelectedProperties([])
    setShowComparison(false)
    onCompare?.([])
  }

  if (selectedProperties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compare className="w-5 h-5" />
            Property Comparison
          </CardTitle>
          <CardDescription>Select properties to compare side by side</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Compare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No properties selected</p>
            <p className="text-sm text-gray-400">Click the compare icon on any property to add it here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Compare className="w-5 h-5" />
              Property Comparison ({selectedProperties.length}/4)
            </CardTitle>
            <CardDescription>Compare selected properties side by side</CardDescription>
          </div>
          <div className="flex gap-2">
            {selectedProperties.length >= 2 && (
              <Button size="sm" onClick={() => setShowComparison(!showComparison)}>
                {showComparison ? "Hide" : "Show"} Comparison
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={clearComparison}>
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!showComparison ? (
          <div className="space-y-3">
            {selectedProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{property.address}</h4>
                  <p className="text-sm text-gray-600">
                    {property.city}, {property.state}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-green-600">{property.value}</span>
                    <Badge
                      className={`text-xs ${
                        property.trustScore >= 90
                          ? "bg-green-500"
                          : property.trustScore >= 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      } text-white`}
                    >
                      {property.trustScore}%
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFromComparison(property.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Property</th>
                  {selectedProperties.map((property) => (
                    <th key={property.id} className="text-left p-2 min-w-[200px]">
                      <div>
                        <div className="font-medium">{property.address}</div>
                        <div className="text-xs text-gray-500">
                          {property.city}, {property.state}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">Value</td>
                  {selectedProperties.map((property) => (
                    <td key={property.id} className="p-2 font-semibold text-green-600">
                      {property.value}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Trust Score</td>
                  {selectedProperties.map((property) => (
                    <td key={property.id} className="p-2">
                      <Badge
                        className={`${
                          property.trustScore >= 90
                            ? "bg-green-500"
                            : property.trustScore >= 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        } text-white`}
                      >
                        {property.trustScore}%
                      </Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Owner</td>
                  {selectedProperties.map((property) => (
                    <td key={property.id} className="p-2">
                      {property.owner}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Property Type</td>
                  {selectedProperties.map((property) => (
                    <td key={property.id} className="p-2">
                      {property.propertyType}
                    </td>
                  ))}
                </tr>
                {selectedProperties.some((p) => p.sqft) && (
                  <tr className="border-b">
                    <td className="p-2 font-medium">Square Feet</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-2">
                        {property.sqft ? property.sqft.toLocaleString() : "N/A"}
                      </td>
                    ))}
                  </tr>
                )}
                <tr className="border-b">
                  <td className="p-2 font-medium">Verification</td>
                  {selectedProperties.map((property) => (
                    <td key={property.id} className="p-2">
                      {property.verified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Unverified</Badge>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

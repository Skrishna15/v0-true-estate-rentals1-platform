"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Download, FileText, Database, Bookmark, BookmarkCheck, Search } from "lucide-react"

interface Property {
  id: string
  address: string
  price: number
  owner: string
  trustScore: number
  type: string
  size?: number
  isSearchResult?: boolean
}

interface PropertyComparisonProps {
  availableProperties?: Property[]
  searchResults?: Property[]
  onPropertyUpdate?: (properties: Property[]) => void
}

export default function PropertyComparison({
  availableProperties = [],
  searchResults = [],
  onPropertyUpdate,
}: PropertyComparisonProps) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])
  const [savedProperties, setSavedProperties] = useState<Property[]>([])
  const [exportFormat, setExportFormat] = useState("csv")
  const [exportScope, setExportScope] = useState("all")
  const [includeFields, setIncludeFields] = useState({
    basicInfo: true,
    ownership: true,
    financial: true,
    location: true,
    marketData: false,
    verification: true,
  })

  // Default properties if none provided
  const defaultProperties: Property[] = [
    {
      id: "default-1",
      address: "123 Park Ave, New York, NY",
      price: 850000,
      owner: "John Smith",
      trustScore: 95,
      type: "Apartment",
      size: 1200,
    },
    {
      id: "default-2",
      address: "456 Broadway, New York, NY",
      price: 1200000,
      owner: "Sarah Johnson",
      trustScore: 88,
      type: "Condo",
      size: 1500,
    },
    {
      id: "default-3",
      address: "789 Fifth Ave, New York, NY",
      price: 2100000,
      owner: "Michael Chen",
      trustScore: 92,
      type: "Penthouse",
      size: 2800,
    },
  ]

  const allProperties = availableProperties.length > 0 ? availableProperties : defaultProperties

  const handlePropertySelect = (property: Property) => {
    if (selectedProperties.find((p) => p.id === property.id)) {
      setSelectedProperties(selectedProperties.filter((p) => p.id !== property.id))
    } else {
      setSelectedProperties([...selectedProperties, property])
    }
  }

  const handleSaveProperty = (property: Property) => {
    if (savedProperties.find((p) => p.id === property.id)) {
      setSavedProperties(savedProperties.filter((p) => p.id !== property.id))
    } else {
      setSavedProperties([...savedProperties, property])
    }
  }

  const generateCSV = (properties: Property[]) => {
    const headers = []
    const rows = []

    // Build headers based on selected fields
    if (includeFields.basicInfo) {
      headers.push("Address", "Property Type", "Size (sq ft)")
    }
    if (includeFields.ownership) {
      headers.push("Owner")
    }
    if (includeFields.financial) {
      headers.push("Price")
    }
    if (includeFields.verification) {
      headers.push("Trust Score")
    }

    // Build rows
    properties.forEach((property) => {
      const row = []
      if (includeFields.basicInfo) {
        row.push(property.address, property.type, property.size || "N/A")
      }
      if (includeFields.ownership) {
        row.push(property.owner)
      }
      if (includeFields.financial) {
        row.push(`$${property.price.toLocaleString()}`)
      }
      if (includeFields.verification) {
        row.push(`${property.trustScore}%`)
      }
      rows.push(row)
    })

    // Create CSV content
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    return csvContent
  }

  const generateJSON = (properties: Property[]) => {
    const filteredProperties = properties.map((property) => {
      const filtered: any = {}
      if (includeFields.basicInfo) {
        filtered.address = property.address
        filtered.type = property.type
        filtered.size = property.size
      }
      if (includeFields.ownership) {
        filtered.owner = property.owner
      }
      if (includeFields.financial) {
        filtered.price = property.price
      }
      if (includeFields.verification) {
        filtered.trustScore = property.trustScore
      }
      return filtered
    })
    return JSON.stringify(filteredProperties, null, 2)
  }

  const handleExport = () => {
    let propertiesToExport: Property[] = []

    switch (exportScope) {
      case "all":
        propertiesToExport = allProperties
        break
      case "selected":
        propertiesToExport = selectedProperties
        break
      case "saved":
        propertiesToExport = savedProperties
        break
      case "search":
        propertiesToExport = searchResults
        break
      default:
        propertiesToExport = allProperties
    }

    if (propertiesToExport.length === 0) {
      alert("No properties to export!")
      return
    }

    let content = ""
    let filename = ""
    let mimeType = ""

    switch (exportFormat) {
      case "csv":
        content = generateCSV(propertiesToExport)
        filename = `properties-export-${Date.now()}.csv`
        mimeType = "text/csv"
        break
      case "json":
        content = generateJSON(propertiesToExport)
        filename = `properties-export-${Date.now()}.json`
        mimeType = "application/json"
        break
      case "pdf":
        content = generateCSV(propertiesToExport)
        filename = `properties-export-${Date.now()}.txt`
        mimeType = "text/plain"
        alert("PDF export coming soon! Downloading as text file for now.")
        break
      default:
        return
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Show success message
    alert(`Successfully exported ${propertiesToExport.length} properties as ${exportFormat.toUpperCase()}!`)
  }

  const getPropertyCount = () => {
    switch (exportScope) {
      case "all":
        return allProperties.length
      case "selected":
        return selectedProperties.length
      case "saved":
        return savedProperties.length
      case "search":
        return searchResults.length
      default:
        return 0
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Advanced Real Estate Tools Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Advanced Real Estate Tools</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Save, compare, and export properties from your search results</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Property Comparison */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <CardTitle>Property Comparison</CardTitle>
            </div>
            <p className="text-gray-600">Compare properties side by side</p>
          </CardHeader>
          <CardContent>
            {selectedProperties.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-gray-200 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-400">D</span>
                </div>
                <p className="text-gray-500 font-medium">No properties selected</p>
                <p className="text-sm text-gray-400">Click "Compare" on any property below</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{property.address}</p>
                      <p className="text-xs text-gray-600">${property.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Trust: {property.trustScore}%
                        </Badge>
                        {property.isSearchResult && (
                          <Badge className="text-xs bg-blue-100 text-blue-800">
                            <Search className="w-3 h-3 mr-1" />
                            Search Result
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handlePropertySelect(property)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <Button className="w-full" variant="outline">
                    View Detailed Comparison
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Properties */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5" />
              <CardTitle>Saved Properties</CardTitle>
            </div>
            <p className="text-gray-600">Your bookmarked properties</p>
          </CardHeader>
          <CardContent>
            {savedProperties.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <Bookmark className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 font-medium">No saved properties</p>
                <p className="text-sm text-gray-400">Click the bookmark icon to save properties</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {savedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{property.address}</p>
                      <p className="text-xs text-gray-600">${property.price.toLocaleString()}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        Trust: {property.trustScore}%
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleSaveProperty(property)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Export & Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              <CardTitle>Data Export</CardTitle>
            </div>
            <p className="text-gray-600">Export property data</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export Format */}
            <div>
              <h4 className="font-medium mb-2">Export Format</h4>
              <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="flex gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center gap-1 cursor-pointer text-sm">
                    <Database className="w-3 h-3" />
                    CSV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex items-center gap-1 cursor-pointer text-sm">
                    <span className="text-xs font-mono">{"{}"}</span>
                    JSON
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center gap-1 cursor-pointer text-sm">
                    <FileText className="w-3 h-3" />
                    PDF
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Export Scope */}
            <div>
              <h4 className="font-medium mb-2">Export Scope</h4>
              <RadioGroup value={exportScope} onValueChange={setExportScope} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="text-sm">
                    All Properties ({allProperties.length})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selected" id="selected" />
                  <Label htmlFor="selected" className="text-sm">
                    Selected ({selectedProperties.length})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="saved" id="saved" />
                  <Label htmlFor="saved" className="text-sm">
                    Saved ({savedProperties.length})
                  </Label>
                </div>
                {searchResults.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="search" id="search" />
                    <Label htmlFor="search" className="text-sm">
                      Search Results ({searchResults.length})
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* Include Fields */}
            <div>
              <h4 className="font-medium mb-2">Include Fields</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="basicInfo"
                    checked={includeFields.basicInfo}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, basicInfo: checked as boolean }))
                    }
                  />
                  <Label htmlFor="basicInfo" className="text-sm">
                    Basic Info
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ownership"
                    checked={includeFields.ownership}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, ownership: checked as boolean }))
                    }
                  />
                  <Label htmlFor="ownership" className="text-sm">
                    Ownership
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="financial"
                    checked={includeFields.financial}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, financial: checked as boolean }))
                    }
                  />
                  <Label htmlFor="financial" className="text-sm">
                    Financial
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verification"
                    checked={includeFields.verification}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, verification: checked as boolean }))
                    }
                  />
                  <Label htmlFor="verification" className="text-sm">
                    Verification
                  </Label>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={getPropertyCount() === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export {getPropertyCount()} Properties
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Available Properties */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Available Properties ({allProperties.length})</CardTitle>
            <p className="text-gray-600">All properties from map and search results</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {allProperties.map((property) => (
                <div
                  key={property.id}
                  className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                    property.isSearchResult ? "border-blue-200 bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{property.address}</p>
                      <p className="text-xs text-gray-600 mb-1">
                        ${property.price.toLocaleString()} • {property.type}
                      </p>
                      {property.size && <p className="text-xs text-gray-500">{property.size.toLocaleString()} sq ft</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveProperty(property)}
                        className="p-1 h-8 w-8"
                      >
                        {savedProperties.find((p) => p.id === property.id) ? (
                          <BookmarkCheck className="w-3 h-3" />
                        ) : (
                          <Bookmark className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs ${
                          property.trustScore >= 90
                            ? "bg-green-100 text-green-800"
                            : property.trustScore >= 80
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {property.trustScore}%
                      </Badge>
                      {property.isSearchResult && (
                        <Badge className="text-xs bg-blue-100 text-blue-800">
                          <Search className="w-3 h-3 mr-1" />
                          New
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePropertySelect(property)}
                      disabled={selectedProperties.find((p) => p.id === property.id) !== undefined}
                      className={
                        selectedProperties.find((p) => p.id === property.id)
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : ""
                      }
                    >
                      {selectedProperties.find((p) => p.id === property.id) ? "Added" : "Compare"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

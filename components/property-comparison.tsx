"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TrendingUp, Download, FileText, Database } from "lucide-react"

interface Property {
  id: string
  address: string
  price: number
  owner: string
  trustScore: number
  type: string
}

const sampleProperties: Property[] = [
  {
    id: "1",
    address: "123 Park Ave, New York, NY",
    price: 850000,
    owner: "John Smith",
    trustScore: 95,
    type: "Apartment",
  },
  {
    id: "2",
    address: "456 Broadway, New York, NY",
    price: 1200000,
    owner: "Sarah Johnson",
    trustScore: 88,
    type: "Condo",
  },
  {
    id: "3",
    address: "789 Fifth Ave, New York, NY",
    price: 2100000,
    owner: "Michael Chen",
    trustScore: 92,
    type: "Penthouse",
  },
  {
    id: "4",
    address: "321 Madison Ave, New York, NY",
    price: 950000,
    owner: "Emily Davis",
    trustScore: 87,
    type: "Apartment",
  },
  {
    id: "5",
    address: "654 Lexington Ave, New York, NY",
    price: 1500000,
    owner: "Robert Wilson",
    trustScore: 91,
    type: "Condo",
  },
  {
    id: "6",
    address: "987 Park Ave, New York, NY",
    price: 2800000,
    owner: "Lisa Anderson",
    trustScore: 94,
    type: "Penthouse",
  },
]

export default function PropertyComparison() {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])
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

  const handlePropertySelect = (property: Property) => {
    if (selectedProperties.find((p) => p.id === property.id)) {
      setSelectedProperties(selectedProperties.filter((p) => p.id !== property.id))
    } else {
      setSelectedProperties([...selectedProperties, property])
    }
  }

  const generateCSV = (properties: Property[]) => {
    const headers = []
    const rows = []

    // Build headers based on selected fields
    if (includeFields.basicInfo) {
      headers.push("Address", "Property Type")
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
        row.push(property.address, property.type)
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
    const propertiesToExport = exportScope === "all" ? sampleProperties : selectedProperties

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
        // For PDF, we'll create a simple text version for now
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

  const propertyCount = exportScope === "all" ? sampleProperties.length : selectedProperties.length

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Advanced Real Estate Tools Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Advanced Real Estate Tools</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Professional tools and analytics for informed real estate decisions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Property Analysis Tools */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <CardTitle>Property Analysis Tools</CardTitle>
            </div>
            <p className="text-gray-600">Compare properties and analyze market trends</p>
          </CardHeader>
          <CardContent>
            {/* Property Comparison Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <h3 className="font-semibold">Property Comparison</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Select properties to compare side by side</p>

              {selectedProperties.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">D</span>
                  </div>
                  <p className="text-gray-500 font-medium">No properties selected</p>
                  <p className="text-sm text-gray-400">Click the compare icon on any property to add it here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                    >
                      <div>
                        <p className="font-medium">{property.address}</p>
                        <p className="text-sm text-gray-600">${property.price.toLocaleString()}</p>
                        <p className="text-xs text-blue-600">Trust Score: {property.trustScore}%</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handlePropertySelect(property)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <Button className="w-full" variant="outline">
                      Compare Selected Properties
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sample Properties for Selection */}
            <div>
              <h4 className="font-medium mb-3">Available Properties ({sampleProperties.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sampleProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{property.address}</p>
                      <p className="text-xs text-gray-600">
                        ${property.price.toLocaleString()} • {property.type}
                      </p>
                      <p className="text-xs text-green-600">Trust: {property.trustScore}%</p>
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
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Export & Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              <CardTitle>Data Export & Reports</CardTitle>
            </div>
            <p className="text-gray-600">Generate comprehensive property reports</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Export Format */}
            <div>
              <h4 className="font-medium mb-3">Export Format</h4>
              <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                    <Database className="w-4 h-4" />
                    CSV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-mono">{"{}"}</span>
                    JSON
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="w-4 h-4" />
                    PDF Report
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Export Scope */}
            <div>
              <h4 className="font-medium mb-3">Export Scope</h4>
              <RadioGroup value={exportScope} onValueChange={setExportScope}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All Properties ({sampleProperties.length})</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selected" id="selected" />
                  <Label htmlFor="selected">Selected Properties ({selectedProperties.length})</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Include Fields */}
            <div>
              <h4 className="font-medium mb-3">Include Fields</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="basicInfo"
                    checked={includeFields.basicInfo}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, basicInfo: checked as boolean }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="basicInfo" className="font-medium">
                      Basic Info
                    </Label>
                    <p className="text-xs text-gray-600">Address, owner, property type</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="ownership"
                    checked={includeFields.ownership}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, ownership: checked as boolean }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="ownership" className="font-medium">
                      Ownership
                    </Label>
                    <p className="text-xs text-gray-600">Owner details, company, portfolio</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="financial"
                    checked={includeFields.financial}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, financial: checked as boolean }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="financial" className="font-medium">
                      Financial
                    </Label>
                    <p className="text-xs text-gray-600">Value, rent estimates, ROI</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="location"
                    checked={includeFields.location}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, location: checked as boolean }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="location" className="font-medium">
                      Location
                    </Label>
                    <p className="text-xs text-gray-600">Coordinates, neighborhood, walk score</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="marketData"
                    checked={includeFields.marketData}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, marketData: checked as boolean }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="marketData" className="font-medium">
                      Market Data
                    </Label>
                    <p className="text-xs text-gray-600">Trends, appreciation, comparables</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="verification"
                    checked={includeFields.verification}
                    onCheckedChange={(checked) =>
                      setIncludeFields((prev) => ({ ...prev, verification: checked as boolean }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="verification" className="font-medium">
                      Verification
                    </Label>
                    <p className="text-xs text-gray-600">Trust scores, scam reports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={propertyCount === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export {propertyCount} Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

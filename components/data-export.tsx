"use client"

import { useState } from "react"
import { Download, FileText, Table, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface DataExportProps {
  properties: any[]
  selectedProperties?: any[]
  onExport?: (format: string, data: any[]) => void
}

export function DataExport({ properties, selectedProperties = [], onExport }: DataExportProps) {
  const [exportFormat, setExportFormat] = useState("csv")
  const [exportScope, setExportScope] = useState("all")
  const [selectedFields, setSelectedFields] = useState({
    basic: true,
    ownership: true,
    financial: true,
    location: true,
    market: false,
    verification: true,
  })

  const exportFormats = [
    { value: "csv", label: "CSV", icon: Table },
    { value: "json", label: "JSON", icon: Code },
    { value: "pdf", label: "PDF Report", icon: FileText },
  ]

  const fieldGroups = [
    { key: "basic", label: "Basic Info", description: "Address, owner, property type" },
    { key: "ownership", label: "Ownership", description: "Owner details, company, portfolio" },
    { key: "financial", label: "Financial", description: "Value, rent estimates, ROI" },
    { key: "location", label: "Location", description: "Coordinates, neighborhood, walk score" },
    { key: "market", label: "Market Data", description: "Trends, appreciation, comparables" },
    { key: "verification", label: "Verification", description: "Trust scores, scam reports" },
  ]

  const handleExport = () => {
    let dataToExport = properties

    if (exportScope === "selected" && selectedProperties.length > 0) {
      dataToExport = selectedProperties
    } else if (exportScope === "filtered") {
      // Use filtered properties if available
      dataToExport = properties
    }

    // Filter fields based on selection
    const filteredData = dataToExport.map((property) => {
      const filtered: any = {}

      if (selectedFields.basic) {
        filtered.address = property.address
        filtered.owner = property.owner
        filtered.propertyType = property.propertyType
        filtered.yearBuilt = property.yearBuilt
      }

      if (selectedFields.ownership) {
        filtered.company = property.company
        filtered.totalValue = property.totalValue
        filtered.properties = property.properties
        filtered.locations = property.locations
      }

      if (selectedFields.financial) {
        filtered.value = property.value
        filtered.marketValue = property.marketValue
        filtered.rentEstimate = property.rentEstimate
        filtered.appreciation = property.appreciation
      }

      if (selectedFields.location) {
        filtered.city = property.city
        filtered.state = property.state
        filtered.coordinates = property.coordinates
        filtered.neighborhood = property.neighborhood
        filtered.walkScore = property.walkScore
      }

      if (selectedFields.market) {
        filtered.marketTrend = property.marketTrend
        filtered.lastSale = property.lastSale
        filtered.crimeRate = property.crimeRate
      }

      if (selectedFields.verification) {
        filtered.verified = property.verified
        filtered.trustScore = property.trustScore
        filtered.scamReports = property.scamReports
        filtered.tenantReviews = property.tenantReviews
      }

      return filtered
    })

    // Simulate export
    if (exportFormat === "csv") {
      downloadCSV(filteredData)
    } else if (exportFormat === "json") {
      downloadJSON(filteredData)
    } else if (exportFormat === "pdf") {
      generatePDFReport(filteredData)
    }

    onExport?.(exportFormat, filteredData)
  }

  const downloadCSV = (data: any[]) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trueestate-properties-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadJSON = (data: any[]) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trueestate-properties-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generatePDFReport = (data: any[]) => {
    // Simulate PDF generation
    alert(
      `PDF report with ${data.length} properties would be generated here. In production, this would use a PDF library like jsPDF or Puppeteer.`,
    )
  }

  return (
    <div className="space-y-4">
      {/* Export Format */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Export Format</Label>
        <div className="grid grid-cols-3 gap-2">
          {exportFormats.map((format) => {
            const IconComponent = format.icon
            return (
              <Button
                key={format.value}
                variant={exportFormat === format.value ? "default" : "outline"}
                size="sm"
                onClick={() => setExportFormat(format.value)}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-xs">{format.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Export Scope */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Export Scope</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="all"
              name="scope"
              value="all"
              checked={exportScope === "all"}
              onChange={(e) => setExportScope(e.target.value)}
              className="w-4 h-4"
            />
            <Label htmlFor="all" className="text-sm">
              All Properties ({properties.length})
            </Label>
          </div>
          {selectedProperties.length > 0 && (
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="selected"
                name="scope"
                value="selected"
                checked={exportScope === "selected"}
                onChange={(e) => setExportScope(e.target.value)}
                className="w-4 h-4"
              />
              <Label htmlFor="selected" className="text-sm">
                Selected Properties ({selectedProperties.length})
              </Label>
            </div>
          )}
        </div>
      </div>

      {/* Field Selection */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Include Fields</Label>
        <div className="space-y-3">
          {fieldGroups.map((group) => (
            <div key={group.key} className="flex items-start space-x-2">
              <Checkbox
                id={group.key}
                checked={selectedFields[group.key as keyof typeof selectedFields]}
                onCheckedChange={(checked) => setSelectedFields((prev) => ({ ...prev, [group.key]: checked }))}
              />
              <div className="flex-1">
                <Label htmlFor={group.key} className="text-sm font-medium">
                  {group.label}
                </Label>
                <p className="text-xs text-gray-500">{group.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <Button onClick={handleExport} className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Export {exportScope === "selected" ? selectedProperties.length : properties.length} Properties
      </Button>
    </div>
  )
}

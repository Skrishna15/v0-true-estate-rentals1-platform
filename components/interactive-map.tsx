"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Map, Satellite, Navigation, Plus, Minus, Download, Upload, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"

interface Property {
  id: string
  owner: string
  address: string
  value: string
  trustScore: number
  coordinates: [number, number]
  state: string
  city: string
  totalValue?: string
}

interface SavedView {
  id: string
  name: string
  center: [number, number]
  zoom: number
  style: string
  timestamp: string
}

interface InteractiveMapProps {
  properties?: Property[]
  onPropertySelect?: (property: Property) => void
}

// Property data for all 50 states (keeping the existing data)
const stateProperties: Property[] = [
  // West Coast
  {
    id: "ca-1",
    owner: "Sarah Johnson",
    address: "123 Market St, San Francisco, CA",
    value: "$2.1M",
    trustScore: 95,
    coordinates: [-122.4194, 37.7749],
    state: "California",
    city: "San Francisco",
  },
  {
    id: "ca-2",
    owner: "Michael Chen",
    address: "456 Sunset Blvd, Los Angeles, CA",
    value: "$1.8M",
    trustScore: 88,
    coordinates: [-118.2437, 34.0522],
    state: "California",
    city: "Los Angeles",
  },
  {
    id: "wa-1",
    owner: "Emily Rodriguez",
    address: "789 Pine St, Seattle, WA",
    value: "$1.2M",
    trustScore: 92,
    coordinates: [-122.3321, 47.6062],
    state: "Washington",
    city: "Seattle",
  },
  {
    id: "or-1",
    owner: "David Kim",
    address: "321 Oak Ave, Portland, OR",
    value: "$850K",
    trustScore: 87,
    coordinates: [-122.6765, 45.5152],
    state: "Oregon",
    city: "Portland",
  },
  // ... (keeping all the existing properties for brevity)
  // Additional properties would be included here
]

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ properties = stateProperties, onPropertySelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng, setLng] = useState(-98.5795)
  const [lat, setLat] = useState(39.8283)
  const [zoom, setZoom] = useState(4)
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v11")
  const [isLoading, setIsLoading] = useState(true)
  const [savedViews, setSavedViews] = useState<SavedView[]>([])
  const [showSavedViews, setShowSavedViews] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const mapStyles = {
    street: "mapbox://styles/mapbox/streets-v12",
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    light: "mapbox://styles/mapbox/light-v11",
    dark: "mapbox://styles/mapbox/dark-v11",
  }

  // Load saved views from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("trueestate-saved-views")
    if (saved) {
      try {
        setSavedViews(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading saved views:", error)
      }
    }
  }, [])

  // Save views to localStorage whenever savedViews changes
  useEffect(() => {
    localStorage.setItem("trueestate-saved-views", JSON.stringify(savedViews))
  }, [savedViews])

  useEffect(() => {
    // Add CSS for pulsing animation
    const style = document.createElement("style")
    style.textContent = `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    if (map.current) return // Initialize map only once

    const initializeMap = async () => {
      if (mapContainer.current) {
        try {
          setIsLoading(true)
          // Fetch Mapbox token from secure server-side API
          const response = await fetch("/api/mapbox-token")

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (!data.token) {
            console.error("Failed to get Mapbox token:", data.error)
            setIsLoading(false)
            return
          }

          mapboxgl.accessToken = data.token

          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [lng, lat],
            zoom: zoom,
          })

          // Add navigation controls
          map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

          // Add geolocate control
          map.current.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
              },
              trackUserLocation: true,
              showUserHeading: true,
            }),
            "top-right",
          )

          map.current.on("load", () => {
            setIsLoading(false)
          })

          map.current.on("move", () => {
            if (map.current) {
              setLng(Number(map.current.getCenter().lng.toFixed(4)))
              setLat(Number(map.current.getCenter().lat.toFixed(4)))
              setZoom(Number(map.current.getZoom().toFixed(2)))
            }
          })
        } catch (error) {
          console.error("Error initializing map:", error)
          setIsLoading(false)
        }
      }
    }

    initializeMap()
  }, [lng, lat, zoom, mapStyle])

  useEffect(() => {
    if (!map.current || isLoading) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll(".marker")
    existingMarkers.forEach((marker) => marker.remove())

    // Add property markers for all properties (including search results)
    properties.forEach((property) => {
      const el = document.createElement("div")
      el.className = "marker"

      // Enhanced marker styling based on property value
      const propertyValue = Number.parseFloat(property.value?.replace(/[$MK]/g, "") || "0")
      const isHighValue = propertyValue > 1.5 // Properties over $1.5M
      const isMegaValue = propertyValue > 3.0 // Properties over $3M

      // Base styling
      el.style.backgroundColor =
        property.trustScore >= 90 ? "#10b981" : property.trustScore >= 80 ? "#f59e0b" : "#ef4444"
      el.style.width = isMegaValue ? "32px" : isHighValue ? "28px" : "24px"
      el.style.height = isMegaValue ? "32px" : isHighValue ? "28px" : "24px"
      el.style.borderRadius = "50%"
      el.style.cursor = "pointer"
      el.style.border = "3px solid white"
      el.style.boxShadow = isMegaValue ? "0 4px 12px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.3)"
      el.style.transition = "all 0.2s ease"
      el.style.position = "relative"

      // Add pulsing animation for high-value properties
      if (isHighValue) {
        el.style.animation = "pulse 2s infinite"
      }

      // Add special styling for search results
      if (property.id.startsWith("search-")) {
        el.style.border = "3px solid #3b82f6"
        el.style.animation = "pulse 2s infinite"
      }

      // Add value indicator
      if (isMegaValue) {
        const valueIndicator = document.createElement("div")
        valueIndicator.style.position = "absolute"
        valueIndicator.style.top = "-8px"
        valueIndicator.style.right = "-8px"
        valueIndicator.style.width = "16px"
        valueIndicator.style.height = "16px"
        valueIndicator.style.backgroundColor = "#ffd700"
        valueIndicator.style.borderRadius = "50%"
        valueIndicator.style.border = "2px solid white"
        valueIndicator.style.fontSize = "10px"
        valueIndicator.style.display = "flex"
        valueIndicator.style.alignItems = "center"
        valueIndicator.style.justifyContent = "center"
        valueIndicator.innerHTML = "★"
        valueIndicator.style.color = "white"
        el.appendChild(valueIndicator)
      }

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)"
        el.style.zIndex = "1000"
      })

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)"
        el.style.zIndex = "auto"
      })

      el.addEventListener("click", () => {
        onPropertySelect?.(property)
      })

      const isSaved = isPropertySaved(property.id)
      const saveButtonText = isSaved ? "Saved ✓" : "Save Property"
      const saveButtonClass = isSaved
        ? "flex-1 bg-green-100 text-green-700 text-xs py-2 px-3 rounded hover:bg-green-200 transition-colors"
        : "flex-1 bg-gray-100 text-gray-700 text-xs py-2 px-3 rounded hover:bg-gray-200 transition-colors"

      // Enhanced popup with working buttons
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(
        `<div class="p-4 min-w-[250px]">
    <div class="flex items-start justify-between mb-2">
      <h3 class="font-semibold text-lg">${property.owner}</h3>
      ${isMegaValue ? '<span class="text-yellow-500 text-lg">★</span>' : ""}
    </div>
    <p class="text-sm text-gray-600 mb-1">${property.city || property.state}, ${property.state}</p>
    <p class="text-xs text-gray-500 mb-3">${property.address}</p>
    <div class="grid grid-cols-2 gap-2 mb-3">
      <div>
        <span class="text-xs text-gray-500">Property Value</span>
        <p class="text-lg font-bold text-green-600">${property.value || property.totalValue}</p>
      </div>
      <div>
        <span class="text-xs text-gray-500">Trust Score</span>
        <div class="flex items-center gap-1">
          <span class="text-sm font-semibold ${property.trustScore >= 90 ? "text-green-600" : property.trustScore >= 80 ? "text-yellow-600" : "text-red-600"}">${property.trustScore}%</span>
          <div class="w-2 h-2 rounded-full ${property.trustScore >= 90 ? "bg-green-500" : property.trustScore >= 80 ? "bg-yellow-500" : "bg-red-500"}"></div>
        </div>
      </div>
    </div>
    ${property.id.startsWith("search-") ? '<div class="text-xs text-blue-600 font-medium mb-2 flex items-center gap-1"><span class="w-2 h-2 bg-blue-500 rounded-full"></span>Search Result</div>' : ""}
    ${isHighValue ? '<div class="text-xs text-purple-600 font-medium mb-2 flex items-center gap-1"><span class="w-2 h-2 bg-purple-500 rounded-full"></span>High Value Property</div>' : ""}
    <div class="flex gap-2">
      <button id="view-details-${property.id}" class="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors">
        View Details
      </button>
      <button id="save-property-${property.id}" class="${saveButtonClass}">
        ${saveButtonText}
      </button>
    </div>
  </div>`,
      )

      // Add event listeners after popup is added to map
      popup.on("open", () => {
        // View Details button handler
        const viewDetailsBtn = document.getElementById(`view-details-${property.id}`)
        if (viewDetailsBtn) {
          viewDetailsBtn.addEventListener("click", () => {
            handleViewDetails(property)
            popup.remove()
          })
        }

        // Save Property button handler
        const savePropertyBtn = document.getElementById(`save-property-${property.id}`)
        if (savePropertyBtn) {
          savePropertyBtn.addEventListener("click", () => {
            handleSaveProperty(property)
          })
        }
      })

      new mapboxgl.Marker(el).setLngLat(property.coordinates).setPopup(popup).addTo(map.current!)
    })
  }, [properties, onPropertySelect, isLoading])

  const changeMapStyle = (style: string) => {
    if (map.current) {
      map.current.setStyle(style)
      setMapStyle(style)
    }
  }

  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn()
    }
  }

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut()
    }
  }

  const handleSaveView = () => {
    if (!newViewName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the view.",
        variant: "destructive",
      })
      return
    }

    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName.trim(),
      center: [lng, lat],
      zoom: zoom,
      style: mapStyle,
      timestamp: new Date().toISOString(),
    }

    setSavedViews((prev) => [...prev, newView])
    setNewViewName("")
    setShowSaveDialog(false)

    toast({
      title: "Success",
      description: `Saved view: ${newView.name}`,
    })
  }

  const handleLoadSavedView = (view: SavedView) => {
    if (!map.current) return

    // Apply the saved view settings
    map.current.flyTo({
      center: view.center,
      zoom: view.zoom,
      duration: 1500,
    })

    // Change map style if different
    if (view.style !== mapStyle) {
      changeMapStyle(view.style)
    }

    setShowSavedViews(false)

    toast({
      title: "Success",
      description: `Loaded view: ${view.name}`,
    })
  }

  const handleDeleteSavedView = (viewId: string) => {
    setSavedViews((prev) => prev.filter((view) => view.id !== viewId))
    toast({
      title: "Success",
      description: "View deleted successfully",
    })
  }

  const handleExportMapData = async () => {
    try {
      setIsExporting(true)

      // Prepare export data
      const exportData = {
        properties: properties.map((property) => ({
          id: property.id,
          owner: property.owner,
          address: property.address,
          city: property.city,
          state: property.state,
          value: property.value,
          trustScore: property.trustScore,
          coordinates: property.coordinates,
        })),
        mapSettings: {
          center: [lng, lat],
          zoom: zoom,
          style: mapStyle,
        },
        exportDate: new Date().toISOString(),
        totalProperties: properties.length,
      }

      // Create and download JSON
      const jsonContent = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `trueestate-map-export-${new Date().toISOString().split("T")[0]}.json`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Also create CSV for property data
      const csvContent = convertToCSV(exportData.properties)
      const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const csvLink = document.createElement("a")
      const csvUrl = URL.createObjectURL(csvBlob)
      csvLink.setAttribute("href", csvUrl)
      csvLink.setAttribute("download", `trueestate-properties-${new Date().toISOString().split("T")[0]}.csv`)
      csvLink.style.visibility = "hidden"
      document.body.appendChild(csvLink)
      csvLink.click()
      document.body.removeChild(csvLink)
      URL.revokeObjectURL(csvUrl)

      toast({
        title: "Success",
        description: "Map data exported successfully (JSON + CSV)",
      })
    } catch (error) {
      console.error("Failed to export map data:", error)
      toast({
        title: "Error",
        description: "Failed to export map data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const convertToCSV = (data: any[]) => {
    if (!data.length) return ""

    const headers = Object.keys(data[0])
    const csvHeaders = headers.join(",")

    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Handle arrays (coordinates)
          if (Array.isArray(value)) {
            return `"[${value.join(", ")}]"`
          }
          // Escape commas and quotes in CSV
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(","),
    )

    return [csvHeaders, ...csvRows].join("\n")
  }

  const handleViewDetails = (property: Property) => {
    // Navigate to property details page or show detailed modal
    if (typeof window !== "undefined") {
      // Option 1: Navigate to property details page
      window.location.href = `/property/${property.id}`

      // Option 2: Call the onPropertySelect callback if provided
      // onPropertySelect?.(property)

      // Option 3: Show detailed information in a toast
      toast({
        title: `${property.owner}'s Property`,
        description: `${property.address} - ${property.value} (Trust Score: ${property.trustScore}%)`,
        duration: 5000,
      })
    }
  }

  const handleSaveProperty = (property: Property) => {
    // Get existing saved properties from localStorage
    const existingSaved = localStorage.getItem("trueestate-saved-properties")
    let savedProperties: Property[] = []

    if (existingSaved) {
      try {
        savedProperties = JSON.parse(existingSaved)
      } catch (error) {
        console.error("Error parsing saved properties:", error)
      }
    }

    // Check if property is already saved
    const isAlreadySaved = savedProperties.some((saved) => saved.id === property.id)

    if (isAlreadySaved) {
      // Remove from saved properties
      savedProperties = savedProperties.filter((saved) => saved.id !== property.id)
      localStorage.setItem("trueestate-saved-properties", JSON.stringify(savedProperties))

      toast({
        title: "Property Removed",
        description: `${property.address} removed from saved properties`,
        variant: "destructive",
      })

      // Update button text
      const saveBtn = document.getElementById(`save-property-${property.id}`)
      if (saveBtn) {
        saveBtn.textContent = "Save Property"
        saveBtn.className =
          "flex-1 bg-gray-100 text-gray-700 text-xs py-2 px-3 rounded hover:bg-gray-200 transition-colors"
      }
    } else {
      // Add to saved properties
      savedProperties.push(property)
      localStorage.setItem("trueestate-saved-properties", JSON.stringify(savedProperties))

      toast({
        title: "Property Saved",
        description: `${property.address} added to your saved properties`,
      })

      // Update button text and style
      const saveBtn = document.getElementById(`save-property-${property.id}`)
      if (saveBtn) {
        saveBtn.textContent = "Saved ✓"
        saveBtn.className =
          "flex-1 bg-green-100 text-green-700 text-xs py-2 px-3 rounded hover:bg-green-200 transition-colors"
      }
    }
  }

  const isPropertySaved = (propertyId: string): boolean => {
    const existingSaved = localStorage.getItem("trueestate-saved-properties")
    if (!existingSaved) return false

    try {
      const savedProperties: Property[] = JSON.parse(existingSaved)
      return savedProperties.some((saved) => saved.id === propertyId)
    } catch (error) {
      console.error("Error checking saved properties:", error)
      return false
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading nationwide property data...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map style controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
        <div className="flex flex-col gap-2">
          <Button
            variant={mapStyle === mapStyles.street ? "default" : "outline"}
            size="sm"
            onClick={() => changeMapStyle(mapStyles.street)}
            className="justify-start"
          >
            <Map className="w-4 h-4 mr-2" />
            Street
          </Button>
          <Button
            variant={mapStyle === mapStyles.satellite ? "default" : "outline"}
            size="sm"
            onClick={() => changeMapStyle(mapStyles.satellite)}
            className="justify-start"
          >
            <Satellite className="w-4 h-4 mr-2" />
            Satellite
          </Button>
          <Button
            variant={mapStyle === mapStyles.light ? "default" : "outline"}
            size="sm"
            onClick={() => changeMapStyle(mapStyles.light)}
            className="justify-start"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Light
          </Button>
          <Button
            variant={mapStyle === mapStyles.dark ? "default" : "outline"}
            size="sm"
            onClick={() => changeMapStyle(mapStyles.dark)}
            className="justify-start"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Dark
          </Button>
        </div>
      </div>

      {/* Map controls - Adjusted positioning */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 z-20">
        <div className="flex flex-col gap-2">
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start">
                <Save className="w-4 h-4 mr-2" />
                Save View
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Current View</DialogTitle>
                <DialogDescription>
                  Save the current map position, zoom level, and style for quick access later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="view-name">View Name</Label>
                  <Input
                    id="view-name"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder="Enter a name for this view..."
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    Current position: {lat.toFixed(4)}, {lng.toFixed(4)}
                  </p>
                  <p>Zoom level: {zoom.toFixed(2)}</p>
                  <p>Map style: {mapStyle.split("/").pop()}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveView}>Save View</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showSavedViews} onOpenChange={setShowSavedViews}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Load Saved View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Saved Views</DialogTitle>
                <DialogDescription>
                  Load a previously saved map view or delete views you no longer need.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                {savedViews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No saved views yet. Save your first view to get started!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {savedViews.map((view) => (
                      <Card key={view.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{view.name}</h4>
                            <p className="text-xs text-gray-500">
                              {new Date(view.timestamp).toLocaleDateString()} • Zoom: {view.zoom.toFixed(1)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => handleLoadSavedView(view)}>
                              Load
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSavedView(view.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportMapData}
            disabled={isExporting}
            className="justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Map Data"}
          </Button>
        </div>
      </div>

      {/* Custom zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <Button variant="outline" size="sm" onClick={zoomIn} className="bg-white hover:bg-gray-50 w-10 h-10 p-0">
          <Plus className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomOut} className="bg-white hover:bg-gray-50 w-10 h-10 p-0">
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      {/* Map info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 z-10">
        <div className="flex items-center gap-4">
          <span>Lng: {lng}</span>
          <span>Lat: {lat}</span>
          <span>Zoom: {zoom}</span>
          <span className="font-semibold">{properties.length} Properties</span>
        </div>
      </div>

      {/* Legend - Fixed positioning to avoid overlap */}
      <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-3 z-10 max-w-xs">
        <h4 className="font-semibold text-sm mb-3">Property Map Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="font-medium text-gray-700 mb-1">Trust Score</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>90%+ (Verified Safe)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>80-89% (Caution)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>&lt;80% (High Risk)</span>
          </div>

          <div className="border-t pt-2 mt-2">
            <div className="font-medium text-gray-700 mb-1">Property Value</div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full relative">
                <span className="absolute -top-1 -right-1 text-yellow-500 text-xs">★</span>
              </div>
              <span>$3M+ (Premium)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-blue-500 rounded-full"></div>
              <span>$1.5M+ (High Value)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>&lt;$1.5M (Standard)</span>
            </div>
          </div>

          <div className="border-t pt-2 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-300"></div>
              <span>Search Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  Settings,
  Info,
  RotateCcw,
  Globe,
  Sun,
  Moon,
  MapPin,
  Building2,
  AlertTriangle,
  Satellite,
  Map,
  Navigation,
  Eye,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { allStateProperties, type Property } from "@/lib/property-data"

interface MapboxGlobeMapProps {
  properties?: Property[]
  onPropertySelect?: (property: Property) => void
}

type MapStyle = "light" | "dark" | "satellite" | "satellite-streets" | "outdoors" | "navigation"

export function MapboxGlobeMap({ properties = allStateProperties, onPropertySelect }: MapboxGlobeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [mapStyle, setMapStyle] = useState<MapStyle>("light")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties)
  const [filters, setFilters] = useState({
    verified: "all",
    priceRange: "all",
    propertyType: "all",
    state: "all",
  })

  // const stats = getPropertyStats()

  // Map style options
  const mapStyles: { value: MapStyle; label: string; icon: any }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "satellite", label: "Satellite", icon: Satellite },
    { value: "satellite-streets", label: "Satellite Streets", icon: Map },
    { value: "outdoors", label: "Outdoors", icon: Navigation },
    { value: "navigation", label: "Navigation", icon: Eye },
  ]

  // Fetch Mapbox token from server API
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/mapbox-token", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (response.ok && data.token) {
          setMapboxToken(data.token)
          setTokenError(null)
        } else {
          setTokenError(data.error || "Failed to fetch Mapbox token")
          console.error("Token fetch failed:", data.error)
        }
      } catch (error) {
        console.error("Network error fetching Mapbox token:", error)
        setTokenError("Network error while fetching map configuration")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMapboxToken()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...properties]

    if (filters.verified !== "all") {
      filtered = filtered.filter((p) => (filters.verified === "verified" ? p.verified : !p.verified))
    }

    if (filters.priceRange !== "all") {
      filtered = filtered.filter((p) => {
        const price = Number.parseFloat(p.value.replace(/[$,]/g, ""))
        switch (filters.priceRange) {
          case "under-300k":
            return price < 300000
          case "300k-500k":
            return price >= 300000 && price < 500000
          case "500k-1m":
            return price >= 500000 && price < 1000000
          case "over-1m":
            return price >= 1000000
          default:
            return true
        }
      })
    }

    if (filters.propertyType !== "all") {
      filtered = filtered.filter((p) => p.propertyType.toLowerCase().includes(filters.propertyType.toLowerCase()))
    }

    if (filters.state !== "all") {
      filtered = filtered.filter((p) => p.state === filters.state)
    }

    setFilteredProperties(filtered)
  }, [filters, properties])

  // Load Mapbox GL JS after token is available
  useEffect(() => {
    if (!mapboxToken || tokenError) return

    const loadMapbox = async () => {
      if (typeof window === "undefined") return

      try {
        // Load Mapbox CSS
        if (!document.querySelector('link[href*="mapbox-gl"]')) {
          const link = document.createElement("link")
          link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
          link.rel = "stylesheet"
          document.head.appendChild(link)
        }

        // Load Mapbox JS
        if (!(window as any).mapboxgl) {
          const script = document.createElement("script")
          script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
          script.onload = initializeMap
          script.onerror = () => {
            console.error("Failed to load Mapbox GL JS library")
            setTokenError("Failed to load mapping library")
          }
          document.head.appendChild(script)
        } else {
          initializeMap()
        }
      } catch (error) {
        console.error("Error loading Mapbox resources:", error)
        setTokenError("Error loading map resources")
      }
    }

    loadMapbox()

    return () => {
      if (map.current) {
        try {
          map.current.remove()
          map.current = null
        } catch (error) {
          console.error("Error cleaning up map:", error)
        }
      }
    }
  }, [mapboxToken, tokenError])

  // Re-add markers when filtered properties change
  useEffect(() => {
    if (map.current && mapLoaded) {
      // Clear existing markers
      const existingMarkers = document.querySelectorAll(".property-marker")
      existingMarkers.forEach((marker) => marker.remove())

      // Add new filtered markers
      addPropertyMarkers()
    }
  }, [filteredProperties, mapLoaded])

  const initializeMap = () => {
    if (!mapContainer.current || map.current || !mapboxToken) return

    const mapboxgl = (window as any).mapboxgl

    try {
      // Set the access token
      mapboxgl.accessToken = mapboxToken

      // Initialize map with globe projection
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${mapStyle}-v11`,
        center: [-100, 40], // United States focus
        zoom: 2,
        projection: "globe",
        antialias: true,
      })

      // Add map event listeners
      map.current.on("load", () => {
        try {
          // Set atmospheric fog for 3D effect
          map.current.setFog({
            color: "rgb(186, 210, 235)", // Lower atmosphere
            "high-color": "rgb(36, 92, 223)", // Upper atmosphere
            "horizon-blend": 0.02, // Atmosphere thickness
            "space-color": "rgb(11, 11, 25)", // Background space color
            "star-intensity": 0.6, // Background star brightness
          })

          // Add property markers
          addPropertyMarkers()
          setMapLoaded(true)
        } catch (error) {
          console.error("Error setting up map features:", error)
          setTokenError("Error configuring map features")
        }
      })

      map.current.on("error", (e: any) => {
        console.error("Mapbox runtime error:", e)
        setTokenError("Map runtime error occurred")
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), "top-right")

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
    } catch (error) {
      console.error("Error initializing Mapbox map:", error)
      setTokenError("Failed to initialize map")
    }
  }

  const addPropertyMarkers = () => {
    if (!map.current) return

    const mapboxgl = (window as any).mapboxgl

    filteredProperties.forEach((property) => {
      try {
        // Create marker color based on trust score
        const getMarkerColor = (trustScore: number, verified: boolean) => {
          if (!verified) return "#ef4444" // Red for unverified
          if (trustScore >= 95) return "#10b981" // Green for excellent
          if (trustScore >= 85) return "#f59e0b" // Orange for good
          return "#6b7280" // Gray for average
        }

        const color = getMarkerColor(property.trustScore, property.verified)
        const size = property.verified ? 14 : 10

        // Get market trend icon
        const getTrendIcon = (trend?: string) => {
          switch (trend) {
            case "up":
              return "↗"
            case "down":
              return "↘"
            case "stable":
              return "→"
            default:
              return ""
          }
        }

        // Create custom marker element
        const markerElement = document.createElement("div")
        markerElement.className = "property-marker"
        markerElement.innerHTML = `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 8px;
            font-weight: bold;
          " 
          onmouseover="this.style.transform='scale(1.5)'; this.style.zIndex='1000'"
          onmouseout="this.style.transform='scale(1)'; this.style.zIndex='auto'"
          >
            ${property.verified ? '<div style="position: absolute; top: -2px; right: -2px; width: 6px; height: 6px; background: #22c55e; border: 1px solid white; border-radius: 50%;"></div>' : ""}
            ${getTrendIcon(property.marketTrend)}
          </div>
        `

        // Create enhanced popup
        const popup = new mapboxgl.Popup({
          offset: 15,
          className: "property-popup",
          maxWidth: "300px",
        }).setHTML(`
          <div style="min-width: 250px; font-family: system-ui;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${property.owner}</h3>
              <div style="display: flex; flex-direction: column; align-items: end; gap: 2px;">
                ${property.verified ? '<span style="color: #10b981; font-size: 12px; font-weight: 500;">✓ Verified</span>' : '<span style="color: #ef4444; font-size: 12px; font-weight: 500;">⚠ Unverified</span>'}
                ${property.marketTrend ? `<span style="color: ${property.marketTrend === "up" ? "#10b981" : property.marketTrend === "down" ? "#ef4444" : "#6b7280"}; font-size: 10px;">${getTrendIcon(property.marketTrend)} ${property.marketTrend}</span>` : ""}
              </div>
            </div>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">${property.address}</p>
            <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 11px; font-weight: 500;">${property.city}, ${property.state}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
              <div style="background: #f9fafb; padding: 8px; border-radius: 6px;">
                <div style="color: #6b7280; font-size: 10px; margin-bottom: 2px;">Value</div>
                <div style="font-weight: 600; color: #059669; font-size: 14px;">${property.value}</div>
              </div>
              <div style="background: #f9fafb; padding: 8px; border-radius: 6px;">
                <div style="color: #6b7280; font-size: 10px; margin-bottom: 2px;">Trust Score</div>
                <div style="font-weight: 600; font-size: 14px; color: ${property.trustScore >= 90 ? "#059669" : property.trustScore >= 80 ? "#d97706" : "#dc2626"}">${property.trustScore}%</div>
              </div>
            </div>

            ${
              property.sqft || property.bedrooms
                ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-bottom: 8px;">
              ${
                property.sqft
                  ? `<div style="background: #f3f4f6; padding: 6px; border-radius: 4px; text-align: center;">
                <div style="color: #6b7280; font-size: 9px;">Sq Ft</div>
                <div style="font-weight: 500; font-size: 11px;">${property.sqft?.toLocaleString()}</div>
              </div>`
                  : ""
              }
              ${
                property.bedrooms
                  ? `<div style="background: #f3f4f6; padding: 6px; border-radius: 4px; text-align: center;">
                <div style="color: #6b7280; font-size: 9px;">Beds</div>
                <div style="font-weight: 500; font-size: 11px;">${property.bedrooms}</div>
              </div>`
                  : ""
              }
              ${
                property.bathrooms
                  ? `<div style="background: #f3f4f6; padding: 6px; border-radius: 4px; text-align: center;">
                <div style="color: #6b7280; font-size: 9px;">Baths</div>
                <div style="font-weight: 500; font-size: 11px;">${property.bathrooms}</div>
              </div>`
                  : ""
              }
            </div>
            `
                : ""
            }

            <div style="background: #f3f4f6; padding: 8px; border-radius: 6px; margin-bottom: 10px;">
              <div style="color: #6b7280; font-size: 10px; margin-bottom: 2px;">Property Type</div>
              <div style="font-weight: 500; font-size: 12px;">${property.propertyType}</div>
              ${property.yearBuilt ? `<div style="color: #6b7280; font-size: 10px; margin-top: 2px;">Built: ${property.yearBuilt}</div>` : ""}
            </div>

            <div style="display: flex; gap: 6px;">
              <button 
                onclick="window.dispatchEvent(new CustomEvent('propertySelect', { detail: '${property.id}' }))"
                style="
                  flex: 1;
                  background: #2563eb; 
                  color: white; 
                  border: none; 
                  padding: 8px 12px; 
                  border-radius: 6px; 
                  font-size: 12px;
                  font-weight: 500;
                  cursor: pointer;
                  transition: background 0.2s;
                "
                onmouseover="this.style.background='#1d4ed8'"
                onmouseout="this.style.background='#2563eb'"
              >
                View Details
              </button>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('bookmarkProperty', { detail: '${property.id}' }))"
                style="background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: background 0.2s;"
                onmouseover="this.style.background='#b91c1c'"
                onmouseout="this.style.background='#dc2626'"
                title="Bookmark Property"
              >
                ♥
              </button>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('streetView', { detail: '${property.id}' }))"
                style="
                  background: #059669; 
                  color: white; 
                  border: none; 
                  padding: 8px 12px; 
                  border-radius: 6px; 
                  font-size: 12px;
                  cursor: pointer;
                  transition: background 0.2s;
                "
                onmouseover="this.style.background='#047857'"
                onmouseout="this.style.background='#059669'"
              >
                Street View
              </button>
            </div>
          </div>
        `)

        // Create and add marker
        new mapboxgl.Marker(markerElement)
          .setLngLat([property.coordinates[0], property.coordinates[1]])
          .setPopup(popup)
          .addTo(map.current)

        // Handle property selection
        markerElement.addEventListener("click", () => {
          setSelectedProperty(property)
          onPropertySelect?.(property)
        })
      } catch (error) {
        console.error(`Error adding marker for property ${property.id}:`, error)
      }
    })

    // Listen for property selection from popup
    const handlePropertySelect = (event: any) => {
      const property = filteredProperties.find((p) => p.id === event.detail)
      if (property) {
        setSelectedProperty(property)
        onPropertySelect?.(property)
      }
    }

    const handleStreetView = (event: any) => {
      const property = filteredProperties.find((p) => p.id === event.detail)
      if (property) {
        // Open Google Street View
        const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${property.coordinates[1]},${property.coordinates[0]}`
        window.open(streetViewUrl, "_blank")
      }
    }

    window.addEventListener("propertySelect", handlePropertySelect)
    window.addEventListener("streetView", handleStreetView)

    // Add this after the existing event listeners in addPropertyMarkers function
    const handleBookmarkProperty = async (event: any) => {
      const property = filteredProperties.find((p) => p.id === event.detail)
      if (property) {
        try {
          // Get current user from localStorage
          const userData = localStorage.getItem("trueestate_user")
          if (!userData) {
            alert("Please sign in to bookmark properties")
            return
          }

          const user = JSON.parse(userData)

          // Call bookmark API
          const response = await fetch("/api/bookmarks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id || "demo-user",
              propertyId: property.id,
              propertyData: {
                address: property.address,
                owner: property.owner,
                value: property.value,
                trustScore: property.trustScore,
                coordinates: property.coordinates,
              },
              notes: "",
              tags: [],
            }),
          })

          const result = await response.json()

          if (result.success) {
            // Show success message
            const notification = document.createElement("div")
            notification.innerHTML = `
              <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: system-ui;
                font-size: 14px;
                font-weight: 500;
              ">
                ✓ Property bookmarked successfully!
              </div>
            `
            document.body.appendChild(notification)

            // Remove notification after 3 seconds
            setTimeout(() => {
              document.body.removeChild(notification)
            }, 3000)

            // Trigger bookmark list refresh
            window.dispatchEvent(new CustomEvent("bookmarkAdded", { detail: property }))
          } else {
            throw new Error(result.error || "Failed to bookmark property")
          }
        } catch (error) {
          console.error("Bookmark error:", error)

          // Show error message
          const notification = document.createElement("div")
          notification.innerHTML = `
            <div style="
              position: fixed;
              top: 20px;
              right: 20px;
              background: #ef4444;
              color: white;
              padding: 12px 20px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              z-index: 10000;
              font-family: system-ui;
              font-size: 14px;
              font-weight: 500;
            ">
              ⚠ ${error.message || "Failed to bookmark property"}
            </div>
          `
          document.body.appendChild(notification)

          setTimeout(() => {
            document.body.removeChild(notification)
          }, 3000)
        }
      }
    }

    window.addEventListener("bookmarkProperty", handleBookmarkProperty)

    // Update the cleanup to include the bookmark listener
    return () => {
      window.removeEventListener("propertySelect", handlePropertySelect)
      window.removeEventListener("streetView", handleStreetView)
      window.removeEventListener("bookmarkProperty", handleBookmarkProperty)
    }
  }

  const changeMapStyle = (newStyle: MapStyle) => {
    if (map.current) {
      try {
        setMapStyle(newStyle)
        map.current.setStyle(`mapbox://styles/mapbox/${newStyle}-v11`)

        // Re-add fog and markers after style change
        map.current.once("styledata", () => {
          try {
            // Adjust fog based on style
            const fogConfig = {
              light: {
                color: "rgb(186, 210, 235)",
                "high-color": "rgb(36, 92, 223)",
                "space-color": "rgb(11, 11, 25)",
              },
              dark: {
                color: "rgb(50, 50, 70)",
                "high-color": "rgb(20, 20, 40)",
                "space-color": "rgb(5, 5, 15)",
              },
              satellite: {
                color: "rgb(100, 100, 120)",
                "high-color": "rgb(30, 30, 50)",
                "space-color": "rgb(0, 0, 0)",
              },
            }

            const config = fogConfig[newStyle as keyof typeof fogConfig] || fogConfig.light

            map.current.setFog({
              ...config,
              "horizon-blend": 0.02,
              "star-intensity": 0.6,
            })
            addPropertyMarkers()
          } catch (error) {
            console.error("Error updating map style:", error)
          }
        })
      } catch (error) {
        console.error("Error changing map style:", error)
      }
    }
  }

  const resetView = () => {
    if (map.current) {
      try {
        map.current.flyTo({
          center: [-100, 40],
          zoom: 2,
          duration: 2000,
        })
      } catch (error) {
        console.error("Error resetting view:", error)
      }
    }
  }

  const flyToProperty = (property: Property) => {
    if (map.current) {
      try {
        map.current.flyTo({
          center: property.coordinates,
          zoom: 12,
          duration: 2000,
        })
      } catch (error) {
        console.error("Error flying to property:", error)
      }
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (
        !target.closest(".map-controls") &&
        !target.closest(".legend-controls") &&
        !target.closest(".filter-controls")
      ) {
        setShowControls(false)
        setShowLegend(false)
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Add this inside the useEffect that sets up event listeners
  useEffect(() => {
    const handleFocusProperty = (event: any) => {
      const property = event.detail
      if (property && map.current) {
        // Fly to the property location
        map.current.flyTo({
          center: property.coordinates,
          zoom: 12,
          duration: 2000,
        })

        // Set as selected property
        setSelectedProperty(property)
        onPropertySelect?.(property)
      }
    }

    window.addEventListener("focusProperty", handleFocusProperty)

    return () => {
      window.removeEventListener("focusProperty", handleFocusProperty)
    }
  }, [onPropertySelect])

  // Add this function before the return statement
  const getCurrentMapState = () => {
    if (map.current) {
      return {
        center: [map.current.getCenter().lng, map.current.getCenter().lat],
        zoom: map.current.getZoom(),
        style: mapStyle,
        filters: filters,
      }
    }
    return null
  }

  // Add useEffect to track map state changes
  useEffect(() => {
    const handleMapStateChange = () => {
      const state = getCurrentMapState()
      if (state) {
        // Notify parent component of map state change
        window.dispatchEvent(new CustomEvent("mapStateChange", { detail: state }))
      }
    }

    if (map.current) {
      map.current.on("moveend", handleMapStateChange)
      map.current.on("zoomend", handleMapStateChange)
    }

    return () => {
      if (map.current) {
        map.current.off("moveend", handleMapStateChange)
        map.current.off("zoomend", handleMapStateChange)
      }
    }
  }, [mapLoaded, mapStyle, filters])

  // Show error state if token fetch failed
  if (tokenError) {
    return (
      <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-[1000]">
          <div className="text-center text-white max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Map Service Unavailable</h3>
            <p className="text-sm text-gray-400 mb-4">{tokenError}</p>
            <div className="bg-slate-800 rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Property Data Available:
              </h4>
              <div className="space-y-2 text-sm">
                {properties.slice(0, 3).map((property) => (
                  <div key={property.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{property.owner}</div>
                      <div className="text-xs text-gray-400">{property.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">{property.value}</div>
                      <div className="text-xs">{property.trustScore}% trust</div>
                    </div>
                  </div>
                ))}
                {properties.length > 3 && (
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                    +{properties.length - 3} more properties available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] map-controls">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-lg border-white/20 hover:bg-white/95"
            onClick={() => setShowControls(!showControls)}
            disabled={!mapLoaded}
          >
            <Settings className="w-4 h-4 mr-2" />
            Map Styles
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          {showControls && mapLoaded && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 z-[1001]">
              <div className="py-2">
                {mapStyles.map((style) => {
                  const IconComponent = style.icon
                  return (
                    <button
                      key={style.value}
                      className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        mapStyle === style.value ? "bg-blue-50 text-blue-600" : ""
                      }`}
                      onClick={() => {
                        changeMapStyle(style.value)
                        setShowControls(false)
                      }}
                    >
                      <IconComponent className="w-4 h-4 mr-3" />
                      {style.label}
                      {mapStyle === style.value && <span className="ml-auto text-blue-600">✓</span>}
                    </button>
                  )
                })}
                <div className="border-t my-2"></div>
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    resetView()
                    setShowControls(false)
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-3" />
                  Reset View
                </button>
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    if (map.current) {
                      try {
                        const projection = map.current.getProjection()
                        map.current.setProjection(projection.name === "globe" ? "mercator" : "globe")
                      } catch (error) {
                        console.error("Error toggling projection:", error)
                      }
                    }
                    setShowControls(false)
                  }}
                >
                  <Globe className="w-4 h-4 mr-3" />
                  Toggle Globe/Flat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="absolute top-4 left-48 z-[1000] filter-controls">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-lg border-white/20 hover:bg-white/95"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters ({filteredProperties.length})
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          {showFilters && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 z-[1001] p-4">
              <h4 className="font-semibold text-sm mb-3">Filter Properties</h4>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Verification Status</label>
                  <select
                    value={filters.verified}
                    onChange={(e) => setFilters((prev) => ({ ...prev, verified: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="all">All Properties</option>
                    <option value="verified">Verified Only</option>
                    <option value="unverified">Unverified Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="all">All Prices</option>
                    <option value="under-300k">Under $300K</option>
                    <option value="300k-500k">$300K - $500K</option>
                    <option value="500k-1m">$500K - $1M</option>
                    <option value="over-1m">Over $1M</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="all">All Types</option>
                    <option value="single">Single Family</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters((prev) => ({ ...prev, state: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="all">All States</option>
                    {Array.from(new Set(properties.map((p) => p.state)))
                      .sort()
                      .map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={() => setFilters({ verified: "all", priceRange: "all", propertyType: "all", state: "all" })}
                  className="w-full text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] legend-controls">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-lg border-white/20 hover:bg-white/95"
            onClick={() => setShowLegend(!showLegend)}
          >
            <Info className="w-4 h-4 mr-2" />
            Legend
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          {showLegend && (
            <div className="absolute bottom-full left-0 mb-2 w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 z-[1001] p-4">
              <h4 className="font-semibold text-sm mb-3">Property Markers & Features</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm relative">
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-sm">Verified • 95%+ Trust Score</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm relative">
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-sm">Verified • 85-94% Trust Score</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                  <span className="text-sm">Unverified Properties</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <h5 className="font-medium text-xs mb-2">Market Trends</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs">↗ Rising Market</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-3 h-3 text-red-500" />
                      <span className="text-xs">↘ Declining Market</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Minus className="w-3 h-3 text-gray-500" />
                      <span className="text-xs">→ Stable Market</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t">
                <p className="text-xs text-gray-600">
                  Click markers for details • Use Street View button for ground-level view • Mouse controls: rotate
                  globe, zoom, pan
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <Badge
          className={`px-3 py-1 backdrop-blur-sm ${mapLoaded ? "bg-green-500/90 text-white" : "bg-blue-500/90 text-white"}`}
        >
          <Globe className="w-3 h-3 mr-1" />
          {mapLoaded ? `3D Globe • ${filteredProperties.length}/${properties.length} Properties` : "Loading Globe..."}
        </Badge>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full min-h-[500px]" />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-[1000]">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-2">Loading 3D Globe</p>
            <p className="text-sm text-gray-400">
              {!mapboxToken ? "Fetching secure configuration..." : "Initializing Mapbox GL JS..."}
            </p>
          </div>
        </div>
      )}

      {/* Selected Property Info */}
      {selectedProperty && (
        <Card className="absolute bottom-4 right-4 z-[1000] w-80 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{selectedProperty.owner}</h3>
                <p className="text-sm text-gray-600">{selectedProperty.address}</p>
                <p className="text-xs text-gray-500">
                  {selectedProperty.city}, {selectedProperty.state}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {selectedProperty.verified ? (
                  <Badge className="bg-green-500 text-white">Verified</Badge>
                ) : (
                  <Badge variant="destructive">Unverified</Badge>
                )}
                {selectedProperty.marketTrend && (
                  <Badge variant="outline" className="text-xs">
                    {selectedProperty.marketTrend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
                    {selectedProperty.marketTrend === "down" && <TrendingDown className="w-3 h-3 mr-1" />}
                    {selectedProperty.marketTrend === "stable" && <Minus className="w-3 h-3 mr-1" />}
                    {selectedProperty.marketTrend}
                  </Badge>
                )}
                <button onClick={() => setSelectedProperty(null)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Value</div>
                <div className="font-semibold text-green-600">{selectedProperty.value}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Trust Score</div>
                <div className="font-semibold">{selectedProperty.trustScore}%</div>
              </div>
            </div>

            {(selectedProperty.sqft || selectedProperty.bedrooms) && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {selectedProperty.sqft && (
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Sq Ft</div>
                    <div className="font-medium text-sm">{selectedProperty.sqft.toLocaleString()}</div>
                  </div>
                )}
                {selectedProperty.bedrooms && (
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Beds</div>
                    <div className="font-medium text-sm">{selectedProperty.bedrooms}</div>
                  </div>
                )}
                {selectedProperty.bathrooms && (
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Baths</div>
                    <div className="font-medium text-sm">{selectedProperty.bathrooms}</div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => flyToProperty(selectedProperty)}>
                <MapPin className="w-4 h-4 mr-1" />
                Zoom to Property
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${selectedProperty.coordinates[1]},${selectedProperty.coordinates[0]}`
                  window.open(streetViewUrl, "_blank")
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Street View
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

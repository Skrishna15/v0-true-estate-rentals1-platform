"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { Map, Satellite, Navigation, Plus, Minus } from "lucide-react"

interface Property {
  id: string
  owner: string
  address: string
  value: string
  trustScore: number
  coordinates: [number, number]
  state: string
  city: string
}

interface InteractiveMapProps {
  properties?: Property[]
  onPropertySelect?: (property: Property) => void
}

// Property data for all 50 states
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

  // Southwest
  {
    id: "az-1",
    owner: "Lisa Martinez",
    address: "654 Desert Dr, Phoenix, AZ",
    value: "$650K",
    trustScore: 83,
    coordinates: [-112.074, 33.4484],
    state: "Arizona",
    city: "Phoenix",
  },
  {
    id: "nv-1",
    owner: "Robert Taylor",
    address: "987 Strip Blvd, Las Vegas, NV",
    value: "$750K",
    trustScore: 79,
    coordinates: [-115.1398, 36.1699],
    state: "Nevada",
    city: "Las Vegas",
  },
  {
    id: "ut-1",
    owner: "Jennifer Wilson",
    address: "147 Temple St, Salt Lake City, UT",
    value: "$580K",
    trustScore: 91,
    coordinates: [-111.891, 40.7608],
    state: "Utah",
    city: "Salt Lake City",
  },
  {
    id: "co-1",
    owner: "Mark Anderson",
    address: "258 Mountain View, Denver, CO",
    value: "$720K",
    trustScore: 89,
    coordinates: [-104.9903, 39.7392],
    state: "Colorado",
    city: "Denver",
  },
  {
    id: "nm-1",
    owner: "Patricia Garcia",
    address: "369 Adobe Rd, Albuquerque, NM",
    value: "$420K",
    trustScore: 85,
    coordinates: [-106.6504, 35.0844],
    state: "New Mexico",
    city: "Albuquerque",
  },

  // Texas
  {
    id: "tx-1",
    owner: "James Thompson",
    address: "741 Cowboy Way, Houston, TX",
    value: "$680K",
    trustScore: 86,
    coordinates: [-95.3698, 29.7604],
    state: "Texas",
    city: "Houston",
  },
  {
    id: "tx-2",
    owner: "Maria Gonzalez",
    address: "852 Lone Star Dr, Austin, TX",
    value: "$790K",
    trustScore: 90,
    coordinates: [-97.7431, 30.2672],
    state: "Texas",
    city: "Austin",
  },
  {
    id: "tx-3",
    owner: "Christopher Lee",
    address: "963 Ranch Rd, Dallas, TX",
    value: "$720K",
    trustScore: 84,
    coordinates: [-96.797, 32.7767],
    state: "Texas",
    city: "Dallas",
  },

  // Southeast
  {
    id: "fl-1",
    owner: "Amanda White",
    address: "159 Ocean Dr, Miami, FL",
    value: "$1.1M",
    trustScore: 88,
    coordinates: [-80.1918, 25.7617],
    state: "Florida",
    city: "Miami",
  },
  {
    id: "fl-2",
    owner: "Daniel Brown",
    address: "357 Beach Blvd, Tampa, FL",
    value: "$520K",
    trustScore: 82,
    coordinates: [-82.4572, 27.9506],
    state: "Florida",
    city: "Tampa",
  },
  {
    id: "ga-1",
    owner: "Michelle Davis",
    address: "468 Peach St, Atlanta, GA",
    value: "$480K",
    trustScore: 87,
    coordinates: [-84.388, 33.749],
    state: "Georgia",
    city: "Atlanta",
  },
  {
    id: "nc-1",
    owner: "Kevin Miller",
    address: "579 Tobacco Rd, Charlotte, NC",
    value: "$420K",
    trustScore: 89,
    coordinates: [-80.8431, 35.2271],
    state: "North Carolina",
    city: "Charlotte",
  },
  {
    id: "sc-1",
    owner: "Laura Wilson",
    address: "680 Palmetto Ave, Charleston, SC",
    value: "$650K",
    trustScore: 91,
    coordinates: [-79.9311, 32.7765],
    state: "South Carolina",
    city: "Charleston",
  },
  {
    id: "tn-1",
    owner: "Brian Moore",
    address: "791 Music Row, Nashville, TN",
    value: "$550K",
    trustScore: 86,
    coordinates: [-86.7816, 36.1627],
    state: "Tennessee",
    city: "Nashville",
  },
  {
    id: "al-1",
    owner: "Nicole Taylor",
    address: "802 Cotton St, Birmingham, AL",
    value: "$320K",
    trustScore: 83,
    coordinates: [-86.8025, 33.5207],
    state: "Alabama",
    city: "Birmingham",
  },
  {
    id: "ms-1",
    owner: "Ryan Jackson",
    address: "913 Delta Dr, Jackson, MS",
    value: "$280K",
    trustScore: 81,
    coordinates: [-90.1848, 32.2988],
    state: "Mississippi",
    city: "Jackson",
  },
  {
    id: "la-1",
    owner: "Stephanie Martin",
    address: "024 Bourbon St, New Orleans, LA",
    value: "$450K",
    trustScore: 84,
    coordinates: [-90.0715, 29.9511],
    state: "Louisiana",
    city: "New Orleans",
  },
  {
    id: "ar-1",
    owner: "Timothy Garcia",
    address: "135 River Rd, Little Rock, AR",
    value: "$310K",
    trustScore: 82,
    coordinates: [-92.2896, 34.7465],
    state: "Arkansas",
    city: "Little Rock",
  },

  // Northeast
  {
    id: "ny-1",
    owner: "Rachel Green",
    address: "246 Broadway, New York, NY",
    value: "$2.8M",
    trustScore: 93,
    coordinates: [-74.006, 40.7128],
    state: "New York",
    city: "New York",
  },
  {
    id: "ny-2",
    owner: "Jonathan Smith",
    address: "357 Wall St, New York, NY",
    value: "$3.2M",
    trustScore: 89,
    coordinates: [-74.0088, 40.7074],
    state: "New York",
    city: "New York",
  },
  {
    id: "ma-1",
    owner: "Elizabeth Johnson",
    address: "468 Harvard St, Boston, MA",
    value: "$1.4M",
    trustScore: 94,
    coordinates: [-71.0589, 42.3601],
    state: "Massachusetts",
    city: "Boston",
  },
  {
    id: "pa-1",
    owner: "Andrew Williams",
    address: "579 Liberty Bell Way, Philadelphia, PA",
    value: "$380K",
    trustScore: 87,
    coordinates: [-75.1652, 39.9526],
    state: "Pennsylvania",
    city: "Philadelphia",
  },
  {
    id: "nj-1",
    owner: "Samantha Brown",
    address: "680 Garden State Pkwy, Newark, NJ",
    value: "$520K",
    trustScore: 85,
    coordinates: [-74.1724, 40.7357],
    state: "New Jersey",
    city: "Newark",
  },
  {
    id: "ct-1",
    owner: "Matthew Davis",
    address: "791 Elm St, Hartford, CT",
    value: "$420K",
    trustScore: 88,
    coordinates: [-72.6851, 41.7658],
    state: "Connecticut",
    city: "Hartford",
  },
  {
    id: "ri-1",
    owner: "Ashley Miller",
    address: "802 Ocean Dr, Providence, RI",
    value: "$380K",
    trustScore: 86,
    coordinates: [-71.4128, 41.824],
    state: "Rhode Island",
    city: "Providence",
  },
  {
    id: "vt-1",
    owner: "Joshua Wilson",
    address: "913 Maple St, Burlington, VT",
    value: "$350K",
    trustScore: 90,
    coordinates: [-73.2121, 44.4759],
    state: "Vermont",
    city: "Burlington",
  },
  {
    id: "nh-1",
    owner: "Megan Moore",
    address: "024 Mountain View, Manchester, NH",
    value: "$320K",
    trustScore: 89,
    coordinates: [-71.4548, 42.9956],
    state: "New Hampshire",
    city: "Manchester",
  },
  {
    id: "me-1",
    owner: "Tyler Taylor",
    address: "135 Lighthouse Rd, Portland, ME",
    value: "$290K",
    trustScore: 87,
    coordinates: [-70.2568, 43.6591],
    state: "Maine",
    city: "Portland",
  },

  // Midwest
  {
    id: "il-1",
    owner: "Kimberly Jackson",
    address: "246 Michigan Ave, Chicago, IL",
    value: "$650K",
    trustScore: 88,
    coordinates: [-87.6298, 41.8781],
    state: "Illinois",
    city: "Chicago",
  },
  {
    id: "oh-1",
    owner: "Brandon Martin",
    address: "357 Buckeye Blvd, Columbus, OH",
    value: "$320K",
    trustScore: 85,
    coordinates: [-82.9988, 39.9612],
    state: "Ohio",
    city: "Columbus",
  },
  {
    id: "mi-1",
    owner: "Courtney Garcia",
    address: "468 Motor City Dr, Detroit, MI",
    value: "$180K",
    trustScore: 79,
    coordinates: [-83.0458, 42.3314],
    state: "Michigan",
    city: "Detroit",
  },
  {
    id: "in-1",
    owner: "Nathan Rodriguez",
    address: "579 Speedway Ln, Indianapolis, IN",
    value: "$250K",
    trustScore: 83,
    coordinates: [-86.1581, 39.7684],
    state: "Indiana",
    city: "Indianapolis",
  },
  {
    id: "wi-1",
    owner: "Heather Martinez",
    address: "680 Cheese St, Milwaukee, WI",
    value: "$280K",
    trustScore: 86,
    coordinates: [-87.9065, 43.0389],
    state: "Wisconsin",
    city: "Milwaukee",
  },
  {
    id: "mn-1",
    owner: "Gregory Thompson",
    address: "791 Lake St, Minneapolis, MN",
    value: "$380K",
    trustScore: 89,
    coordinates: [-93.265, 44.9778],
    state: "Minnesota",
    city: "Minneapolis",
  },
  {
    id: "ia-1",
    owner: "Crystal Lee",
    address: "802 Corn Field Rd, Des Moines, IA",
    value: "$220K",
    trustScore: 87,
    coordinates: [-93.6091, 41.5868],
    state: "Iowa",
    city: "Des Moines",
  },
  {
    id: "mo-1",
    owner: "Jeremy White",
    address: "913 Gateway Arch Dr, St. Louis, MO",
    value: "$190K",
    trustScore: 84,
    coordinates: [-90.1994, 38.627],
    state: "Missouri",
    city: "St. Louis",
  },
  {
    id: "nd-1",
    owner: "Vanessa Brown",
    address: "024 Prairie Ave, Fargo, ND",
    value: "$180K",
    trustScore: 88,
    coordinates: [-96.7898, 46.8772],
    state: "North Dakota",
    city: "Fargo",
  },
  {
    id: "sd-1",
    owner: "Austin Davis",
    address: "135 Rushmore Rd, Sioux Falls, SD",
    value: "$170K",
    trustScore: 86,
    coordinates: [-96.7311, 43.5446],
    state: "South Dakota",
    city: "Sioux Falls",
  },
  {
    id: "ne-1",
    owner: "Brittany Miller",
    address: "246 Cornhusker Way, Omaha, NE",
    value: "$200K",
    trustScore: 85,
    coordinates: [-95.9345, 41.2524],
    state: "Nebraska",
    city: "Omaha",
  },
  {
    id: "ks-1",
    owner: "Sean Wilson",
    address: "357 Sunflower St, Wichita, KS",
    value: "$160K",
    trustScore: 83,
    coordinates: [-97.3301, 37.6872],
    state: "Kansas",
    city: "Wichita",
  },

  // Mountain West
  {
    id: "mt-1",
    owner: "Tiffany Moore",
    address: "468 Big Sky Dr, Billings, MT",
    value: "$320K",
    trustScore: 87,
    coordinates: [-108.5007, 45.7833],
    state: "Montana",
    city: "Billings",
  },
  {
    id: "wy-1",
    owner: "Cody Taylor",
    address: "579 Yellowstone Ave, Cheyenne, WY",
    value: "$280K",
    trustScore: 89,
    coordinates: [-104.8202, 41.14],
    state: "Wyoming",
    city: "Cheyenne",
  },
  {
    id: "id-1",
    owner: "Melissa Jackson",
    address: "680 Potato Ln, Boise, ID",
    value: "$350K",
    trustScore: 88,
    coordinates: [-116.2146, 43.615],
    state: "Idaho",
    city: "Boise",
  },

  // Alaska & Hawaii
  {
    id: "ak-1",
    owner: "Derek Martin",
    address: "791 Glacier Bay Rd, Anchorage, AK",
    value: "$420K",
    trustScore: 91,
    coordinates: [-149.9003, 61.2181],
    state: "Alaska",
    city: "Anchorage",
  },
  {
    id: "hi-1",
    owner: "Jasmine Garcia",
    address: "802 Aloha Dr, Honolulu, HI",
    value: "$980K",
    trustScore: 93,
    coordinates: [-157.8583, 21.3099],
    state: "Hawaii",
    city: "Honolulu",
  },

  // Additional states
  {
    id: "ok-1",
    owner: "Travis Rodriguez",
    address: "913 Oil Rig Rd, Oklahoma City, OK",
    value: "$210K",
    trustScore: 82,
    coordinates: [-97.5164, 35.4676],
    state: "Oklahoma",
    city: "Oklahoma City",
  },
  {
    id: "wv-1",
    owner: "Amber Martinez",
    address: "024 Coal Mine Ave, Charleston, WV",
    value: "$150K",
    trustScore: 84,
    coordinates: [-81.6326, 38.3498],
    state: "West Virginia",
    city: "Charleston",
  },
  {
    id: "ky-1",
    owner: "Jordan Thompson",
    address: "135 Bourbon Trail, Louisville, KY",
    value: "$240K",
    trustScore: 86,
    coordinates: [-85.7585, 38.2527],
    state: "Kentucky",
    city: "Louisville",
  },
  {
    id: "va-1",
    owner: "Danielle Lee",
    address: "246 Colonial Dr, Richmond, VA",
    value: "$380K",
    trustScore: 88,
    coordinates: [-77.436, 37.5407],
    state: "Virginia",
    city: "Richmond",
  },
  {
    id: "md-1",
    owner: "Kyle White",
    address: "357 Crab Cake Ln, Baltimore, MD",
    value: "$320K",
    trustScore: 87,
    coordinates: [-76.6122, 39.2904],
    state: "Maryland",
    city: "Baltimore",
  },
  {
    id: "de-1",
    owner: "Alexis Brown",
    address: "468 First State St, Wilmington, DE",
    value: "$280K",
    trustScore: 85,
    coordinates: [-75.5277, 39.7391],
    state: "Delaware",
    city: "Wilmington",
  },
]

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ properties = stateProperties, onPropertySelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng, setLng] = useState(-98.5795)
  const [lat, setLat] = useState(39.8283)
  const [zoom, setZoom] = useState(4)
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v11")
  const [isLoading, setIsLoading] = useState(true)

  const mapStyles = {
    street: "mapbox://styles/mapbox/streets-v12",
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    light: "mapbox://styles/mapbox/light-v11",
    dark: "mapbox://styles/mapbox/dark-v11",
  }

  useEffect(() => {
    if (map.current) return // Initialize map only once

    const initializeMap = async () => {
      if (mapContainer.current) {
        try {
          setIsLoading(true)
          // Fetch Mapbox token from secure server-side API
          const response = await fetch("/api/mapbox-token")
          const data = await response.json()

          if (!data.token) {
            console.error("Failed to get Mapbox token")
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

          // Add property markers for all states
          properties.forEach((property) => {
            const el = document.createElement("div")
            el.className = "marker"
            el.style.backgroundColor =
              property.trustScore >= 90 ? "#10b981" : property.trustScore >= 80 ? "#f59e0b" : "#ef4444"
            el.style.width = "24px"
            el.style.height = "24px"
            el.style.borderRadius = "50%"
            el.style.cursor = "pointer"
            el.style.border = "3px solid white"
            el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)"
            el.style.transition = "all 0.2s ease"

            el.addEventListener("mouseenter", () => {
              el.style.transform = "scale(1.2)"
            })

            el.addEventListener("mouseleave", () => {
              el.style.transform = "scale(1)"
            })

            el.addEventListener("click", () => {
              onPropertySelect?.(property)
            })

            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: true,
              closeOnClick: false,
            }).setHTML(
              `<div class="p-3 min-w-[200px]">
                <h3 class="font-semibold text-lg mb-1">${property.owner}</h3>
                <p class="text-sm text-gray-600 mb-1">${property.city}, ${property.state}</p>
                <p class="text-xs text-gray-500 mb-2">${property.address}</p>
                <p class="text-lg font-bold text-green-600 mb-2">${property.value}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Trust Score:</span>
                  <span class="text-sm font-semibold ${property.trustScore >= 90 ? "text-green-600" : property.trustScore >= 80 ? "text-yellow-600" : "text-red-600"}">${property.trustScore}%</span>
                </div>
                <button class="mt-2 w-full bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700">
                  View Details
                </button>
              </div>`,
            )

            new mapboxgl.Marker(el).setLngLat(property.coordinates).setPopup(popup).addTo(map.current!)
          })
        } catch (error) {
          console.error("Error initializing map:", error)
          setIsLoading(false)
        }
      }
    }

    initializeMap()
  }, [lng, lat, zoom, properties, onPropertySelect, mapStyle])

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

      {/* Legend */}
      <div className="absolute top-4 right-20 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="font-semibold text-sm mb-2">Trust Score Legend</h4>
        <div className="space-y-1 text-xs">
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
        </div>
      </div>
    </div>
  )
}

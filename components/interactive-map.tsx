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
  totalValue?: string
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
  // Additional California properties
  {
    id: "ca-3",
    owner: "Jennifer Park",
    address: "789 Silicon Valley Dr, San Jose, CA",
    value: "$1.4M",
    trustScore: 91,
    coordinates: [-121.8863, 37.3382],
    state: "California",
    city: "San Jose",
  },
  {
    id: "ca-4",
    owner: "Robert Kim",
    address: "321 Beach Walk, Santa Monica, CA",
    value: "$2.8M",
    trustScore: 94,
    coordinates: [-118.4912, 34.0195],
    state: "California",
    city: "Santa Monica",
  },
  {
    id: "ca-5",
    owner: "Maria Santos",
    address: "654 Wine Country Rd, Napa, CA",
    value: "$1.9M",
    trustScore: 89,
    coordinates: [-122.2869, 38.2975],
    state: "California",
    city: "Napa",
  },

  // Additional New York properties
  {
    id: "ny-3",
    owner: "David Chen",
    address: "456 Park Ave, New York, NY",
    value: "$4.2M",
    trustScore: 96,
    coordinates: [-73.9712, 40.7589],
    state: "New York",
    city: "New York",
  },
  {
    id: "ny-4",
    owner: "Sarah Williams",
    address: "789 Brooklyn Heights, Brooklyn, NY",
    value: "$1.6M",
    trustScore: 87,
    coordinates: [-73.9969, 40.6962],
    state: "New York",
    city: "Brooklyn",
  },
  {
    id: "ny-5",
    owner: "Michael Rodriguez",
    address: "123 Long Island Ave, Nassau, NY",
    value: "$980K",
    trustScore: 85,
    coordinates: [-73.5594, 40.6546],
    state: "New York",
    city: "Nassau",
  },

  // Additional Texas properties
  {
    id: "tx-4",
    owner: "Lisa Johnson",
    address: "456 River Walk, San Antonio, TX",
    value: "$520K",
    trustScore: 88,
    coordinates: [-98.4936, 29.4241],
    state: "Texas",
    city: "San Antonio",
  },
  {
    id: "tx-5",
    owner: "Carlos Martinez",
    address: "789 Tech District, Austin, TX",
    value: "$890K",
    trustScore: 92,
    coordinates: [-97.7431, 30.2672],
    state: "Texas",
    city: "Austin",
  },

  // Additional Florida properties
  {
    id: "fl-3",
    owner: "Jennifer Lopez",
    address: "321 Art Deco Dr, Miami Beach, FL",
    value: "$1.8M",
    trustScore: 90,
    coordinates: [-80.13, 25.7907],
    state: "Florida",
    city: "Miami Beach",
  },
  {
    id: "fl-4",
    owner: "Robert Taylor",
    address: "654 Disney World Blvd, Orlando, FL",
    value: "$420K",
    trustScore: 84,
    coordinates: [-81.3792, 28.5383],
    state: "Florida",
    city: "Orlando",
  },

  // Additional Washington properties
  {
    id: "wa-2",
    owner: "Amanda Chen",
    address: "987 Tech Campus Dr, Redmond, WA",
    value: "$1.1M",
    trustScore: 93,
    coordinates: [-122.1215, 47.674],
    state: "Washington",
    city: "Redmond",
  },
  {
    id: "wa-3",
    owner: "Kevin Park",
    address: "147 Coffee St, Starbucks, WA",
    value: "$780K",
    trustScore: 86,
    coordinates: [-122.2015, 47.6101],
    state: "Washington",
    city: "Seattle",
  },

  // Additional Illinois properties
  {
    id: "il-2",
    owner: "Michelle Davis",
    address: "258 Magnificent Mile, Chicago, IL",
    value: "$890K",
    trustScore: 91,
    coordinates: [-87.6244, 41.8955],
    state: "Illinois",
    city: "Chicago",
  },
  {
    id: "il-3",
    owner: "Thomas Wilson",
    address: "369 Navy Pier Dr, Chicago, IL",
    value: "$1.2M",
    trustScore: 88,
    coordinates: [-87.6056, 41.8919],
    state: "Illinois",
    city: "Chicago",
  },

  // Additional Massachusetts properties
  {
    id: "ma-2",
    owner: "Patricia Brown",
    address: "470 MIT Campus, Cambridge, MA",
    value: "$1.6M",
    trustScore: 95,
    coordinates: [-71.0942, 42.3601],
    state: "Massachusetts",
    city: "Cambridge",
  },
  {
    id: "ma-3",
    owner: "Daniel Kim",
    address: "581 Fenway Park Dr, Boston, MA",
    value: "$1.3M",
    trustScore: 89,
    coordinates: [-71.0972, 42.3467],
    state: "Massachusetts",
    city: "Boston",
  },

  // Additional Georgia properties
  {
    id: "ga-2",
    owner: "Ashley Martinez",
    address: "692 CNN Center, Atlanta, GA",
    value: "$620K",
    trustScore: 90,
    coordinates: [-84.3951, 33.7573],
    state: "Georgia",
    city: "Atlanta",
  },
  {
    id: "ga-3",
    owner: "Ryan Thompson",
    address: "703 Savannah Historic, Savannah, GA",
    value: "$450K",
    trustScore: 87,
    coordinates: [-81.0998, 32.0835],
    state: "Georgia",
    city: "Savannah",
  },

  // Additional Colorado properties
  {
    id: "co-2",
    owner: "Stephanie Lee",
    address: "814 Ski Resort Dr, Aspen, CO",
    value: "$2.4M",
    trustScore: 92,
    coordinates: [-106.8175, 39.1911],
    state: "Colorado",
    city: "Aspen",
  },
  {
    id: "co-3",
    owner: "Brandon White",
    address: "925 Boulder Creek, Boulder, CO",
    value: "$850K",
    trustScore: 88,
    coordinates: [-105.2705, 40.015],
    state: "Colorado",
    city: "Boulder",
  },

  // Additional Nevada properties
  {
    id: "nv-2",
    owner: "Crystal Garcia",
    address: "036 Lake Tahoe Dr, Reno, NV",
    value: "$680K",
    trustScore: 85,
    coordinates: [-119.7674, 39.5296],
    state: "Nevada",
    city: "Reno",
  },

  // Additional Oregon properties
  {
    id: "or-2",
    owner: "Justin Rodriguez",
    address: "147 Crater Lake Ave, Eugene, OR",
    value: "$520K",
    trustScore: 86,
    coordinates: [-123.0868, 44.0521],
    state: "Oregon",
    city: "Eugene",
  },

  // Additional Arizona properties
  {
    id: "az-2",
    owner: "Monica Johnson",
    address: "258 Grand Canyon Dr, Scottsdale, AZ",
    value: "$780K",
    trustScore: 89,
    coordinates: [-111.9261, 33.4942],
    state: "Arizona",
    city: "Scottsdale",
  },

  // Additional North Carolina properties
  {
    id: "nc-2",
    owner: "Tyler Davis",
    address: "369 Research Triangle, Raleigh, NC",
    value: "$480K",
    trustScore: 91,
    coordinates: [-78.6382, 35.7796],
    state: "North Carolina",
    city: "Raleigh",
  },

  // Additional Virginia properties
  {
    id: "va-2",
    owner: "Samantha Wilson",
    address: "470 Pentagon Dr, Arlington, VA",
    value: "$720K",
    trustScore: 93,
    coordinates: [-77.0369, 38.8816],
    state: "Virginia",
    city: "Arlington",
  },

  // Additional Pennsylvania properties
  {
    id: "pa-2",
    owner: "Christopher Brown",
    address: "581 Liberty Bell Way, Pittsburgh, PA",
    value: "$340K",
    trustScore: 84,
    coordinates: [-79.9959, 40.4406],
    state: "Pennsylvania",
    city: "Pittsburgh",
  },

  // Additional Ohio properties
  {
    id: "oh-2",
    owner: "Rachel Miller",
    address: "692 Rock Hall Dr, Cleveland, OH",
    value: "$280K",
    trustScore: 82,
    coordinates: [-81.6944, 41.4993],
    state: "Ohio",
    city: "Cleveland",
  },

  // Additional Michigan properties
  {
    id: "mi-2",
    owner: "Anthony Taylor",
    address: "703 Great Lakes Ave, Grand Rapids, MI",
    value: "$220K",
    trustScore: 80,
    coordinates: [-85.6681, 42.9634],
    state: "Michigan",
    city: "Grand Rapids",
  },

  // Additional Tennessee properties
  {
    id: "tn-2",
    owner: "Melissa Jackson",
    address: "814 Graceland Dr, Memphis, TN",
    value: "$380K",
    trustScore: 85,
    coordinates: [-90.049, 35.1495],
    state: "Tennessee",
    city: "Memphis",
  },

  // Additional Louisiana properties
  {
    id: "la-2",
    owner: "Jordan Martin",
    address: "925 Jazz Festival St, New Orleans, LA",
    value: "$520K",
    trustScore: 87,
    coordinates: [-90.0715, 29.9511],
    state: "Louisiana",
    city: "New Orleans",
  },

  // Additional Minnesota properties
  {
    id: "mn-2",
    owner: "Nicole Garcia",
    address: "036 Mall of America Dr, Bloomington, MN",
    value: "$420K",
    trustScore: 88,
    coordinates: [-93.2424, 44.8548],
    state: "Minnesota",
    city: "Bloomington",
  },

  // Additional Wisconsin properties
  {
    id: "wi-2",
    owner: "Derek Rodriguez",
    address: "147 Lambeau Field Dr, Green Bay, WI",
    value: "$320K",
    trustScore: 84,
    coordinates: [-88.0133, 44.5013],
    state: "Wisconsin",
    city: "Green Bay",
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

      // Enhanced popup with more details
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
            <button class="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors">
              View Details
            </button>
            <button class="flex-1 bg-gray-100 text-gray-700 text-xs py-2 px-3 rounded hover:bg-gray-200 transition-colors">
              Save Property
            </button>
          </div>
        </div>`,
      )

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

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const address = searchParams.get("address")

  try {
    // Google Places API for nearby amenities
    const placesResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=school|hospital|transit_station&key=${process.env.GOOGLE_MAPS_API_KEY!}`,
    )
    const placesData = await placesResponse.json()

    // Census API for demographic data
    const censusResponse = await fetch(
      `https://api.census.gov/data/2021/acs/acs5?get=B25064_001E,B19013_001E,B08303_001E&for=tract:*&in=state:06&key=${process.env.CENSUS_API_KEY!}`,
    )
    const censusData = await censusResponse.json()

    // Process and categorize places
    const schools =
      placesData.results
        ?.filter((place: any) => place.types.includes("school") || place.types.includes("university"))
        .slice(0, 5) || []

    const hospitals =
      placesData.results
        ?.filter((place: any) => place.types.includes("hospital") || place.types.includes("health"))
        .slice(0, 3) || []

    const transit =
      placesData.results
        ?.filter((place: any) => place.types.includes("transit_station") || place.types.includes("subway_station"))
        .slice(0, 3) || []

    return NextResponse.json({
      schools: schools.map((school: any) => ({
        name: school.name,
        rating: school.rating || "N/A",
        distance: calculateDistance(
          Number.parseFloat(lat!),
          Number.parseFloat(lng!),
          school.geometry.location.lat,
          school.geometry.location.lng,
        ),
      })),
      hospitals: hospitals.map((hospital: any) => ({
        name: hospital.name,
        rating: hospital.rating || "N/A",
        distance: calculateDistance(
          Number.parseFloat(lat!),
          Number.parseFloat(lng!),
          hospital.geometry.location.lat,
          hospital.geometry.location.lng,
        ),
      })),
      transit: transit.map((station: any) => ({
        name: station.name,
        distance: calculateDistance(
          Number.parseFloat(lat!),
          Number.parseFloat(lng!),
          station.geometry.location.lat,
          station.geometry.location.lng,
        ),
      })),
      demographics: censusData,
    })
  } catch (error) {
    console.error("Neighborhood API Error:", error)
    return NextResponse.json({ error: "Failed to fetch neighborhood data" }, { status: 500 })
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return `${distance.toFixed(1)} mi`
}

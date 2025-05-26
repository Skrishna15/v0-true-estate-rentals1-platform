import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use server-only environment variable (without NEXT_PUBLIC_ prefix)
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN

    if (!mapboxToken) {
      return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
    }

    return NextResponse.json({ token: mapboxToken })
  } catch (error) {
    console.error("Error fetching Mapbox token:", error)
    return NextResponse.json({ error: "Failed to fetch Mapbox token" }, { status: 500 })
  }
}

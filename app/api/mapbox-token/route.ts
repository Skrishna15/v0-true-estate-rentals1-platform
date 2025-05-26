import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use server-side environment variable (not exposed to client)
    const token = process.env.MAPBOX_ACCESS_TOKEN

    if (!token) {
      console.error("MAPBOX_ACCESS_TOKEN not configured in server environment")
      return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Mapbox token API error:", error)
    return NextResponse.json({ error: "Failed to get Mapbox token" }, { status: 500 })
  }
}

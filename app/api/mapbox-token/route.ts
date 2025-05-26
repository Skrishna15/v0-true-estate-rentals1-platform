import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use the secure server-side environment variable (without NEXT_PUBLIC_ prefix)
    const token = process.env.MAPBOX_ACCESS_TOKEN

    if (!token) {
      return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Mapbox token API error:", error)
    return NextResponse.json({ error: "Failed to get Mapbox token" }, { status: 500 })
  }
}

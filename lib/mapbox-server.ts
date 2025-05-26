"use server"

export async function getMapboxToken(): Promise<string | null> {
  try {
    // Server-only environment variable access
    const token = process.env.MAPBOX_ACCESS_TOKEN

    if (!token) {
      console.error("MAPBOX_ACCESS_TOKEN environment variable is not set")
      return null
    }

    return token
  } catch (error) {
    console.error("Error accessing Mapbox token:", error)
    return null
  }
}

export async function validateMapboxToken(): Promise<boolean> {
  try {
    const token = await getMapboxToken()
    if (!token) return false

    // Basic token format validation
    return token.startsWith("pk.") && token.length > 50
  } catch (error) {
    console.error("Error validating Mapbox token:", error)
    return false
  }
}

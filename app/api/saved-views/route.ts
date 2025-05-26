import { type NextRequest, NextResponse } from "next/server"

// Mock saved views for development
const mockSavedViews: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  try {
    const userViews = mockSavedViews.filter(
      (view) => view.userId === userId || view.isPublic || view.sharedWith?.includes(userId),
    )

    return NextResponse.json({
      views: userViews,
      success: true,
    })
  } catch (error) {
    console.error("Saved views fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch saved views" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, description, mapState, isPublic, sharedWith } = await request.json()

    if (!userId || !name || !mapState) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const savedView = {
      _id: `view_${Date.now()}`,
      userId,
      name,
      description: description || "",
      mapState,
      isPublic: isPublic || false,
      sharedWith: sharedWith || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockSavedViews.push(savedView)

    return NextResponse.json({
      success: true,
      viewId: savedView._id,
    })
  } catch (error) {
    console.error("Saved view creation error:", error)
    return NextResponse.json({ error: "Failed to create saved view" }, { status: 500 })
  }
}

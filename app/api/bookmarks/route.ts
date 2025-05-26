import { type NextRequest, NextResponse } from "next/server"

// Mock database for development - replace with actual MongoDB in production
const mockBookmarks: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  try {
    // Filter bookmarks for this user
    const userBookmarks = mockBookmarks.filter((bookmark) => bookmark.userId === userId)

    return NextResponse.json({
      bookmarks: userBookmarks,
      success: true,
    })
  } catch (error) {
    console.error("Bookmarks fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, propertyId, propertyData, notes, tags } = await request.json()

    if (!userId || !propertyId) {
      return NextResponse.json({ error: "User ID and Property ID required" }, { status: 400 })
    }

    // Check if already bookmarked
    const existing = mockBookmarks.find((bookmark) => bookmark.userId === userId && bookmark.propertyId === propertyId)

    if (existing) {
      return NextResponse.json({ error: "Property already bookmarked" }, { status: 400 })
    }

    const bookmark = {
      _id: `bookmark_${Date.now()}`,
      userId,
      propertyId,
      propertyData,
      notes: notes || "",
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockBookmarks.push(bookmark)

    return NextResponse.json({
      success: true,
      bookmarkId: bookmark._id,
    })
  } catch (error) {
    console.error("Bookmark creation error:", error)
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookmarkId = searchParams.get("id")
  const propertyId = searchParams.get("propertyId")
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  if (!bookmarkId && !propertyId) {
    return NextResponse.json({ error: "Bookmark ID or Property ID required" }, { status: 400 })
  }

  try {
    let index = -1

    if (bookmarkId) {
      index = mockBookmarks.findIndex((bookmark) => bookmark._id === bookmarkId && bookmark.userId === userId)
    } else if (propertyId) {
      index = mockBookmarks.findIndex((bookmark) => bookmark.propertyId === propertyId && bookmark.userId === userId)
    }

    if (index === -1) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 })
    }

    mockBookmarks.splice(index, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Bookmark deletion error:", error)
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"

// Mock notifications for development
const mockNotifications: any[] = [
  {
    _id: "notif_1",
    userId: "demo-user",
    type: "new_listing",
    title: "New Property Alert",
    message: "A new verified property matching your criteria has been listed in San Francisco",
    data: { propertyId: "prop_sf_001" },
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    _id: "notif_2",
    userId: "demo-user",
    type: "price_change",
    title: "Price Drop Alert",
    message: "Property at 123 Oak Street has dropped in price by $50,000",
    data: { propertyId: "prop_sf_001", oldPrice: 1900000, newPrice: 1850000 },
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const unreadOnly = searchParams.get("unreadOnly") === "true"

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  try {
    let userNotifications = mockNotifications.filter((notif) => notif.userId === userId)

    if (unreadOnly) {
      userNotifications = userNotifications.filter((notif) => !notif.read)
    }

    const unreadCount = mockNotifications.filter((notif) => notif.userId === userId && !notif.read).length

    return NextResponse.json({
      notifications: userNotifications,
      unreadCount,
      success: true,
    })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, message, data } = await request.json()

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const notification = {
      _id: `notif_${Date.now()}`,
      userId,
      type,
      title,
      message,
      data: data || {},
      read: false,
      createdAt: new Date().toISOString(),
    }

    mockNotifications.push(notification)

    return NextResponse.json({
      success: true,
      notificationId: notification._id,
    })
  } catch (error) {
    console.error("Notification creation error:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { notificationIds, markAsRead } = await request.json()

    if (!Array.isArray(notificationIds)) {
      return NextResponse.json({ error: "Invalid notification IDs" }, { status: 400 })
    }

    let modifiedCount = 0

    mockNotifications.forEach((notif) => {
      if (notificationIds.includes(notif._id)) {
        notif.read = markAsRead
        modifiedCount++
      }
    })

    return NextResponse.json({
      success: true,
      modifiedCount,
    })
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}

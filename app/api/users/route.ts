import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: userData.email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const newUser: Omit<User, "_id"> = {
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      role: userData.role || "renter",
      verified: false,
      trustScore: 50, // Default trust score
      profile: {
        phone: userData.phone,
        bio: userData.bio,
        company: userData.company,
        verificationData: {
          identityVerified: false,
          backgroundCheck: false,
          professionalProfile: false,
          businessEntity: false,
          lastVerified: new Date(),
        },
      },
      savedProperties: [],
      searchHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)

    return NextResponse.json({
      success: true,
      userId: result.insertedId,
    })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    if (email) {
      const user = await usersCollection.findOne({ email })
      return NextResponse.json({
        user,
        success: true,
      })
    }

    const users = await usersCollection.find({}).limit(50).toArray()
    return NextResponse.json({
      users,
      success: true,
    })
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

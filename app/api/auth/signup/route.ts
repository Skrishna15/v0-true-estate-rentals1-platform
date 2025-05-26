import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = "renter" } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser: Omit<User, "_id"> = {
      email,
      password: hashedPassword,
      name,
      role: role as User["role"],
      verified: false,
      profile: {
        joinedDate: new Date(),
        lastActive: new Date(),
        preferences: {
          notifications: true,
          emailUpdates: true,
          marketingEmails: false,
        },
      },
      permissions: {
        canCreateListings: role === "owner" || role === "agent",
        canModerate: role === "admin",
        canExportData: true,
        canViewAnalytics: role !== "renter",
      },
      subscription: {
        plan: "free",
        status: "active",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)

    return NextResponse.json({
      success: true,
      userId: result.insertedId,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

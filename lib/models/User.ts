import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  name: string
  avatar?: string
  role: "renter" | "owner" | "agent" | "admin"
  verified: boolean
  trustScore: number
  profile: {
    phone?: string
    bio?: string
    company?: string
    linkedinUrl?: string
    verificationData?: {
      identityVerified: boolean
      backgroundCheck: boolean
      professionalProfile: boolean
      businessEntity: boolean
      lastVerified: Date
    }
  }
  properties?: ObjectId[] // For property owners
  savedProperties: ObjectId[]
  searchHistory: {
    query: string
    timestamp: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

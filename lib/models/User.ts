import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: "admin" | "owner" | "agent" | "renter"
  verified: boolean
  avatar?: string
  phone?: string
  company?: string
  profile: {
    bio?: string
    location?: string
    joinedDate: Date
    lastActive: Date
    preferences: {
      notifications: boolean
      emailUpdates: boolean
      marketingEmails: boolean
    }
  }
  permissions: {
    canCreateListings: boolean
    canModerate: boolean
    canExportData: boolean
    canViewAnalytics: boolean
  }
  subscription?: {
    plan: "free" | "basic" | "premium" | "enterprise"
    status: "active" | "cancelled" | "expired"
    expiresAt?: Date
  }
  savedProperties: ObjectId[]
  searchHistory: {
    query: string
    timestamp: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface Owner extends User {
  ownerProfile: {
    netWorth: number
    netWorthConfidence: number
    verificationStatus: {
      identity: boolean
      background: boolean
      financial: boolean
      business: boolean
    }
    portfolio: {
      totalProperties: number
      totalValue: number
      locations: string[]
      propertyTypes: string[]
    }
    trustMetrics: {
      averageRating: number
      totalReviews: number
      responseRate: number
      responseTime: number // hours
    }
    businessInfo?: {
      companyName: string
      licenseNumber: string
      businessType: "individual" | "llc" | "corporation" | "partnership"
      taxId?: string
    }
  }
}

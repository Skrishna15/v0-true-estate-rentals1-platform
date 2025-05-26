import type { ObjectId } from "mongodb"

export interface Team {
  _id?: ObjectId
  name: string
  description?: string
  ownerId: ObjectId
  members: {
    userId: ObjectId
    role: "admin" | "member" | "viewer"
    joinedAt: Date
  }[]
  settings: {
    allowMemberInvites: boolean
    defaultRole: "member" | "viewer"
  }
  createdAt: Date
  updatedAt: Date
}

export interface SharedCollection {
  _id?: ObjectId
  teamId: ObjectId
  name: string
  description?: string
  createdBy: ObjectId
  properties: {
    propertyId: string
    addedBy: ObjectId
    addedAt: Date
    notes?: string
  }[]
  collaborators: ObjectId[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TeamActivity {
  _id?: ObjectId
  teamId: ObjectId
  userId: ObjectId
  userName: string
  action: "added_property" | "created_collection" | "shared_view" | "added_note" | "exported_data"
  details: {
    propertyId?: string
    collectionId?: ObjectId
    description: string
  }
  createdAt: Date
}

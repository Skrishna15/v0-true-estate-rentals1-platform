"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Users, Building, Flag, BarChart3, Shield, CheckCircle, Eye, Edit, Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminStats {
  totalUsers: number
  totalProperties: number
  verifiedOwners: number
  flaggedProperties: number
  totalRevenue: number
  activeSubscriptions: number
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  verified: boolean
  createdAt: string
  lastActive: string
  subscription?: {
    plan: string
    status: string
  }
}

interface Property {
  _id: string
  address: {
    street: string
    city: string
    state: string
  }
  owner: {
    name: string
    verified: boolean
  }
  transparencyScore: number
  flagged: boolean
  flagReason?: string
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session || session.user.role !== "admin") {
      router.push("/")
      return
    }

    fetchAdminData()
  }, [session, status, router])

  const fetchAdminData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalUsers: 15420,
        totalProperties: 8750,
        verifiedOwners: 3200,
        flaggedProperties: 45,
        totalRevenue: 125000,
        activeSubscriptions: 2100,
      })

      setUsers([
        {
          _id: "1",
          name: "John Smith",
          email: "john@example.com",
          role: "owner",
          verified: true,
          createdAt: "2024-01-15",
          lastActive: "2024-01-20",
          subscription: { plan: "premium", status: "active" },
        },
        {
          _id: "2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          role: "renter",
          verified: false,
          createdAt: "2024-01-10",
          lastActive: "2024-01-19",
          subscription: { plan: "free", status: "active" },
        },
      ])

      setProperties([
        {
          _id: "1",
          address: { street: "123 Main St", city: "San Francisco", state: "CA" },
          owner: { name: "John Smith", verified: true },
          transparencyScore: 85,
          flagged: false,
          createdAt: "2024-01-15",
        },
        {
          _id: "2",
          address: { street: "456 Oak Ave", city: "Los Angeles", state: "CA" },
          owner: { name: "Jane Doe", verified: false },
          transparencyScore: 45,
          flagged: true,
          flagReason: "Suspicious pricing",
          createdAt: "2024-01-12",
        },
      ])
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: "verify" | "suspend" | "delete") => {
    try {
      // Mock action - replace with actual API call
      console.log(`Performing ${action} on user ${userId}`)
      fetchAdminData()
    } catch (error) {
      console.error("Failed to perform user action:", error)
    }
  }

  const handlePropertyAction = async (propertyId: string, action: "approve" | "flag" | "remove") => {
    try {
      // Mock action - replace with actual API call
      console.log(`Performing ${action} on property ${propertyId}`)
      fetchAdminData()
    } catch (error) {
      console.error("Failed to perform property action:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, properties, and platform operations</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Properties</p>
                    <p className="text-2xl font-bold">{stats.totalProperties.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Verified Owners</p>
                    <p className="text-2xl font-bold">{stats.verifiedOwners.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Flag className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Flagged</p>
                    <p className="text-2xl font-bold">{stats.flaggedProperties.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Subs</p>
                    <p className="text-2xl font-bold">{stats.activeSubscriptions.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="properties">Property Moderation</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts, roles, and verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Input placeholder="Search users..." className="w-64" />
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="renter">Renter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={user.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            {user.verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.subscription && (
                            <Badge
                              className={
                                user.subscription.status === "active"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {user.subscription.plan}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleUserAction(user._id, "verify")}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleUserAction(user._id, "delete")}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Property Moderation */}
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Property Moderation</CardTitle>
                <CardDescription>Review flagged properties and manage listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Input placeholder="Search properties..." className="w-64" />
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Transparency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{property.address.street}</div>
                            <div className="text-sm text-gray-500">
                              {property.address.city}, {property.address.state}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{property.owner.name}</span>
                            {property.owner.verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{property.transparencyScore}%</span>
                            <Badge
                              className={
                                property.transparencyScore >= 80
                                  ? "bg-green-100 text-green-800"
                                  : property.transparencyScore >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {property.transparencyScore >= 80
                                ? "High"
                                : property.transparencyScore >= 60
                                  ? "Medium"
                                  : "Low"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {property.flagged ? (
                            <Badge className="bg-red-100 text-red-800">
                              <Flag className="w-3 h-3 mr-1" />
                              Flagged
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(property.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePropertyAction(property._id, "approve")}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePropertyAction(property._id, "flag")}
                            >
                              <Flag className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePropertyAction(property._id, "remove")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Management */}
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Company Management</CardTitle>
                <CardDescription>Manage real estate companies and their employees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Company Management</h3>
                  <p className="text-gray-600 mb-4">Manage real estate companies, their employees, and permissions</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">User growth chart placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Revenue chart placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Property distribution map</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trust Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Trust score histogram</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

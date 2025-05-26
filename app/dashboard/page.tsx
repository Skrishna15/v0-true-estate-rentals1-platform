"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Shield } from "lucide-react"

const DashboardPage = () => {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="container py-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-24" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-40" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-24" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-40" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-24" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-40" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Add after the loading check and before the main dashboard content
  const getRoleSpecificContent = () => {
    switch (session?.user.role) {
      case "admin":
        return {
          title: "Admin Dashboard",
          subtitle: "Manage users, properties, and platform operations",
          features: ["User Management", "Property Moderation", "Analytics", "System Settings"],
          primaryAction: { label: "Admin Panel", href: "/admin" },
        }
      case "agent":
        return {
          title: "Agent Dashboard",
          subtitle: "Manage your listings and client relationships",
          features: ["Property Listings", "Client Management", "Lead Generation", "Market Analytics"],
          primaryAction: { label: "Add Listing", href: "/properties/new" },
        }
      case "owner":
        return {
          title: "Owner Dashboard",
          subtitle: "Track your property portfolio and tenant relationships",
          features: ["Portfolio Overview", "Tenant Management", "Financial Reports", "Maintenance Requests"],
          primaryAction: { label: "Add Property", href: "/properties/new" },
        }
      default:
        return {
          title: "User Dashboard",
          subtitle: "Search properties and manage your favorites",
          features: ["Property Search", "Saved Properties", "Market Insights", "Rental History"],
          primaryAction: { label: "Search Properties", href: "/properties" },
        }
    }
  }

  const roleContent = getRoleSpecificContent()

  return (
    <div className="container py-10">
      {/* Replace the existing welcome section with: */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{roleContent.title}</h1>
        <p className="text-gray-600">{roleContent.subtitle}</p>
        <div className="mt-4 flex items-center gap-4">
          <Button asChild>
            <Link href={roleContent.primaryAction.href}>{roleContent.primaryAction.label}</Link>
          </Button>
          {session?.user.role === "admin" && (
            <Button variant="outline" asChild>
              <Link href="/admin">
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Properties</CardTitle>
            <CardDescription>All properties in the database</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">1,457</p>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground">Updated 1 minute ago</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Users active in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">23,502</p>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground">Updated 1 minute ago</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Listings</CardTitle>
            <CardDescription>Properties added in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">235</p>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground">Updated 1 minute ago</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage

"use client"

import { useState, useEffect } from "react"
import { User, LogOut, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function AuthHeader() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Check for NextAuth session first
      if (session?.user) {
        setUser({
          name: session.user.name || "User",
          email: session.user.email || "",
          role: "user", // Default role, can be enhanced
          image: session.user.image,
        })
      } else {
        // Fallback to localStorage for demo users
        const userData = localStorage.getItem("trueestate_user")
        if (userData) {
          try {
            setUser(JSON.parse(userData))
          } catch (error) {
            console.error("Error parsing user data:", error)
            localStorage.removeItem("trueestate_user")
          }
        }
      }
    }
  }, [session, mounted])

  const handleSignOut = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("trueestate_user")

      // If using NextAuth session, sign out properly
      if (session) {
        await signOut({
          redirect: false,
          callbackUrl: "/",
        })
      }

      // Clear user state
      setUser(null)

      // Force redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      // Force redirect even if there's an error
      window.location.href = "/"
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>
      case "agent":
        return <Badge className="bg-green-100 text-green-800">Agent</Badge>
      case "user":
        return <Badge className="bg-blue-100 text-blue-800">User</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">User</Badge>
    }
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    )
  }

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    )
  }

  // If no user is logged in, show sign in/up buttons
  if (!user && !session) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => router.push("/auth/signin")}>
          Sign In
        </Button>
        <Button onClick={() => router.push("/auth/signup")}>Sign Up</Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || "/placeholder-user.jpg"} alt={user?.name || "User"} />
            <AvatarFallback>
              {user?.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              {getRoleBadge(user?.role)}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {user?.role === "admin" && (
          <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Dashboard</span>
          </DropdownMenuItem>
        )}
        {user?.role === "agent" && (
          <DropdownMenuItem onClick={() => router.push("/agent/dashboard")}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Agent Dashboard</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

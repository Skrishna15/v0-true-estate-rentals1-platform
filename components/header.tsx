"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Building, User, LogOut, Settings, Bell, Menu, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { data: session, status } = useSession()
  const [notifications] = useState(2)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut({
        callbackUrl: "/",
        redirect: false,
      })
      // Force navigation to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      // Fallback: force redirect
      window.location.href = "/"
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50 px-4 py-3">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <Link href={session ? "/wealth-map" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:block">TrueEstate</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="flex">
            <div className="flex-1 relative">
              <Input
                placeholder="Search properties, owners, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="rounded-r-none border-r-0 focus:border-blue-500"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="rounded-l-none px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-l-0"
              variant="outline"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer" disabled={isSigningOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/signin">
                <User className="w-4 h-4 mr-2" />
                Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

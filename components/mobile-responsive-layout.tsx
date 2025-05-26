"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, Search, Filter, MapPin, Phone, Mail, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, Shield } from "lucide-react"

interface MobileResponsiveLayoutProps {
  children: React.ReactNode
  showMobileNav?: boolean
  propertyData?: {
    price: string
    address: string
    owner: string
    phone?: string
    email?: string
  }
}

export function MobileResponsiveLayout({ children, showMobileNav = true, propertyData }: MobileResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const userData = localStorage.getItem("trueestate_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("trueestate_user")
    window.location.href = "/"
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>
      case "agent":
        return <Badge className="bg-green-100 text-green-800">Agent</Badge>
      case "user":
        return <Badge className="bg-blue-100 text-blue-800">User</Badge>
      default:
        return null
    }
  }

  const quickActions = [
    { icon: Phone, label: "Call", action: () => console.log("Call owner") },
    { icon: Mail, label: "Email", action: () => console.log("Email owner") },
    { icon: Share2, label: "Share", action: () => console.log("Share property") },
    { icon: MapPin, label: "Directions", action: () => console.log("Get directions") },
  ]

  if (!isMobile) {
    return <div>{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {showMobileNav && (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="space-y-6 mt-6">
                    {/* User Profile Section */}
                    {user && (
                      <div className="border-b pb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{user.name}</p>
                              {getRoleBadge(user.role)}
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => (window.location.href = "/profile")}
                          >
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => (window.location.href = "/settings")}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                          {user.role === "admin" && (
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => (window.location.href = "/admin/dashboard")}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Admin Dashboard
                            </Button>
                          )}
                          {user.role === "agent" && (
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => (window.location.href = "/agent/dashboard")}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Agent Dashboard
                            </Button>
                          )}
                          <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Sign In/Up for non-authenticated users */}
                    {!user && (
                      <div className="border-b pb-4">
                        <div className="space-y-2">
                          <Button className="w-full" onClick={() => (window.location.href = "/auth/signin")}>
                            Sign In
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => (window.location.href = "/auth/signup")}
                          >
                            Sign Up
                          </Button>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-3">Navigation</h3>
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start">
                          <Search className="w-4 h-4 mr-2" />
                          Search Properties
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <MapPin className="w-4 h-4 mr-2" />
                          Wealth Map
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Filter className="w-4 h-4 mr-2" />
                          Advanced Filters
                        </Button>
                      </div>
                    </div>

                    {propertyData && (
                      <div>
                        <h3 className="font-semibold mb-3">Property Actions</h3>
                        <div className="space-y-2">
                          {quickActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={action.action}
                            >
                              <action.icon className="w-4 h-4 mr-2" />
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="font-bold text-lg">TrueEstate</h1>
                <p className="text-xs text-gray-600">Clarity before Capital</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="w-5 h-5" />
              </Button>

              {/* Mobile User Avatar */}
              {user && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                  <AvatarFallback className="text-xs">
                    {user.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Mobile Content */}
      <main className="pb-20">{children}</main>

      {/* Mobile Bottom Navigation */}
      {propertyData && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Property Quick Info Bar */}
          <div className="bg-white border-t p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-lg">{propertyData.price}</div>
                <div className="text-sm text-gray-600 truncate">{propertyData.address}</div>
              </div>
              <Button onClick={() => setShowQuickActions(!showQuickActions)} className="bg-blue-600 hover:bg-blue-700">
                Contact Owner
              </Button>
            </div>
          </div>

          {/* Quick Actions Drawer */}
          {showQuickActions && (
            <div className="bg-white border-t">
              <div className="grid grid-cols-4 gap-1 p-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.action()
                      setShowQuickActions(false)
                    }}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <action.icon className="w-5 h-5 text-blue-600" />
                    <span className="text-xs text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Floating Action Button */}
      {!propertyData && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            onClick={() => console.log("Quick search")}
          >
            <Search className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  )
}

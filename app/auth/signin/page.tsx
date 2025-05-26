"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building, Eye, EyeOff, Shield, Users, UserCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

const demoCredentials = [
  {
    role: "Admin",
    email: "admin@trueestate.com",
    password: "demo",
    description: "Full platform access, user management, and analytics",
    icon: Shield,
    color: "bg-red-100 text-red-800",
  },
  {
    role: "User",
    email: "user@trueestate.com",
    password: "demo",
    description: "Property search, owner verification, and trust scores",
    icon: Users,
    color: "bg-blue-100 text-blue-800",
  },
  {
    role: "Agent",
    email: "agent@trueestate.com",
    password: "demo",
    description: "Enhanced property tools and client management features",
    icon: UserCheck,
    color: "bg-green-100 text-green-800",
  },
]

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check demo credentials
    const validCredential = demoCredentials.find((cred) => cred.email === email && password === "demo")

    if (validCredential) {
      // Store user session (in production, this would be handled by NextAuth)
      localStorage.setItem(
        "trueestate_user",
        JSON.stringify({
          email: validCredential.email,
          role: validCredential.role.toLowerCase(),
          name: validCredential.role + " User",
          authenticated: true,
          loginTime: new Date().toISOString(),
        }),
      )

      // Redirect based on role
      if (validCredential.role === "Admin") {
        router.push("/admin/dashboard")
      } else if (validCredential.role === "Agent") {
        router.push("/agent/dashboard")
      } else {
        router.push("/")
      }
    } else {
      setError("Invalid credentials. Please use the demo credentials provided below.")
    }

    setLoading(false)
  }

  const handleDemoLogin = (credential: (typeof demoCredentials)[0]) => {
    setEmail(credential.email)
    setPassword(credential.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8">
        {/* Sign In Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-2xl">TrueEstate</h1>
                <p className="text-xs text-gray-600">Clarity before Capital</p>
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access real estate intelligence and property verification tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:underline">
                ← Back to Platform
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Demo Access</h2>
            <p className="text-gray-600">Try TrueEstate with different user roles and access levels</p>
          </div>

          <div className="space-y-4">
            {demoCredentials.map((credential, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleDemoLogin(credential)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <credential.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{credential.role} Access</h3>
                        <Badge className={credential.color}>{credential.role}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{credential.description}</p>
                      <div className="text-xs text-gray-500">
                        <div>Email: {credential.email}</div>
                        <div>Password: {credential.password}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Demo Environment:</strong> This is a demonstration platform with simulated data. All user
              credentials are for testing purposes only.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <h3 className="font-semibold mb-2">Production Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• OAuth 2.0 with Google, LinkedIn, Azure AD</li>
              <li>• Multi-factor authentication</li>
              <li>• Role-based access control</li>
              <li>• Enterprise SSO integration</li>
              <li>• Audit logging and compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

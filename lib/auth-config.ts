import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

// Demo users for testing
const DEMO_USERS = [
  {
    id: "1",
    email: "admin@trueestate.com",
    password: "demo123", // In production, this would be hashed
    name: "Admin User",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40&text=A",
  },
  {
    id: "2",
    email: "user@trueestate.com",
    password: "demo123",
    name: "Regular User",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40&text=U",
  },
  {
    id: "3",
    email: "agent@trueestate.com",
    password: "demo123",
    name: "Real Estate Agent",
    role: "agent",
    avatar: "/placeholder.svg?height=40&width=40&text=R",
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        try {
          // First check demo users
          const demoUser = DEMO_USERS.find(
            (user) => user.email === credentials.email && user.password === credentials.password,
          )

          if (demoUser) {
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              role: demoUser.role,
              image: demoUser.avatar,
            }
          }

          // Then check database
          const db = await getDatabase()
          const user = await db.collection("users").findOne({
            email: credentials.email,
          })

          if (!user) {
            throw new Error("User not found")
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)

          if (!isValid) {
            throw new Error("Invalid password")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
            image: user.avatar,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to wealth map after successful login
      if (url.includes("/signin") || url.includes("/signup")) {
        return `${baseUrl}/wealth-map`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  pages: {
    signIn: "/signin",
    signUp: "/signup",
    error: "/signin",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key",
}

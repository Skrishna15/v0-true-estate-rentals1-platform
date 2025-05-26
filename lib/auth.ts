import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  {
    id: "admin-demo",
    email: "admin@trueestate.com",
    password: "demo",
    name: "Admin Demo",
    role: "admin",
    verified: true,
  },
  {
    id: "user-demo",
    email: "user@trueestate.com",
    password: "demo",
    name: "User Demo",
    role: "renter",
    verified: true,
  },
  {
    id: "agent-demo",
    email: "agent@trueestate.com",
    password: "demo",
    name: "Agent Demo",
    role: "agent",
    verified: true,
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
          return null
        }

        // Check demo accounts first
        const demoAccount = DEMO_ACCOUNTS.find(
          (account) => account.email === credentials.email && account.password === credentials.password,
        )

        if (demoAccount) {
          return {
            id: demoAccount.id,
            email: demoAccount.email,
            name: demoAccount.name,
            role: demoAccount.role,
            verified: demoAccount.verified,
          }
        }

        // Check database for real accounts
        try {
          const db = await getDatabase()
          const user = await db.collection("users").findOne({
            email: credentials.email,
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            verified: user.verified,
          }
        } catch (error) {
          console.error("Database auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.verified = user.verified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.verified = token.verified as boolean
      }
      return session
    },
    async signOut({ token }) {
      // Clear any additional session data if needed
      return true
    },
  },
  events: {
    async signOut(message) {
      // Log sign out event
      console.log("User signed out:", message)
    },
  },
  pages: {
    signIn: "/signin",
    signUp: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  {
    id: "admin-demo",
    email: "admin@trueestate.com",
    password: "demo123",
    name: "Admin Demo",
    role: "admin",
    verified: true,
  },
  {
    id: "user-demo",
    email: "user@trueestate.com",
    password: "demo123",
    name: "User Demo",
    role: "renter",
    verified: true,
  },
  {
    id: "agent-demo",
    email: "agent@trueestate.com",
    password: "demo123",
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
          throw new Error("Please enter email and password")
        }

        // Check demo accounts
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

        throw new Error("Invalid credentials")
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
    async jwt({ token, user, account }) {
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
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/wealth-map`
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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

        // Demo users for testing
        const demoUsers = [
          {
            id: "1",
            email: "admin@trueestate.com",
            password: "demo123",
            name: "Admin User",
            role: "admin",
            verified: true,
          },
          {
            id: "2",
            email: "user@trueestate.com",
            password: "demo123",
            name: "Regular User",
            role: "user",
            verified: true,
          },
          {
            id: "3",
            email: "agent@trueestate.com",
            password: "demo123",
            name: "Real Estate Agent",
            role: "agent",
            verified: true,
          },
        ]

        const user = demoUsers.find((u) => u.email === credentials.email && u.password === credentials.password)

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            verified: user.verified,
          }
        }

        return null
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
      // Always redirect to wealth map after successful login
      if (url.startsWith("/") || url.startsWith(baseUrl)) {
        return `${baseUrl}/wealth-map`
      }
      return baseUrl
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

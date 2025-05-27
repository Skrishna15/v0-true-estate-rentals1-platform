import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: string
      verified: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: string
    verified: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    verified: boolean
  }
}

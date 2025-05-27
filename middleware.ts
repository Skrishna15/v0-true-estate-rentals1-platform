import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public pages
        if (
          req.nextUrl.pathname.startsWith("/signin") ||
          req.nextUrl.pathname.startsWith("/signup") ||
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname.startsWith("/learn") ||
          req.nextUrl.pathname.startsWith("/api/auth")
        ) {
          return true
        }

        // Require authentication for protected pages
        return !!token
      },
    },
  },
)

export const config = {
  matcher: ["/wealth-map/:path*", "/dashboard/:path*", "/profile/:path*", "/properties/:path*"],
}

// middleware.ts

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Example of extracting the authentication token from cookies
  const token = req.cookies.get("jwtToken"); // Assuming the token is stored in cookies
  console.log(token);
  // Get the requested URL path
  const url = req.nextUrl.clone();

  // Define the protected routes
  const protectedRoutes = ["/", "/addProduct"];

  // Check if the user is trying to access a protected route
  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      // If not authenticated, redirect to login page
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Continue processing the request if no redirection is needed
  return NextResponse.next();
}

// Optional: Define the paths that should be matched by this middleware
export const config = {
  matcher: ["/dashboard/*", "/profile/*", "/api/*"], // Apply middleware to these routes
};

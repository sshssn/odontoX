import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🔓 AUTH TEMPORARILY DISABLED - ALL ROUTES ARE PUBLIC
// This allows you to visit dashboards directly without logging in

export async function proxy(req: NextRequest) {
  // Allow everything through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};


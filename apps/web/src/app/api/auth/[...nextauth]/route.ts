import { handlers } from "@/lib/auth";
import type { NextRequest } from "next/server";

// Wrap handlers to match Next.js 16 route handler signature
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  return handlers.GET(request as any);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  return handlers.POST(request as any);
}

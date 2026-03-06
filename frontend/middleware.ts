import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const actionHeader = req.headers.get("next-action");

  // Some bots/scanners send fake server-action requests (e.g. id "x").
  // Short-circuit them before they hit Next's action runtime.
  if (actionHeader) {
    return NextResponse.json({ error: "Invalid action request" }, { status: 400 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};

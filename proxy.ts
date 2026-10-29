import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

// Keeps /admin and its API behind the access code. Server actions and the
// upload route check the session again, so this is not the only gate.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const ok = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  let res: NextResponse;
  if (!ok && !isLogin) {
    res = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/admin/login", request.url));
  } else if (ok && isLogin) {
    res = NextResponse.redirect(new URL("/admin", request.url));
  } else {
    res = NextResponse.next();
  }
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};

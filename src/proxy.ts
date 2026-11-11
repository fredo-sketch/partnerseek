import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pengecekan optimistis (hanya cek ada/tidaknya cookie). Verifikasi sebenarnya ada di requireUser().
export function proxy(request: NextRequest) {
  const has = request.cookies.get("ps_session");
  if (!has) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/messages/:path*", "/settings/:path*", "/posts/new", "/dashboard"],
};

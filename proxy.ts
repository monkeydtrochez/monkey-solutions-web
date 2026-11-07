import { NextResponse, type NextRequest } from "next/server";
import { resolveProxy } from "@/lib/i18n/proxyRules";

// Swedish is served at the root: rewrite to the internal /sv segment, and
// redirect any visible /sv prefix away. Query strings ride along on the clone.
export function proxy(request: NextRequest) {
  const decision = resolveProxy(request.nextUrl.pathname);
  if (decision.action === "next") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = decision.pathname;
  return decision.action === "redirect"
    ? NextResponse.redirect(url, 308)
    : NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};

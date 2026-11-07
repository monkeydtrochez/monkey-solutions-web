import { defaultLocale } from "./config";

export type ProxyDecision =
  | { action: "next" }
  | { action: "redirect" | "rewrite"; pathname: string };

const prefix = `/${defaultLocale}`;

// Swedish lives at the root and is served from app/[lang] with lang = "sv".
// English already carries its prefix. A visible /sv prefix is redirected away
// so public URLs never contain it.
export function resolveProxy(pathname: string): ProxyDecision {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { action: "next" };
  }
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    const rest = pathname.slice(prefix.length).replace(/\/+$/, "");
    return { action: "redirect", pathname: rest || "/" };
  }
  return {
    action: "rewrite",
    pathname: pathname === "/" ? prefix : `${prefix}${pathname}`,
  };
}

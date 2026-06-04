"use client";
import { useEffect } from "react";

/**
 * Centralizes in-page anchor navigation (any `<a href="#section">`).
 *
 * The native hash jump lands on the section's *box top*, which sits behind the
 * sticky header AND above the section's decorative top padding — leaving a large
 * gap before the actual content. Here we instead scroll to the section's content
 * (past its top padding) with a small clearance below the live header height, so
 * navigation lands on the real start line on every browser/device.
 */
const HEADER_GAP = 28; // breathing room between the sticky header and the content

function scrollToId(id: string, smooth: boolean) {
  const el = document.getElementById(id);
  if (!el) return;

  const header = document.querySelector("header");
  const headerH = header ? header.getBoundingClientRect().height : 0;
  const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;

  const top =
    el.getBoundingClientRect().top + window.scrollY + padTop - headerH - HEADER_GAP;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: smooth && !reduced ? "smooth" : "instant",
  });
}

export default function SmoothScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Respect modified clicks and anything already handled (e.g. the logo).
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const anchor = (e.target as HTMLElement | null)?.closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return; // "#" is the scroll-to-top logo

      const id = decodeURIComponent(href.slice(1));
      if (!document.getElementById(id)) return;

      e.preventDefault();
      scrollToId(id, true);
      history.pushState(null, "", href);
    }

    document.addEventListener("click", onClick);

    // Handle deep links (e.g. /#work) once layout has settled.
    if (window.location.hash.length > 1) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      requestAnimationFrame(() => scrollToId(id, false));
    }

    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

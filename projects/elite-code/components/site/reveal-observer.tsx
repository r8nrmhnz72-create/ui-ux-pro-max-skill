"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Marks `[data-reveal]` elements with `data-revealed` as they scroll into view; globals.css
 * turns that into a fade-up. Content is only hidden while the `js` class is on <html>
 * (set by the inline script in the layout), so it stays visible without JavaScript and
 * under `prefers-reduced-motion`.
 */
export function RevealObserver() {
  const pathname = usePathname();

  React.useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");
    if (nodes.length === 0) return;
    if (typeof IntersectionObserver !== "function") {
      nodes.forEach((node) => node.setAttribute("data-revealed", ""));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

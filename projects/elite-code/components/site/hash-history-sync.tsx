"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/**
 * In-page links (#mallit, #tarjous…) are plain anchors, so the browser adds their history
 * entries itself, without the App Router's state. The router ignores such entries on
 * Back/Forward, which would leave the wrong page on screen after e.g.
 * "#mallit" → privacy page → Back. Handing each router-less entry to the router keeps
 * the address bar and the page in step.
 */
export function HashHistorySync() {
  const router = useRouter();

  React.useEffect(() => {
    let synced = "";
    const onPopState = (event: PopStateEvent) => {
      if (event.state !== null) {
        synced = "";
        return;
      }
      const url = window.location.pathname + window.location.search + window.location.hash;
      // The same fragment activated twice in a row needs no second hand-over.
      if (url === synced) return;
      synced = url;
      router.replace(url);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [router]);

  return null;
}

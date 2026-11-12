"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Stateless theme switch: the `dark` class on <html> is the single source of truth
 * (set before first paint by the inline script in app/layout.tsx), so both icons are
 * rendered and CSS shows the right one — no hydration mismatch, no flash.
 */
const TOOLBAR = { dark: "#0a0a0b", light: "#faf9f6" };

/** The browser toolbar (theme-color) follows the site theme, not the OS setting. */
function syncToolbar() {
  const dark = document.documentElement.classList.contains("dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? TOOLBAR.dark : TOOLBAR.light);
}

export function ThemeToggle({ className }: { className?: string }) {
  // A stored light theme is applied before hydration by the boot script; catch up once mounted.
  React.useEffect(syncToolbar, []);

  const toggle = () => {
    const root = document.documentElement;
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    syncToolbar();
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts for this page view.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Vaihda vaalean ja tumman teeman välillä"
      className={cn(
        "inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Sun aria-hidden="true" className="hidden size-[1.15rem] dark:block" />
      <Moon aria-hidden="true" className="size-[1.15rem] dark:hidden" />
    </button>
  );
}

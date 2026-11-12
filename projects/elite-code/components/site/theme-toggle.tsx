"use client";

import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Stateless theme switch: the `dark` class on <html> is the single source of truth
 * (set before first paint by the inline script in app/layout.tsx), so both icons are
 * rendered and CSS shows the right one — no hydration mismatch, no flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
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

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { InteractiveHoverLinks, type InteractiveLink } from "@/components/ui/interactive-hover-links";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  links: InteractiveLink[];
  cta: { label: string; href: string };
  contact: { email: string; phone: string | null };
  labels: { menu: string; close: string; open: string; navigation: string; home: string };
}

const MENU_ID = "paavalikko";

/** Everything outside the header is taken out of the tab order and scroll-locked while the menu covers it. */
function setPageBlocked(blocked: boolean) {
  document.documentElement.style.overflow = blocked ? "hidden" : "";
  document.querySelectorAll<HTMLElement>("[data-page-content]").forEach((node) => {
    node.inert = blocked;
  });
}

export function SiteHeader({ links, cta, contact, labels }: SiteHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    setPageBlocked(true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      setPageBlocked(false);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Unblock the page synchronously so the browser can scroll to the link's target straight away.
  const leave = () => {
    setPageBlocked(false);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={cn(
          "relative z-10 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          open
            ? "border-transparent bg-background"
            : scrolled
              ? "border-border bg-background/80 backdrop-blur-md"
              : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8 lg:px-10">
          <Link
            href="/"
            aria-label={labels.home}
            onClick={() => {
              if (open) leave();
              // Already on the home page: the router has nowhere to go, so take the visitor back up.
              if (pathname === "/") window.scrollTo({ top: 0 });
            }}
            className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <Logo />
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            <a
              href={cta.href}
              onClick={open ? leave : undefined}
              className="hidden h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground outline-none transition-[translate,box-shadow] duration-200 hover:-translate-y-px hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:inline-flex"
            >
              {cta.label}
            </a>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={MENU_ID}
              aria-label={open ? labels.close : labels.open}
              onClick={() => setOpen((value) => !value)}
              className="group inline-flex h-11 cursor-pointer items-center gap-3 rounded-full border border-border bg-background/60 pl-5 pr-4 max-[359px]:px-3.5 text-sm font-medium outline-none backdrop-blur-sm transition-colors duration-200 hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span aria-hidden="true" className="max-[359px]:hidden">
                {open ? labels.close.split(" ")[0] : labels.menu}
              </span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0.5 h-px bg-current transition-transform duration-300 motion-reduce:transition-none",
                    open && "translate-y-[5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0.5 h-px bg-current transition-transform duration-300 motion-reduce:transition-none",
                    open && "-translate-y-[4px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id={MENU_ID}
            key="menu"
            initial={{ opacity: 0, y: reduced ? 0 : -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0.12 : 0.32, ease: [0.22, 0.85, 0.3, 1] }}
            className="fixed inset-0 overflow-y-auto overscroll-contain bg-background pt-16 md:pt-20"
          >
            <div className="mx-auto flex min-h-full max-w-7xl flex-col px-4 pb-8 md:px-8 lg:px-10">
              <InteractiveHoverLinks
                aria-label={labels.navigation}
                links={links}
                onNavigate={leave}
                size="fit"
                // Head room on larger screens: the first row's hover picture pops out above the row
                // and would otherwise slide under the header bar.
                className="mx-auto flex max-w-5xl flex-1 flex-col justify-center py-4 md:pt-[clamp(1.5rem,5vh,3.5rem)]"
              />
              <div className="mx-auto flex w-full max-w-5xl flex-col pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex min-h-11 items-center rounded-sm underline-offset-4 outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {contact.email}
                </a>
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex min-h-11 items-center rounded-sm tabular-nums underline-offset-4 outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {contact.phone}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

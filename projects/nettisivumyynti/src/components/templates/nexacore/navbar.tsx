"use client";

import * as React from "react";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { ContactButton, Logo, useScrolled } from "./primitives";

const NAV_LINKS = [
  { label: "Palvelut", href: "#build" },
  { label: "Työnäytteet", href: "#tyot" },
  { label: "Prosessi", href: "#thinking" },
  { label: "Hinnat", href: "#hinnat" },
  { label: "UKK", href: "#ukk" },
];

export function Navbar() {
  const scrolled = useScrolled(20);
  const [open, setOpen] = React.useState(false);

  return (
    <header
      data-slot="navbar"
      className="fixed inset-x-0 top-4 z-50 flex justify-center ps-4 pe-1.5"
    >
      <nav
        className={cn(
          "w-full rounded-2xl bg-white shadow-lg transition-all duration-500 ease-in-out",
          scrolled ? "max-w-3xl" : "max-w-6xl",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-6 py-1.5 transition-all duration-500 ease-in-out",
            scrolled ? "ps-4 pe-2" : "ps-5 pe-2",
          )}
        >
          <a href="#home" aria-label="Sivuseppä – etusivu" className="flex items-center gap-2">
            <Logo />
            <span
              className="font-medium text-[var(--nexa-navy)]"
              style={{ fontSize: 22, letterSpacing: "-0.02em" }}
            >
              Sivuseppä
            </span>
          </a>

          <div
            className={cn(
              "hidden items-center md:flex",
              scrolled ? "gap-0" : "gap-1",
            )}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-xl text-sm text-[var(--nexa-navy)] transition-all duration-500 nexa-hover",
                  scrolled ? "px-2 py-1.5" : "px-4 py-2",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ContactButton label="Ilmainen demo" href="#kuvaile" />
            </div>
            <button
              type="button"
              aria-label={open ? "Sulje valikko" : "Avaa valikko"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--nexa-navy)] transition-colors nexa-hover md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-[var(--border)] px-2 pb-3 pt-2 md:hidden">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center justify-between rounded-xl px-3 text-base font-medium text-[var(--nexa-navy)] transition-colors nexa-hover"
                  >
                    {link.label}
                    <ChevronRight className="size-4 text-[var(--nexa-muted)]" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#kuvaile"
              onClick={() => setOpen(false)}
              className="nexa-grad-a-bg mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl text-base font-semibold text-white"
            >
              Tilaa ilmainen demo
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

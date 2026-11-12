"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { findTemplate, site } from "@/content/site";
import { useSelection } from "@/lib/selection";
import { cn } from "@/lib/utils";

/**
 * Floating reminder of the template picked from the belt, with a shortcut to the quote form.
 * It steps aside once the form itself is on screen.
 */
export function SelectionBar() {
  const { selectedId, select } = useSelection();
  const [formInView, setFormInView] = React.useState(false);
  const reduced = useReducedMotion();
  const item = findTemplate(selectedId);
  const copy = site.selection;

  React.useEffect(() => {
    const target = document.getElementById("tarjous");
    if (!target || typeof IntersectionObserver !== "function") return;
    // Away while the form is on screen and also once it has been passed: only the footer follows,
    // and the bar would sit on top of its links. The observer's root is stretched far upwards, so
    // "above the viewport" counts as intersecting too, even after a jump straight to the page end.
    const observer = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), {
      rootMargin: "100000px 0px 0px 0px",
      threshold: 0.12,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visible = !!item && !formInView;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {/* Announces the pick to screen readers even when the bar is tucked away. */}
      <p className="sr-only" role="status">
        {item ? `${copy.label}: ${item.name}, ${item.price}` : ""}
      </p>
      <AnimatePresence>
        {visible && item && (
          <motion.div
            key="bar"
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : 16 }}
            transition={{ duration: reduced ? 0.12 : 0.36, ease: [0.22, 0.85, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-full border border-border bg-card/95 py-2 pl-2 pr-2 shadow-2xl backdrop-blur-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative thumbnail of an already-loaded plate */}
            <img src={item.image} alt="" width={44} height={44} className="hidden size-11 shrink-0 rounded-full sm:block" />
            {/* Phones: no thumbnail or label, name and price on two lines, so nothing is cut off. */}
            <p className="min-w-0 flex-1 pl-3 leading-tight sm:pl-0">
              <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:block">{copy.label}</span>
              <span className="block truncate text-sm font-medium">
                {item.name}
                <span className="hidden font-normal tabular-nums text-muted-foreground sm:inline"> · {item.price}</span>
              </span>
              <span className="block text-xs tabular-nums text-muted-foreground sm:hidden">{item.price}</span>
            </p>
            <a href="#tarjous" className={cn(buttonVariants({ variant: "accent", size: "sm" }), "group h-11 px-4")}>
              {copy.cta}
              <ArrowRight aria-hidden="true" className="hidden transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none sm:block" />
            </a>
            <button
              type="button"
              onClick={() => select(null)}
              aria-label={copy.clear}
              className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

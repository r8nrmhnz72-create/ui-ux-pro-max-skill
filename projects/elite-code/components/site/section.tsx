import * as React from "react";

import { cn } from "@/lib/utils";

/** Renders `*emphasised*` parts of a heading in the italic serif, in the highlight colour. */
export function Emphasis({ children }: { children: string }) {
  const parts = children.split(/\*(.+?)\*/g);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className="font-serif font-normal italic tracking-normal text-highlight">
            {part}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function Section({
  id,
  className,
  children,
  ...rest
}: React.ComponentProps<"section"> & { id: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-otsikko`} className={cn("py-20 md:py-28", className)} {...rest}>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-10">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  heading,
  lead,
  className,
}: {
  /** Section id; the heading gets `${id}-otsikko` so the section can be labelled by it. */
  id: string;
  eyebrow: string;
  heading: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div data-reveal className={cn("flex max-w-3xl flex-col gap-5", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={`${id}-otsikko`} className="text-balance text-3xl font-medium leading-[1.08] tracking-tight md:text-5xl">
        <Emphasis>{heading}</Emphasis>
      </h2>
      {lead && <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{lead}</p>}
    </div>
  );
}

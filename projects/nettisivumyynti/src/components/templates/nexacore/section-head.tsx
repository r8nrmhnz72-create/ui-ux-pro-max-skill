import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { BrandMark, GradientText } from "./primitives";

export function Chip({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium",
        tone === "dark"
          ? "bg-white/[0.07] text-white/85 ring-1 ring-white/15"
          : "bg-[var(--nexa-surface)] text-[var(--nexa-navy)] ring-1 ring-[var(--border)]",
      )}
    >
      <BrandMark style={{ width: 14, height: 14 }} />
      {children}
    </span>
  );
}

export function SectionHead({
  chip,
  title,
  highlight,
  children,
  align = "center",
  tone = "light",
  className,
  breakBeforeHighlight = false,
}: {
  chip: string;
  title: string;
  highlight?: string;
  children?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
  /** Starts the highlighted phrase on its own line. */
  breakBeforeHighlight?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" ? "items-center text-center" : "items-start text-left", className)}>
      <Chip tone={tone}>{chip}</Chip>
      <h2
        className={cn("max-w-3xl font-semibold tracking-[-0.03em] text-balance", tone === "dark" ? "text-white" : "text-[var(--nexa-navy)]")}
        style={{ fontSize: "clamp(32px, 4.2vw, 56px)", lineHeight: 1.08 }}
      >
        {title}
        {highlight ? (
          <>
            {breakBeforeHighlight ? <br /> : " "}
            <GradientText className="pb-1">{highlight}</GradientText>
          </>
        ) : null}
      </h2>
      {children ? (
        <p
          className={cn("max-w-xl", tone === "dark" ? "text-[var(--nexa-lavender-2)]" : "text-[var(--nexa-muted)]")}
          style={{ fontSize: "clamp(16px, 1.2vw, 18px)", lineHeight: 1.6 }}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}

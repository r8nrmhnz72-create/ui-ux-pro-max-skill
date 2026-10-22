import type { ReactNode } from "react";

import { BrandMark, GradientText } from "./primitives";

export function SectionHead({
  chip,
  title,
  highlight,
  children,
}: {
  chip: string;
  title: string;
  highlight?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-[var(--nexa-chip)] px-4 py-2 text-base font-medium text-[var(--nexa-navy)]">
        <BrandMark style={{ width: 16, height: 16 }} />
        {chip}
      </span>
      <h2
        className="font-medium text-balance text-[var(--nexa-navy)]"
        style={{ fontSize: "clamp(30px, 4vw, 52px)", lineHeight: 1.15 }}
      >
        {title}
        {highlight ? (
          <>
            <br />
            <GradientText className="inline-block pb-1">{highlight}</GradientText>
          </>
        ) : null}
      </h2>
      {children ? (
        <p className="max-w-xl text-[var(--nexa-lavender-3)]" style={{ fontSize: "clamp(15px, 1.2vw, 19px)" }}>
          {children}
        </p>
      ) : null}
    </div>
  );
}

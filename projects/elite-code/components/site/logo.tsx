import { cn } from "@/lib/utils";

/** Two code chevrons that close into a cut gem: "code" and "elite" in one mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-6 text-highlight", className)}
    >
      <path d="M10.6 4.4 3 12l7.6 7.6" />
      <path d="M13.4 4.4 21 12l-7.6 7.6" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      <LogoMark />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="font-serif text-[1.7rem] italic tracking-[-0.01em]">Elite</span>
        <span className="font-mono text-[0.95rem] font-medium uppercase tracking-[0.18em]">Code</span>
      </span>
    </span>
  );
}

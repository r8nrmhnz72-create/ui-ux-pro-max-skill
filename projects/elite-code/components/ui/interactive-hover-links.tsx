"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InteractiveLink {
  heading: string;
  subheading: string;
  /** Picture that pops out and follows the cursor on hover (4:3 works best). */
  imgSrc: string;
  href: string;
}

export interface InteractiveHoverLinksProps extends Omit<React.ComponentProps<"nav">, "children"> {
  links: InteractiveLink[];
  /** Called when a link is activated, before the browser follows it (e.g. to close an overlay menu). */
  onNavigate?: (link: InteractiveLink, event: React.MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Heading scale: `lg` is the original display size, `md` suits secondary navigation such as a
   * footer, and `fit` scales rows with the viewport height so a full-screen menu fits without scrolling.
   */
  size?: LinkSize;
}

type LinkSize = "md" | "lg" | "fit";

const ROW: Record<LinkSize, string> = {
  lg: "py-4 md:py-8",
  md: "py-3 md:py-5",
  fit: "py-4 md:py-[clamp(0.375rem,1.9vh,2rem)]",
};

const HEADING: Record<LinkSize, string> = {
  lg: "text-4xl md:text-6xl",
  md: "text-3xl md:text-5xl",
  fit: "text-4xl md:text-[length:clamp(1.875rem,6vh,3.75rem)] md:leading-none",
};

const PICTURE: Record<LinkSize, string> = {
  lg: "hidden h-24 w-32 sm:block md:h-48 md:w-64",
  md: "hidden h-24 w-32 sm:block md:h-48 md:w-64",
  fit: "hidden h-24 w-32 sm:block md:h-[clamp(7rem,21vh,12rem)] md:w-[clamp(9.33rem,28vh,16rem)]",
};

export function InteractiveHoverLinks({ links, onNavigate, size = "lg", className, ...rest }: InteractiveHoverLinksProps) {
  return (
    <nav {...rest} data-slot="interactive-hover-links" className={cn("w-full", className)}>
      <ul>
        {links.map((link) => (
          <li key={link.href + link.heading}>
            <HoverLink link={link} size={size} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HoverLink({ link, size, onNavigate }: {
  link: InteractiveLink;
  size: LinkSize;
  onNavigate?: InteractiveHoverLinksProps["onNavigate"];
}) {
  const { heading, subheading, imgSrc, href } = link;
  const ref = React.useRef<HTMLAnchorElement | null>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "40%"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const node = ref.current;
    if (!node || reduced) return;
    const rect = node.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const shift = reduced ? 0 : 16;

  return (
    <motion.a
      href={href}
      ref={ref}
      onClick={(event) => onNavigate?.(link, event)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial="initial"
      whileHover="whileHover"
      whileFocus="whileHover"
      className={cn(
        "group relative flex items-center justify-between border-b-2 border-muted outline-none transition-colors duration-500 hover:border-foreground focus-visible:border-foreground",
        ROW[size],
      )}
    >
      <div className="min-w-0">
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -shift },
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.075,
            delayChildren: 0.25,
          }}
          className={cn(
            "relative z-10 block font-bold text-muted-foreground transition-colors duration-500 group-hover:text-foreground group-focus-visible:text-foreground",
            HEADING[size],
          )}
        >
          <span className="sr-only">{heading}</span>
          <span aria-hidden="true">
            {heading.split("").map((letter, index) => (
              <motion.span
                variants={{
                  initial: { x: 0 },
                  whileHover: { x: shift },
                }}
                transition={{ type: "spring" }}
                className="inline-block"
                key={index}
              >
                {letter === " " ? " " : letter}
              </motion.span>
            ))}
          </span>
        </motion.span>
        <span className="relative z-10 mt-2 block text-base text-muted-foreground transition-colors duration-500 group-hover:text-foreground group-focus-visible:text-foreground">
          {subheading}
        </span>
      </div>

      <motion.img
        style={{
          top,
          left,
          translateX: "-10%",
          translateY: "-50%",
        }}
        variants={{
          initial: { scale: 0, rotate: "-12.5deg" },
          whileHover: { scale: 1, rotate: reduced ? "0deg" : "12.5deg" },
        }}
        transition={reduced ? { duration: 0.15 } : { type: "spring" }}
        src={imgSrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable={false}
        className={cn("pointer-events-none absolute z-0 rounded-lg object-cover shadow-lg", PICTURE[size])}
      />
      <div className="shrink-0 overflow-hidden">
        <motion.div
          variants={{
            initial: {
              x: "100%",
              opacity: 0,
            },
            whileHover: {
              x: "0%",
              opacity: 1,
            },
          }}
          transition={reduced ? { duration: 0.15 } : { type: "spring" }}
          className="relative z-10 p-4"
        >
          <ArrowRight aria-hidden="true" className={cn("text-foreground", size === "md" ? "size-7 md:size-10" : "size-8 md:size-12")} />
        </motion.div>
      </div>
    </motion.a>
  );
}

export default InteractiveHoverLinks;

"use client";

import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import SushiConveyorMenu from "@/components/ui/sushi-conveyor-menu";
import { site, templates, TIER_PRICES } from "@/content/site";
import { useSelection } from "@/lib/selection";
import { cn } from "@/lib/utils";

/** The template picker: every plate on the belt is one website template. */
export function TemplateBelt() {
  const { selectedId, select } = useSelection();
  const { belt } = site;

  return (
    <div className="border-y border-border">
      <SushiConveyorMenu
        id="mallit"
        className="scroll-mt-16 md:scroll-mt-20"
        items={templates}
        legend={TIER_PRICES}
        eyebrow={belt.eyebrow}
        heading={belt.heading}
        caption={belt.caption}
        labels={belt.labels}
        autoplay
        interval={3600}
        onAdd={(item) => select(item.id)}
        action={
          <a href="#tarjous" className={cn(buttonVariants(), "group")}>
            {selectedId ? belt.actionSelected : belt.action}
            <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </a>
        }
      />
      <p className="mx-auto max-w-7xl px-4 pb-8 text-center text-xs text-muted-foreground md:px-8 lg:text-left">
        {belt.legendNote}
      </p>
    </div>
  );
}

import Link from "next/link";

import { Eyebrow } from "@/components/site/section";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";

export default function NotFound() {
  const copy = site.notFound;
  return (
    <div className="mx-auto flex min-h-[70svh] w-full max-w-3xl flex-col items-start justify-center gap-6 px-4 pb-24 pt-32 md:px-8">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <h1 className="text-balance text-4xl font-medium tracking-tight md:text-6xl">{copy.heading}</h1>
      <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">{copy.text}</p>
      <Link href="/" className={buttonVariants({ variant: "accent", size: "lg" })}>
        {copy.cta}
      </Link>
    </div>
  );
}

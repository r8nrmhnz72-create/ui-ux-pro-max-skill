import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Eyebrow } from "@/components/site/section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: site.privacy.title,
  description: site.privacy.intro,
  alternates: { canonical: "/tietosuoja" },
};

export default function PrivacyPage() {
  const { privacy } = site;
  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-24 pt-32 md:px-8 md:pt-40">
      <Eyebrow>{privacy.updated}</Eyebrow>
      <h1 className="mt-5 text-balance text-4xl font-medium tracking-tight md:text-6xl">{privacy.title}</h1>
      <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">{privacy.intro}</p>

      {privacy.sections.map((section) => (
        <section key={section.heading} className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-medium tracking-tight">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <Link
        href="/"
        className="group mt-14 inline-flex items-center gap-2 rounded-sm text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none" />
        {privacy.back}
      </Link>
    </article>
  );
}

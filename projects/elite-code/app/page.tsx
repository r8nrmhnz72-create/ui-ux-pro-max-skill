import { Suspense } from "react";

import { Hero } from "@/components/site/hero";
import { Faq, Pricing, Process, Quote, Service } from "@/components/site/sections";
import { SelectionBar } from "@/components/site/selection-bar";
import { TemplateBelt } from "@/components/site/template-belt";
import { site, templates } from "@/content/site";
import { SelectionProvider } from "@/lib/selection";

/** Structured data: who we are, what is on offer, and the questions answered on the page. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#yritys`,
      name: site.name,
      url: site.url,
      description: site.seo.description,
      email: site.contact.email,
      ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
      areaServed: "FI",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: site.belt.eyebrow,
        itemListElement: templates.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: `${item.name} – ${item.audience}`, description: item.description },
        })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: site.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <SelectionProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      {/* Each boundary hydrates as its own unit of work, so the interactive islands below
          the fold do not hold up the first interaction. */}
      <Suspense>
        <TemplateBelt />
      </Suspense>
      <Service />
      <Process />
      <Pricing />
      <Faq />
      <Suspense>
        <Quote />
      </Suspense>
      <Suspense>
        <SelectionBar />
      </Suspense>
    </SelectionProvider>
  );
}

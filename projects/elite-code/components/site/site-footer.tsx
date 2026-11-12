import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { Eyebrow } from "@/components/site/section";
import { InteractiveHoverLinks } from "@/components/ui/interactive-hover-links";
import { site } from "@/content/site";

const link =
  "rounded-sm underline-offset-4 outline-none transition-colors duration-200 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring";

export function SiteFooter() {
  const { footer, contact } = site;
  return (
    <footer data-page-content className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-20 md:px-8 lg:px-10 md:pt-28">
        <Eyebrow>{footer.heading}</Eyebrow>
        <InteractiveHoverLinks aria-label={footer.navigation} links={site.nav} size="md" className="mt-4" />

        <div className="mt-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{footer.tagline}</p>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground md:items-end">
            <li>
              <a href={`mailto:${contact.email}`} className={link}>
                {contact.email}
              </a>
            </li>
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className={`${link} tabular-nums`}>
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.businessId && <li className="tabular-nums">{contact.businessId}</li>}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.name}. {footer.rights}
          </p>
          <Link href={footer.privacy.href} className={link}>
            {footer.privacy.label}
          </Link>
        </div>
      </div>
    </footer>
  );
}

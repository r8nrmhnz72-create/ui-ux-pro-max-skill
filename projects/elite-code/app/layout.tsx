import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { HashHistorySync } from "@/components/site/hash-history-sync";
import { RevealObserver } from "@/components/site/reveal-observer";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { site } from "@/content/site";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: `%s · ${site.name}` },
  description: site.seo.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
  formatDetection: { telephone: false },
};

// The site theme does not follow the OS setting, so neither does the browser toolbar colour:
// it starts dark and the theme toggle keeps it in step (components/site/theme-toggle.tsx).
export const viewport: Viewport = { themeColor: "#0a0a0b" };

/**
 * Runs before first paint: flags that JavaScript is available (enables scroll reveals) and
 * applies a stored light-theme choice. Dark is the default the server renders.
 *
 * Failsafe: if the app has not confirmed it is running within four seconds (bundle blocked
 * or failed), the flag is withdrawn so nothing stays hidden waiting for a reveal.
 */
const bootScript = `(function(){var r=document.documentElement;r.classList.add("js");setTimeout(function(){if(!r.hasAttribute("data-reveal-ready"))r.classList.remove("js")},4000);try{if(localStorage.getItem("theme")==="light")r.classList.remove("dark")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fi"
      // Next 16: keeps smooth scrolling for in-page links but not for route changes.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} dark h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#sisalto"
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground outline-none transition-transform duration-200 focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
        >
          {site.labels.skip}
        </a>
        <SiteHeader links={site.nav} cta={site.headerCta} contact={site.contact} labels={site.labels.header} />
        <main id="sisalto" data-page-content className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
        <HashHistorySync />
      </body>
    </html>
  );
}

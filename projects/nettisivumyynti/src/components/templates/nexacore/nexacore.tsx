import { useState } from "react";

import { Brief } from "./brief";
import { Contact } from "./contact";
import { DemoForm } from "./demo-form";
import { Faq } from "./faq";
import { Footer } from "./footer";
import { Freedom } from "./freedom";
import { Hero } from "./hero";
import { Navbar } from "./navbar";
import { NexacoreStyles } from "./styles";
import { Precision } from "./precision";
import { Pricing } from "./pricing";
import { Trusted } from "./trusted";

export default function Nexacore() {
  const [brief, setBrief] = useState({ text: "", n: 0 });

  function handleBrief(text: string) {
    setBrief((b) => ({ text, n: b.n + 1 }));
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className="nexacore relative min-h-svh bg-[var(--background)] text-[var(--foreground)] antialiased"
      style={{
        fontFamily:
          "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <NexacoreStyles />
      <Navbar />
      <main>
        <Hero />
        <Trusted />
        <Freedom />
        <Precision />
        <Pricing />
        <Faq />
        <Brief onSubmit={handleBrief} />
        <DemoForm prefill={brief.text} prefillKey={brief.n} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

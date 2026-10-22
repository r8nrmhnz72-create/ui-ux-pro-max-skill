import { Contact } from "./contact";
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
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

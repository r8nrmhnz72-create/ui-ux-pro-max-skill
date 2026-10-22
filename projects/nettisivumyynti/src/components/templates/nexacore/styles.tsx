const NEXACORE_CSS = `
.nexacore {
  --background: #ffffff;
  --foreground: rgb(26, 11, 84);
  --card: #ffffff;
  --card-foreground: rgb(26, 11, 84);
  --popover: #ffffff;
  --popover-foreground: rgb(26, 11, 84);
  --primary: rgb(28, 78, 255);
  --primary-foreground: #ffffff;
  --secondary: rgb(249, 249, 249);
  --secondary-foreground: rgb(26, 11, 84);
  --muted: rgb(249, 249, 249);
  --muted-foreground: rgb(169, 151, 206);
  --accent: rgb(249, 249, 249);
  --accent-foreground: rgb(26, 11, 84);
  --border: rgb(232, 228, 243);
  --input: rgb(232, 228, 243);
  --ring: rgb(28, 78, 255);
  --nexa-navy: rgb(26, 11, 84);
  --nexa-lavender: rgb(169, 151, 206);
  --nexa-lavender-2: rgb(189, 174, 231);
  --nexa-lavender-3: rgb(131, 121, 158);
  --nexa-accent: rgb(200, 111, 255);
  --nexa-blue: rgb(28, 78, 255);
  --nexa-chip: rgb(249, 249, 249);
  --nexa-card-dark: rgba(10, 5, 20, 0.88);
  --nexa-badge: rgb(41, 31, 57);
  --nexa-grad-a: linear-gradient(90deg, rgb(28, 78, 255), rgb(172, 36, 255) 50%, rgb(254, 136, 27));
  --nexa-grad-b: linear-gradient(90deg, rgb(43, 167, 255), rgb(202, 69, 255) 50%, rgb(254, 136, 27));
  --nexa-grad-line: linear-gradient(rgb(28, 78, 255), rgb(254, 136, 27) 0%, rgb(172, 36, 255) 25%, rgb(247, 159, 255) 50%, rgb(255, 214, 0) 66%, rgb(254, 136, 27) 84%, rgba(254, 136, 27, 0) 102%);
  /* Dark sections and light surfaces, both tinted toward the brand violet. */
  --nexa-ink: #0b0526;
  --nexa-ink-2: #140a3d;
  --nexa-surface: #f6f4fb;
  --nexa-success: #1f9d55;
  --nexa-focus: #5b82ff;
  /* Readable muted text on white and on --nexa-surface (5.7:1 and 5.2:1). */
  --nexa-muted: #6a6189;
  --nexa-placeholder: #77709a;
}
.nexacore .nexa-grad-border-light {
  border: 1px solid transparent;
  background: linear-gradient(#fff, #fff) padding-box, var(--nexa-grad-a) border-box;
}
.nexacore :focus-visible {
  outline: 2px solid var(--nexa-focus);
  outline-offset: 3px;
}
.nexacore .nexa-serif {
  font-family: "Instrument Serif", Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.01em;
  padding-right: 0.08em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.nexacore .nexa-grid-dark,
.nexacore .nexa-grid-light {
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%);
}
.nexacore .nexa-grid-dark {
  background-image: linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
}
.nexacore .nexa-grid-light {
  background-image: linear-gradient(rgba(26, 11, 84, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26, 11, 84, 0.06) 1px, transparent 1px);
}
.nexacore .nexa-fade-right {
  -webkit-mask-image: linear-gradient(90deg, #000 85%, transparent);
  mask-image: linear-gradient(90deg, #000 85%, transparent);
}
.nexacore .nexa-grad-border {
  border: 1px solid transparent;
  background: linear-gradient(var(--nexa-ink), var(--nexa-ink)) padding-box, var(--nexa-grad-a) border-box;
}
.nexacore .nexa-no-scrollbar {
  scrollbar-width: none;
}
.nexacore .nexa-no-scrollbar::-webkit-scrollbar {
  display: none;
}
@media (prefers-reduced-motion: no-preference) {
  .nexacore .nexa-float {
    animation: nexa-float 6s ease-in-out infinite;
  }
  .nexacore .nexa-float-late {
    animation: nexa-float 6s ease-in-out 1.5s infinite;
  }
  .nexacore .nexa-orb-spin {
    animation: nexa-spin 14s linear infinite;
  }
  .nexacore .nexa-lift {
    transition: transform 250ms ease, box-shadow 250ms ease;
  }
  .nexacore .nexa-lift:hover {
    transform: translateY(-4px);
  }
}
@keyframes nexa-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes nexa-spin {
  to { transform: rotate(1turn); }
}
.nexacore .nexa-hover:hover {
  background-color: rgba(26, 11, 84, 0.05);
}
.nexacore .nexa-grad-text {
  background-image: var(--nexa-grad-b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
.nexacore .nexa-grad-a-bg {
  background-image: var(--nexa-grad-a);
}
.nexacore .nexa-grad-line-bg {
  background-image: var(--nexa-grad-line);
}
.nexacore .nexa-soft-shadow {
  box-shadow: 0 3px 9.1px rgba(63, 74, 126, 0.05), 0 1px 29px rgba(63, 74, 126, 0.1);
}
.nexacore .nexa-blur-card {
  backdrop-filter: blur(36px);
  -webkit-backdrop-filter: blur(36px);
}
`;

export function NexacoreStyles() {
  return <style dangerouslySetInnerHTML={{ __html: NEXACORE_CSS }} />;
}

import StackSpread, { type StackSpreadCard } from "@/components/ui/stack-spread";

// Example designs rendered from art/stack-cards.html with `npm run render:stack`.
// Relative paths so the images resolve both on the site root and next to the preview page.

// Back → front; the last card is on top of the pile.
// target: desktop spot (x vw / y vh from the centre). The card is square and as
// large as fits in a w vw × h vh box, then scaled.
// targetSm: touch screens, left or right column (sign of x) and row (y vh).
const CARDS: StackSpreadCard[] = [
  {
    item: { src: "media/stack/tase.jpg", alt: "Esimerkkisivu tilitoimistolle" },
    stackOffset: { x: -8, y: -10 },
    stackRotate: -18,
    target: { x: -21, y: -25, rotate: 0, scale: 0.9, w: 15, h: 25 },
    targetSm: { x: -22, y: -32 },
    z: 2,
  },
  {
    item: { src: "media/stack/kimppu.jpg", alt: "Esimerkkisivu kukkakaupalle" },
    stackOffset: { x: 14, y: -10 },
    stackRotate: 20,
    target: { x: 31, y: -24, rotate: 0, scale: 0.85, w: 15, h: 25 },
    targetSm: { x: 22, y: -32 },
    z: 3,
  },
  {
    item: { src: "media/stack/saksi.jpg", alt: "Esimerkkisivu parturille" },
    stackOffset: { x: -16, y: 0 },
    stackRotate: -4,
    target: { x: -37, y: 1, rotate: 0, scale: 0.9, w: 15, h: 27 },
    targetSm: { x: -22, y: -16.5 },
    z: 4,
  },
  {
    item: { src: "media/stack/voima.jpg", alt: "Esimerkkisivu kuntosalille" },
    stackOffset: { x: 1, y: -10 },
    stackRotate: -2,
    target: { x: 5, y: -25, rotate: 0, scale: 0.88, w: 16, h: 26 },
    targetSm: { x: 22, y: -16.5 },
    z: 5,
  },
  {
    item: { src: "media/stack/pulla.jpg", alt: "Esimerkkisivu kahvilalle" },
    stackOffset: { x: 18, y: 1 },
    stackRotate: 6,
    target: { x: 37, y: 1, rotate: 0, scale: 0.9, w: 15, h: 26 },
    targetSm: { x: -22, y: 16.5 },
    z: 6,
  },
  {
    item: { src: "media/stack/virta.jpg", alt: "Esimerkkisivu rakennusliikkeelle" },
    stackOffset: { x: -6, y: 10 },
    stackRotate: 6,
    target: { x: -23, y: 27, rotate: 0, scale: 0.9, w: 16, h: 26 },
    targetSm: { x: 22, y: 16.5 },
    z: 7,
  },
  {
    item: { src: "media/stack/kaneli.jpg", alt: "Esimerkkisivu ravintolalle" },
    stackOffset: { x: 8, y: 7 },
    stackRotate: 3,
    target: { x: 3, y: 28, rotate: 0, scale: 0.9, w: 16, h: 26 },
    targetSm: { x: -22, y: 32 },
    z: 8,
  },
  {
    item: { src: "media/stack/lumo.jpg", alt: "Esimerkkisivu kauneushoitolalle" },
    stackOffset: { x: 20, y: 12 },
    stackRotate: -7,
    target: { x: 30, y: 26, rotate: 0, scale: 0.82, w: 15, h: 25 },
    targetSm: { x: 22, y: 32 },
    z: 9,
  },
];

export function StackGallery() {
  return (
    <StackSpread
      id="ilmeet"
      cards={CARDS}
      cardAspect={1}
      scrollLength={300}
      bgColor="#f6f4fb"
      textColor="#1a0b54"
      cardRadius={14}
      cardShadow="0 26px 50px -26px rgba(26,11,84,.5), 0 2px 8px rgba(26,11,84,.08)"
      scrollHintLabel="Vieritä"
      title={
        // Block box with its own size: on short phones the title shrinks with the screen height.
        <span className="block font-semibold tracking-[-0.035em] max-md:text-[min(10vw,5.2vh)]">
          Ei kahta <br className="md:hidden" />
          <span className="nexa-serif nexa-grad-text">samanlaista.</span>
        </span>
      }
      subtitle={
        // One short line, so the text fits between the card rows on phones too.
        <span className="block text-balance" style={{ fontSize: "max(15px, 1.15vw)" }}>
          Jokainen sivu tehdään yrityksesi näköiseksi.
        </span>
      }
    />
  );
}

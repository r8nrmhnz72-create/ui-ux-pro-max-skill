/**
 * Everything the site says lives here: copy, prices, templates, navigation and contact details.
 * Components read from this file and contain no text of their own.
 *
 * ┌──────────────────────────────────────────────────────────────────────────────────┐
 * │ BEFORE PUBLISHING — replace the placeholders marked `TODO(owner)`:               │
 * │ domain, e-mail, phone, business ID and all prices.                                │
 * └──────────────────────────────────────────────────────────────────────────────────┘
 */

import type { InteractiveLink } from "@/components/ui/interactive-hover-links";
import type { ConveyorDish, DishTier, SushiConveyorMenuLabels } from "@/components/ui/sushi-conveyor-menu";

// TODO(owner): your real e-mail address. `.example` is a reserved placeholder domain.
const CONTACT_EMAIL = "hei@elitecode.example";

export interface Template extends ConveyorDish {
  tier: DishTier;
  description: string;
  details: string[];
  /** Who the template is designed for; shown in the price list. */
  audience: string;
}

/** Price per tier (VAT 0 %). The belt legend, the plates and the price list all read from here. */
// TODO(owner): confirm prices.
export const TIER_PRICES: Record<DishTier, string> = {
  1: "690 €",
  2: "1 190 €",
  3: "1 790 €",
  4: "2 890 €",
  5: "alk. 4 900 €",
};

/** Each template has two pictures: a small one for the belt and a large one for its dialog. */
function template(input: Omit<Template, "price" | "image" | "imageLarge">): Template {
  return {
    ...input,
    price: TIER_PRICES[input.tier],
    image: `/plates/${input.id}-sm.webp`,
    imageLarge: `/plates/${input.id}.webp`,
  };
}

export const templates: Template[] = [
  template({
    id: "kipina",
    name: "Kipinä",
    tier: 1,
    audience: "Aloittavalle yrittäjälle",
    description:
      "Yhden sivun esittelysivu, jolla pääset verkkoon heti. Kaikki olennainen yhdellä vierityksellä: mitä teet, kenelle ja miten sinuun saa yhteyden.",
    details: ["1 sivu", "Yhteydenottolomake", "Valmis noin viikossa"],
  }),
  template({
    id: "paja",
    name: "Paja",
    tier: 2,
    audience: "Käsityöläisille ja asentajille",
    description:
      "Palvelusivusto remonttifirmalle, asentajalle tai käsityöläiselle. Palvelut, työnäytteet ja tarjouspyyntö ovat aina yhden napautuksen päässä.",
    details: ["Enintään 5 sivua", "Tarjouspyyntölomake", "Kuvagalleria"],
  }),
  template({
    id: "kattaus",
    name: "Kattaus",
    tier: 2,
    audience: "Ravintoloille ja kahviloille",
    description:
      "Ravintolan tai kahvilan sivusto, joka herättää nälän. Ruokalista, aukioloajat ja pöytävaraus löytyvät puhelimella sekunneissa.",
    details: ["Ruokalista", "Pöytävaraus", "Kartta ja aukioloajat"],
  }),
  template({
    id: "galleria",
    name: "Galleria",
    tier: 3,
    audience: "Luovan alan tekijöille",
    description:
      "Portfolio valokuvaajalle, suunnittelijalle tai arkkitehdille. Työsi saavat koko ruudun, ja sivusto itse pysyy taustalla.",
    details: ["Projektisivut", "Koko ruudun kuvat", "Helppo päivittää"],
  }),
  template({
    id: "vastaanotto",
    name: "Vastaanotto",
    tier: 3,
    audience: "Klinikoille ja hyvinvointialalle",
    description:
      "Sivusto klinikalle, hoitolalle tai hyvinvointiyritykselle. Palvelut, hinnasto ja ajanvaraus on rakennettu niin, että uuden asiakkaan on helppo varata aika.",
    details: ["Ajanvarauksen liitos", "Palvelut ja hinnasto", "Henkilöesittelyt"],
  }),
  template({
    id: "toimisto",
    name: "Toimisto",
    tier: 3,
    audience: "Asiantuntijayrityksille",
    description:
      "Sivusto tilitoimistolle, lakitoimistolle tai konsultille. Selkeä rakenne kertoo osaamisestasi ja ohjaa kävijän ottamaan yhteyttä.",
    details: ["Enintään 8 sivua", "Artikkelit tai blogi", "Yhteydenottopolut"],
  }),
  template({
    id: "kauppa",
    name: "Kauppa",
    tier: 4,
    audience: "Verkkokauppiaille",
    description:
      "Verkkokauppa, jossa ostaminen on vaivatonta. Tuotesivut, ostoskori ja verkkomaksut kuuluvat pakettiin.",
    details: ["Tuotteet ja ostoskori", "Verkkomaksut", "Tilausten hallinta"],
  }),
  template({
    id: "mittatilaus",
    name: "Mittatilaus",
    tier: 5,
    audience: "Kun valmis malli ei riitä",
    description:
      "Suunnittelemme ja koodaamme sivuston alusta asti sinun tavoitteidesi mukaan. Lähtökohtana ei ole malli vaan liiketoimintasi.",
    details: ["Uniikki ulkoasu", "Räätälöidyt toiminnot", "Oma projektisuunnitelma"],
  }),
];

export function findTemplate(id: string | null | undefined): Template | undefined {
  return id ? templates.find((item) => item.id === id) : undefined;
}

/** Human-readable template choice for e-mails and the forwarded quote request. */
export function templateLabel(id: string | null | undefined): string {
  const item = findTemplate(id);
  return item ? `${item.name} (${item.price})` : "Ei vielä valittu";
}

const nav: InteractiveLink[] = [
  { heading: "Sivumallit", subheading: "Kahdeksan valmista lähtökohtaa", href: "/#mallit", imgSrc: "/nav/sivumallit.webp" },
  { heading: "Palvelu", subheading: "Mitä jokaiseen sivustoon kuuluu", href: "/#palvelu", imgSrc: "/nav/palvelu.webp" },
  { heading: "Prosessi", subheading: "Neljä vaihetta ideasta julkaisuun", href: "/#prosessi", imgSrc: "/nav/prosessi.webp" },
  { heading: "Hinnasto", subheading: "Kiinteät hinnat ilman yllätyksiä", href: "/#hinnasto", imgSrc: "/nav/hinnasto.webp" },
  { heading: "Tarjous", subheading: "Kerro, mitä tarvitset", href: "/#tarjous", imgSrc: "/nav/tarjous.webp" },
];

const beltLabels: SushiConveyorMenuLabels = {
  add: "Valitse tämä malli",
  close: "Sulje",
  previous: "Edellinen malli",
  next: "Seuraava malli",
  pause: "Pysäytä hihna",
  belt: "Sivumallien hihna",
  roleDescription: "liukuhihna",
};

export const site = {
  name: "Elite Code",
  // TODO(owner): your real domain (or set NEXT_PUBLIC_SITE_URL). `.example` is a reserved placeholder TLD.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://elitecode.example",

  seo: {
    title: "Elite Code – ensiluokkaiset verkkosivut yrityksellesi",
    description:
      "Valitse sivumalli, me räätälöimme sen yrityksesi näköiseksi ja julkaisemme sen puolestasi. Kiinteä hinta, selkeä aikataulu ja sivusto, jonka omistat itse.",
  },

  // TODO(owner): real contact details. `phone` and `businessId` are hidden while null.
  contact: {
    email: CONTACT_EMAIL,
    phone: null as string | null,
    businessId: null as string | null,
  },

  labels: {
    skip: "Siirry sisältöön",
    header: {
      menu: "Valikko",
      open: "Avaa valikko",
      close: "Sulje valikko",
      navigation: "Päävalikko",
      home: "Elite Code – etusivulle",
    },
  },

  nav,
  headerCta: { label: "Pyydä tarjous", href: "/#tarjous" },

  hero: {
    eyebrow: "Verkkosivut yrityksille",
    title: { lead: "Ensiluokkaiset verkkosivut,", emphasis: "valmiina viikoissa." },
    lead: "Valitse sivumalli, ja me muokkaamme siitä yrityksesi näköisen: sinun sisältösi, värisi ja kuvasi. Kiinteä hinta, selkeä aikataulu ja valmis sivusto, jonka omistat itse.",
    primaryCta: { label: "Selaa sivumalleja", href: "#mallit" },
    secondaryCta: { label: "Pyydä tarjous", href: "#tarjous" },
    facts: [
      { value: "8", label: "valmista sivumallia" },
      { value: "2–4 vk", label: "tyypillinen toimitusaika" },
      { value: TIER_PRICES[1], label: "alkaen, alv 0 %" },
    ],
  },

  belt: {
    eyebrow: "Sivumallit",
    heading: "Poimi hihnalta malli, josta lähdetään liikkeelle.",
    caption: "Valitse lautanen nähdäksesi, mitä malliin kuuluu. Hihnaa voi myös pyöräyttää itse.",
    action: "Pyydä tarjous",
    actionSelected: "Jatka tarjouspyyntöön",
    labels: beltLabels,
    legendNote: "Lautasen reunan väri kertoo hintaluokan. Hinnat alv 0 %.",
  },

  selection: {
    label: "Valittu malli",
    cta: "Pyydä tarjous",
    clear: "Poista valinta",
  },

  service: {
    eyebrow: "Palvelu",
    heading: "Jokainen sivusto tehdään valmiiksi asti.",
    lead: "Sivumalli on lähtökohta, ei kompromissi. Hintaan kuuluu kaikki, mitä toimiva sivusto tarvitsee julkaisupäivänä.",
    items: [
      {
        icon: "palette",
        title: "Räätälöity ilme",
        text: "Värit, typografia ja kuvitus sovitetaan brändiisi. Lopputulos näyttää sinulta, ei mallilta.",
      },
      {
        icon: "smartphone",
        title: "Toimii kaikilla laitteilla",
        text: "Sivusto suunnitellaan ensin puhelimelle ja viimeistellään isoille näytöille.",
      },
      {
        icon: "gauge",
        title: "Nopea ja kevyt",
        text: "Optimoidut kuvat ja siisti koodi pitävät latausajat lyhyinä myös mobiiliverkossa.",
      },
      {
        icon: "search",
        title: "Hakukoneystävällinen",
        text: "Tekninen hakukoneoptimointi, selkeä sivurakenne ja jakokuvat ovat mukana alusta asti.",
      },
      {
        icon: "accessibility",
        title: "Saavutettava",
        text: "Riittävät kontrastit, näppäimistökäyttö ja selkeä rakenne palvelevat jokaista kävijää.",
      },
      {
        icon: "key",
        title: "Sinä omistat sivusi",
        text: "Saat koodin, sisällöt ja tunnukset itsellesi. Ei pakollisia kuukausimaksuja meille.",
      },
    ],
  },

  process: {
    eyebrow: "Prosessi",
    heading: "Neljä vaihetta ideasta julkaisuun.",
    lead: "Tiedät koko ajan, missä mennään ja mitä seuraavaksi tapahtuu.",
    steps: [
      {
        title: "Valinta",
        text: "Poimi hihnalta sivumalli, joka on lähimpänä tarvettasi, ja lähetä tarjouspyyntö. Jos et ole varma, kerro yrityksestäsi, niin ehdotamme sopivinta.",
      },
      {
        title: "Määrittely",
        text: "Käymme tarpeesi läpi lyhyessä aloituspalaverissa. Saat kirjallisen tarjouksen, jossa ovat hinta, sisältö ja aikataulu.",
      },
      {
        title: "Sovitus",
        text: "Sovitamme mallin ilmeeseesi ja viemme tekstit ja kuvat paikoilleen. Seuraat työtä esikatselulinkistä, ja kaksi korjauskierrosta kuuluu hintaan.",
      },
      {
        title: "Julkaisu",
        text: "Julkaisemme sivuston verkkotunnuksessasi ja opastamme sen päivittämiseen. Sen jälkeen sivusto on sinun.",
      },
    ],
  },

  pricing: {
    eyebrow: "Hinnasto",
    heading: "Kiinteä hinta, jonka tiedät ennen kuin aloitamme.",
    lead: "Sivumallin hinta sisältää suunnittelun, toteutuksen ja julkaisun. Laajennukset hinnoitellaan erikseen ja sovitaan aina etukäteen.",
    tierHeading: "Sivumallit",
    includedHeading: "Jokaiseen hintaan sisältyy",
    included: [
      "Ulkoasun sovitus yrityksesi ilmeeseen",
      "Responsiivinen toteutus puhelimelle, tabletille ja tietokoneelle",
      "Tekninen hakukoneoptimointi ja jakokuvat",
      "Yhteydenottolomake",
      "Kaksi korjauskierrosta ennen julkaisua",
      "Julkaisu omaan verkkotunnukseesi ja käyttöopastus",
    ],
    extrasHeading: "Lisäpalvelut",
    // TODO(owner): confirm add-on prices.
    extras: [
      { name: "Lisäsivu", price: "90 € / sivu" },
      { name: "Kieliversio", price: "alk. 290 €" },
      { name: "Tekstien kirjoitus", price: "alk. 190 €" },
      { name: "Logo ja visuaalinen ilme", price: "alk. 490 €" },
      { name: "Ylläpito ja pienet päivitykset", price: "39 € / kk" },
    ],
    note: "Hinnat alv 0 %, ja niihin lisätään voimassa oleva arvonlisävero. Saat aina kirjallisen tarjouksen, jossa lopullinen hinta on kiinteä.",
    cta: "Pyydä tarjous",
  },

  faq: {
    eyebrow: "Usein kysyttyä",
    heading: "Hyvä tietää ennen kuin aloitetaan.",
    items: [
      {
        q: "Kuinka nopeasti sivusto valmistuu?",
        a: "Yhden sivun Kipinä valmistuu tyypillisesti noin viikossa ja laajemmat mallit 2–4 viikossa siitä, kun olemme saaneet sisällöt. Mittatilaustyön aikataulu sovitaan projektisuunnitelmassa.",
      },
      {
        q: "Näyttävätkö sivuni samalta kuin jonkun toisen?",
        a: "Eivät. Malli määrittää rakenteen, mutta värit, typografia, kuvat ja sisältö tehdään yrityksesi mukaan. Jos haluat ulkoasun, jota ei varmasti ole kenelläkään muulla, valitse Mittatilaus.",
      },
      {
        q: "Mitä jos mikään malli ei sovi suoraan?",
        a: "Mallit ovat lähtökohtia. Rakennetta, osioita ja ulkoasua muokataan tarpeesi mukaan, ja jos muutoksia kertyy paljon, ehdotamme mittatilaustyötä.",
      },
      {
        q: "Tarvitsenko valmiit tekstit ja kuvat?",
        a: "Et välttämättä. Saat meiltä selkeän listan tarvittavasta sisällöstä, ja tekstien kirjoituksen voi tilata lisäpalveluna. Kuvituksessa käytämme tarvittaessa laadukkaita kuvapankkikuvia.",
      },
      {
        q: "Voinko päivittää sivustoa itse?",
        a: "Kyllä. Sivusto rakennetaan niin, että tekstien ja kuvien vaihtaminen onnistuu ilman koodaustaitoja, ja opastamme käytön julkaisun yhteydessä.",
      },
      {
        q: "Mitä kuluja tulee julkaisun jälkeen?",
        a: "Verkkotunnus ja palvelintila ovat juoksevia kuluja, jotka tulevat omiin nimiisi. Kerromme arvion niistä tarjouksessa. Ylläpitopalvelumme on vapaaehtoinen.",
      },
      {
        q: "Kuka omistaa valmiin sivuston?",
        a: "Sinä. Kun lasku on maksettu, sivuston koodi, sisällöt ja tunnukset ovat sinun, ja voit halutessasi siirtää sivuston toiselle tekijälle.",
      },
    ],
  },

  quote: {
    eyebrow: "Tarjouspyyntö",
    heading: "Kerro, mitä tarvitset.",
    lead: "Täytä lomake, niin palaamme asiaan kiinteähintaisen tarjouksen kanssa. Tarjouspyyntö on maksuton eikä sido sinua mihinkään.",
    points: ["Kiinteä hinta kirjallisena", "Ei sitoumuksia", "Vastaus sähköpostiisi"],
    direct: "Kirjoitatko mieluummin suoraan?",
    requiredNote: "Tähdellä merkityt kentät ovat pakollisia.",
    fields: {
      name: "Nimi",
      company: "Yritys",
      email: "Sähköposti",
      phone: "Puhelin",
      optional: "valinnainen",
      template: "Sivumalli",
      templateUndecided: "En ole vielä päättänyt",
      message: "Kerro projektistasi",
      messageHint: "Esimerkiksi toimiala, nykyinen sivusto ja toivottu aikataulu.",
      consent: "Hyväksyn, että tietojani käytetään tarjouspyyntöni käsittelyyn",
      consentLink: "tietosuojaselosteen",
      consentTail: "mukaisesti.",
      newTab: "avautuu uuteen välilehteen",
    },
    submit: "Lähetä tarjouspyyntö",
    sending: "Lähetetään…",
    errorSummary: "Tarkista merkityt kentät.",
    success: {
      title: "Kiitos, pyyntösi on perillä.",
      text: "Palaamme asiaan sähköpostitse mahdollisimman pian.",
      again: "Lähetä uusi pyyntö",
    },
    fallback: {
      title: "Viimeistele lähetys sähköpostissa",
      text: "Avasimme viestisi sähköpostiohjelmaasi. Lähetä se sieltä, niin pyyntö tulee perille. Jos ohjelma ei auennut, kirjoita meille osoitteeseen",
      retry: "Avaa sähköposti uudelleen",
    },
    failure: "Lähetys ei onnistunut. Yritä hetken kuluttua uudelleen tai kirjoita meille suoraan osoitteeseen",
    busy: "Lähetyksiä on tullut lyhyessä ajassa liian monta. Odota hetki tai kirjoita meille suoraan osoitteeseen",
    mailSubject: "Tarjouspyyntö",
  },

  privacy: {
    title: "Tietosuojaseloste",
    updated: "Päivitetty: lisää päivämäärä ennen julkaisua",
    intro:
      "Tässä selosteessa kerrotaan, mitä henkilötietoja Elite Code kerää tämän verkkosivuston kautta, mihin niitä käytetään ja miten voit vaikuttaa tietojesi käsittelyyn.",
    // TODO(owner): have the final text checked and fill in the controller's official details.
    sections: [
      {
        heading: "Rekisterinpitäjä",
        body: [
          "Elite Code. Rekisterinpitäjän viralliset tiedot (yrityksen nimi, Y-tunnus ja osoite) lisätään tähän ennen sivuston julkaisua.",
          `Tietosuojaa koskevat yhteydenotot: ${CONTACT_EMAIL}`,
        ],
      },
      {
        heading: "Mitä tietoja keräämme",
        body: [
          "Keräämme vain ne tiedot, jotka annat itse tarjouspyyntölomakkeella: nimen, sähköpostiosoitteen, valinnaisesti puhelinnumeron ja yrityksen nimen, valitsemasi sivumallin sekä vapaamuotoisen viestisi.",
          "Sivusto ei käytä seuranta- tai mainosevästeitä. Valitsemasi väriteema tallennetaan vain omaan selaimeesi, eikä sitä lähetetä meille.",
        ],
      },
      {
        heading: "Mihin tietoja käytetään",
        body: [
          "Käytämme tietoja ainoastaan tarjouspyyntöösi vastaamiseen, tarjouksen laatimiseen ja mahdollisen asiakassuhteen hoitamiseen. Käsittelyn perusteena on suostumuksesi sekä sopimusta edeltävät toimenpiteet.",
        ],
      },
      {
        heading: "Säilytys ja luovutukset",
        body: [
          "Säilytämme tarjouspyynnön tietoja niin kauan kuin se on tarpeen pyynnön käsittelemiseksi ja lakisääteisten velvoitteiden täyttämiseksi. Emme myy tietoja emmekä luovuta niitä markkinointitarkoituksiin.",
          "Tietoja voivat käsitellä puolestamme palveluntarjoajat, joita käytämme sähköpostin ja lomakkeiden välittämiseen.",
        ],
      },
      {
        heading: "Sinun oikeutesi",
        body: [
          "Sinulla on oikeus tarkastaa itseäsi koskevat tiedot, pyytää niiden oikaisemista tai poistamista ja peruuttaa antamasi suostumus. Voit myös tehdä valituksen tietosuojavaltuutetun toimistolle.",
          "Pyynnöt voi lähettää yllä mainittuun sähköpostiosoitteeseen.",
        ],
      },
    ],
    back: "Takaisin etusivulle",
  },

  notFound: {
    eyebrow: "404",
    heading: "Tätä sivua ei löytynyt.",
    text: "Osoite on voinut muuttua tai sivu on poistettu. Etusivulta löydät sivumallit ja tarjouspyynnön.",
    cta: "Etusivulle",
  },

  footer: {
    heading: "Aloitetaanko?",
    tagline: "Verkkosivut valmiista mallista tai mittatilauksena.",
    navigation: "Alatunnisteen valikko",
    privacy: { label: "Tietosuojaseloste", href: "/tietosuoja" },
    rights: "Kaikki oikeudet pidätetään.",
  },
} as const;

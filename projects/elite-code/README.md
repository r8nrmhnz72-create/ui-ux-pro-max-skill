# Elite Code – verkkosivusto

Yhden sivun myyntisivusto yritykselle, joka myy verkkosivuja valmiista sivumalleista ja mittatilauksena.
Kävijä poimii sivumallin liukuhihnalta, ja valinta kulkee mukana tarjouspyyntölomakkeelle.

**Tekniikka:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui-rakenne ja -tokenit ·
three.js · motion · lucide-react

## Käyttöönotto

```bash
cd projects/elite-code
npm install
npm run dev      # http://localhost:3000
npm run build    # tuotantokäännös
npm start        # tuotantokäännöksen ajo
npm run lint
```

Vaatii Node.js 20.9:n tai uudemman.

## Ennen julkaisua

Sivustolla on paikkamerkkejä, jotka on merkitty tiedostoon `content/site.ts` kommentilla `TODO(owner)`:

| Mitä | Missä | Nyt |
| --- | --- | --- |
| Verkkotunnus | `site.url` tai ympäristömuuttuja `NEXT_PUBLIC_SITE_URL` | `https://elitecode.example` |
| Sähköposti | `CONTACT_EMAIL` | `hei@elitecode.example` |
| Puhelin, Y-tunnus | `site.contact` | piilossa, kunnes arvo annetaan |
| Sivumallien hinnat | `TIER_PRICES` | suuntaa antavia |
| Lisäpalveluiden hinnat | `site.pricing.extras` | suuntaa antavia |
| Toimitusajat ja lupaukset | `site.hero.facts`, `site.process`, `site.faq` | tarkista, että vastaavat tarjontaasi |
| Tietosuojaseloste | `site.privacy` | runko; täydennä rekisterinpitäjän tiedot ja päivämäärä |

`.example` on varattu testipääte, joten paikkamerkit eivät voi osoittaa kenenkään oikeaan osoitteeseen.

## Sisällön muokkaaminen

Kaikki tekstit, hinnat, sivumallit, valikon linkit ja yhteystiedot ovat tiedostossa **`content/site.ts`**.
Komponenteissa ei ole omaa tekstiä.

- **Uusi sivumalli:** lisää rivi `templates`-taulukkoon ja kuva `public/plates/<id>.webp`
  (neliö, pyöreä lautanen läpinäkyvällä taustalla).
- **Hintaluokat:** `TIER_PRICES` ohjaa samalla hihnan selitettä, lautasten hintoja ja hinnastoa.
- **Otsikon korostus:** `*tähtien välissä*` oleva osa ladotaan kursiivilla korostusvärillä.

Värit ja fontit ovat tiedostossa `app/globals.css` (shadcn-tokenit, vaalea ja tumma teema).

## Kolme pääkomponenttia

Komponentit ovat shadcn-käytännön mukaisesti kansiossa `components/ui/`.

| Komponentti | Käyttö sivustolla | Muutokset alkuperäiseen |
| --- | --- | --- |
| `particle-wave.tsx` | Etusivun yläosan tausta | Piirtää läpinäkyvälle pohjalle ja ottaa värin teemasta, mitoittuu säiliönsä mukaan, pysähtyy näkymän ulkopuolella ja taustavälilehdessä, näyttää pysäytyskuvan kun käyttäjä on pyytänyt vähemmän liikettä, nopeus ei riipu näytön virkistystaajuudesta, ladataan vasta sivun jälkeen omana pakettinaan. |
| `interactive-hover-links.tsx` | Koko ruudun päävalikko ja alatunnisteen valikko | Linkit annetaan propsina, `onNavigate` sulkee valikon, otsikko luetaan ruudunlukijalle yhtenä sanana, näppäimistökohdistus saa saman tehosteen kuin hiiri, kaksi kokoa. |
| `sushi-conveyor-menu.tsx` | Sivumallin valinta | Käytännössä sellaisenaan; lisätty kaksi käännettävää saavutettavuustekstiä (`labels.belt`, `labels.roleDescription`). |

## Tarjouslomake

Lomake lähettää pyynnön reitille `POST /api/quote`, joka tarkistaa tiedot ja välittää ne eteenpäin JSON-muodossa
osoitteeseen `QUOTE_FORM_ENDPOINT`. Osoitteeksi käy mikä tahansa JSON-POSTin vastaanottava lomakepalvelu
tai oma rajapinta.

```bash
# .env.local
QUOTE_FORM_ENDPOINT=https://lomakepalvelusi.example/vastaanotto
NEXT_PUBLIC_SITE_URL=https://www.omadomain.fi
```

Jos muuttujaa ei ole asetettu, reitti vastaa `501` ja lomake avaa valmiiksi täytetyn viestin kävijän
sähköpostiohjelmaan. Sivusto siis toimii jo ennen kuin lomakepalvelu on kytketty, mutta pyynnöt tulevat
silloin perille vain, jos kävijä lähettää sähköpostin itse.

## Kuvitus

Hihnan lautaset, valikon kuvat, jakokuva ja kuvakkeet on piirretty koodilla (HTML/CSS → Chromium → WebP/PNG),
joten ne voi tuottaa uudelleen:

```bash
npm i -D playwright
node scripts/art/render-plates.cjs   # public/plates/*.webp
node scripts/art/render-covers.cjs   # public/nav/*.webp, app/opengraph-image.png, app/apple-icon.png
```

## Rakenne

```
app/                  layout, etusivu, /tietosuoja, /api/quote, robots, sitemap, kuvakkeet
components/ui/        kolme pääkomponenttia + button (shadcn)
components/site/      sivuston osiot: otsikkopalkki, hero, hihna, osiot, lomake, alatunniste
content/site.ts       kaikki sisältö
lib/                  cn(), lomakkeen validointi, valitun mallin tila
public/plates, nav    kuvitus
scripts/art/          kuvituksen generointi
```

## Julkaisu

Sivusto on tavallinen Next.js-sovellus. Vercelissä aseta projektin juurikansioksi `projects/elite-code`
ja lisää ympäristömuuttujat `NEXT_PUBLIC_SITE_URL` ja `QUOTE_FORM_ENDPOINT`.

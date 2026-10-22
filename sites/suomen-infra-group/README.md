# Suomen Infra Group Oy – kotisivu

React + TypeScript + Tailwind CSS v4 + shadcn-rakenne, rakennettu Vitellä.
Ulkoasu on haettu ui-ux-pro-max-taidolla (teollisuuden harmaa + huomio-oranssi).

## Käyttö

```bash
npm install
npm run dev      # kehityspalvelin: http://localhost:5173
npm run build    # valmis sivusto kansioon dist/
```

`dist/`-kansion sisältö on tavallisia tiedostoja: julkaise ne GitHub Pagesiin,
Netlifyyn, Verceliin tai webhotelliin. Polut ovat suhteellisia, joten sivu toimii
myös alikansiossa.

## Rakenne

```
src/
├── App.tsx                    # sivun osiot järjestyksessä
├── index.css                  # Tailwind + teeman värit (vaalea ja tumma)
├── lib/utils.ts               # shadcn:n cn()-apufunktio
└── components/
    ├── ui/hero.tsx            # shader-hero (ShaderShowcase)
    ├── ui/demo.tsx            # alkuperäisen komponentin käyttöesimerkki
    ├── sections.tsx           # palvelut, henkilöstövuokraus, faktat, alatunniste
    └── quote-form.tsx         # tarjouspyyntölomake
components.json                # shadcn-asetukset (aliakset @/components/ui jne.)
```

Miksi `components/ui`? shadcn CLI (`npx shadcn add button`) asentaa komponentit
juuri tähän kansioon `components.json`-tiedoston aliasten perusteella. Kun
kaikki UI-komponentit ovat samassa paikassa, ne löytyvät samalla
`@/components/ui/...`-polulla ja uudet shadcn-komponentit asettuvat oikein.

## Lomakkeen sähköpostilähetys

Lomake lähettää viestit [FormSubmit](https://formsubmit.co)-palvelun kautta.

1. Rakenna sivu vastaanottajan osoitteella:
   `VITE_FORM_EMAIL=myynti@yritys.fi npm run build`
   (tai luo tiedosto `.env.production`, jossa rivi `VITE_FORM_EMAIL=myynti@yritys.fi`).
2. Julkaise `dist/` ja lähetä lomakkeella yksi testiviesti.
3. Klikkaa FormSubmitin vahvistusviestin linkkiä. Sen jälkeen kaikki
   tarjouspyynnöt tulevat suoraan sähköpostiin.

## Täydennettävät tiedot

Korvaa hakasulkeissa olevat kohdat tiedostossa `src/components/sections.tsx`:
`[Y-TUNNUS]`, `[TOIMINTA-ALUE]`, `[KÄYNTIOSOITE]`, `[PUHELIN]`, `[SÄHKÖPOSTI]`.

Aiempi pelkkä HTML-versio on kansiossa `legacy-static/`.

# Automaattisen demopalvelun käyttöönotto

Kun asiakas täyttää sivun **Ilmainen demosivusto** -lomakkeen, palvelu:

1. tarkistaa tiedot ja roskapostisuojan (piilokenttä + päiväkohtaiset rajat),
2. pyytää Claudea rakentamaan asiakkaan toiveista yhden sivun demon (n. 1–4 min),
3. tallentaa demon omaan osoitteeseen `sivustosi.fi/demo/<tunnus>`,
4. lähettää linkin asiakkaalle sähköpostilla ja kopion sinulle.

Jos demon teko epäonnistuu, asiakas saa viestin "teemme demon käsin" ja sinä saat
ilmoituksen asiakkaan tiedoilla.

Tarvitset kolme tiliä ja oman verkkotunnuksen (esim. `sivuseppa.fi`, n. 10–20 €/v).

## 1. Anthropic (Claude) – tekee demot

1. Luo tili osoitteessa https://console.anthropic.com
2. **Billing**: lisää maksukortti ja osta krediittejä (esim. 10 $).
3. **Limits**: aseta kuukausittainen kulukatto, esim. 20 $.
4. **API Keys → Create Key**. Kopioi avain (alkaa `sk-ant-`). Se näytetään vain kerran.

Hinta-arvio: noin 0,10–0,40 € demoa kohden.

## 2. Resend – lähettää sähköpostit

1. Luo tili osoitteessa https://resend.com (ilmaiseksi 3 000 viestiä/kk).
2. **Domains → Add Domain**: lisää verkkotunnuksesi ja lisää Resendin antamat
   DNS-tietueet verkkotunnuksen hallintaan. Odota, kunnes tila on *Verified*.
3. **API Keys → Create API Key**. Kopioi avain (alkaa `re_`).

Ilman omaa vahvistettua verkkotunnusta Resend lähettää viestejä vain omaan
osoitteeseesi, eli asiakkaat eivät saisi demoja.

## 3. Vercel – pyörittää sivun ja palvelun

1. Luo tili osoitteessa https://vercel.com ja kirjaudu GitHub-tunnuksella.
2. **Add New → Project** → valitse tämä repo.
   - **Root Directory**: `projects/nettisivumyynti`
   - Framework: Vite (tunnistuu yleensä itse)
3. Projektin **Storage → Create → Blob** → luo varasto ja yhdistä se projektiin.
   Tämä lisää `BLOB_READ_WRITE_TOKEN`-muuttujan automaattisesti.
4. **Settings → Environment Variables**: lisää muuttujat tiedostosta `.env.example`:

   | Muuttuja | Esimerkki |
   |---|---|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` |
   | `RESEND_API_KEY` | `re_...` |
   | `DEMO_FROM_EMAIL` | `Sivuseppä <demo@sivuseppa.fi>` |
   | `OWNER_EMAIL` | oma sähköpostisi |
   | `SITE_URL` | `https://sivuseppa.fi` |
   | `DEMO_DAILY_LIMIT` | `30` |
   | `DEMO_HASH_SALT` | mikä tahansa satunnainen merkkijono |

5. **Deployments → Redeploy**, jotta muuttujat tulevat käyttöön.
6. **Settings → Domains**: lisää oma verkkotunnuksesi.

## 4. Testaa

Täytä lomake omalla sähköpostillasi. Muutaman minuutin päästä sinulle pitäisi tulla
kaksi viestiä: asiakkaan viesti ja kopio. Jos mitään ei tule, katso
Vercelissä **Logs** – virheet näkyvät rivillä `[demo ...]`.

## Turvallisuus

- Demot näytetään eristettyinä: niissä ei voi ajaa koodia, eivätkä ne voi lähettää lomakkeita.
- Jokaisessa demossa on alareunassa "Demo · tehnyt Sivuseppä" -merkki.
- Rajat: `DEMO_DAILY_LIMIT` demoa päivässä yhteensä, 3 per IP-osoite ja 2 per sähköposti.
- Saat kopion jokaisesta demosta, joten näet heti, jos jokin menee pieleen.
- Kerro tietosuojaselosteessasi, että demon tekemiseen käytetään tekoälyä (Anthropic) ja
  sähköpostin lähetykseen Resendiä.

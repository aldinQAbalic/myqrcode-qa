# P0 test slučajevi – myqrcode.com

*P0 = mora proći prije svakog izdanja. Kolona „Auto“: ✅ automatizovano, 🟡 napisano (čeka nalog/selektore), ✋ ručno.*

| ID | Oblast | Naslov | Auto | Spec |
|---|---|---|---|---|
| P0-01 | Javno | Početna se učitava, CTA vodi na generator | ✅ | smoke/public-pages |
| P0-02 | Kreiranje | Generator prikazuje svih 12 tipova | ✅ | smoke/public-pages |
| P0-03 | Kreiranje | Validacija URL polja (prazno / neispravno) | ✅ | smoke/generator-flow |
| P0-04 | Dinamički QR | Preview se dekodira u kratki link koji preusmjerava na cilj | ✅ | smoke/generator-flow |
| P0-05 | Dizajn | Izmjena dizajna ne mijenja sadržaj i QR ostaje čitljiv | ✅ | smoke/generator-flow, regression/design |
| P0-06 | Auth | Anonimni download → sign-up zid | ✅ | smoke/generator-flow |
| P0-07 | Auth | Registracija novim e-mailom | ✋ | – |
| P0-08 | Auth | Login postojećim nalogom + sesija | 🟡 | setup/auth.setup |
| P0-09 | Download | PNG se dekodira u isti kratki link kao preview | 🟡 | regression/download.auth |
| P0-10 | Download | SVG validan i čitljiv | 🟡 | regression/download.auth |
| P0-11 | Dinamički QR | Izmjena cilja mijenja redirect, kod ostaje isti | 🟡 fixme | regression/dashboard.auth |
| P0-12 | Analitika | Skeniranje se broji u dashboardu | 🟡 | regression/dashboard.auth |
| P0-13 | Plaćanje | Cijene i uslovi automatske obnove jasno prikazani | ✅ | smoke/public-pages |
| P0-14 | Plaćanje | Kupovina triala (sandbox) i aktivacija funkcija | ✋ | – |
| P0-15 | Plaćanje | Otkazivanje pretplate sprječava obnovu | ✋ | – |
| P0-16 | Fizički | Skeniranje telefonom (iOS + Android) | ✋ | – |

---

### P0-03 · Validacija URL polja
**Preduslov:** anonimni korisnik. **Podaci:** `""`, `not a url`.
1. Otvori `/generator/url`.
2. Klikni „Next“ bez unosa.
3. Unesi `not a url`, klikni „Next“.

**Očekivano:** (2) poruka *This field is required and cannot be left blank.* (3) poruka *You have entered an invalid link.*; URL ostaje `/generator/url`, draft se ne kreira.

### P0-04 · Dinamički kratki link
**Podaci:** `https://example.com/`.
1. `/generator/url` → unesi URL → „Next“.
2. Na koraku dizajna dekodiraj preview QR.
3. Otvori dekodirani link.

**Očekivano:** (1) URL `/generator/qr?id=<uuid>`. (2) Sadržaj odgovara `^https://myqrcode.mobi/[A-Za-z0-9]+$`, nikad direktno ciljni URL. (3) Završava na `example.com`.

### P0-05 · Dizajn čuva sadržaj
1. Kreiraj draft (P0-04 koraci 1–2), zapamti dekodirani link.
2. Promijeni uzorak u „rounded“ i boju tačaka u `#1A237E`.
3. Ponovo dekodiraj.

**Očekivano:** isti link; QR se i dalje dekodira. (Regresija ponavlja za svih 6 uzoraka, okvir, logo, upload logotipa.)

### P0-06 · Sign-up zid
1. Kreiraj draft, klikni „Download QR“.

**Očekivano:** URL `/generator/sign-up?id=<isti uuid>`, dialog „Download QR Code“ s e-mail poljem, „Continue“ i social dugmadima; ništa se ne preuzima.

### P0-07 · Registracija (ručno)
1. `/sign-up` → novi e-mail (alias, npr. `ime+qa1@…`) → „Create Account“.
2. Završi korake iz e-maila/forme.

**Očekivano:** nalog kreiran, korisnik prijavljen, draft iz sesije (ako postoji) vezan za nalog; duplikat e-maila daje jasnu grešku.

### P0-08 · Login i sesija
1. `/login` → e-mail → „Log in“ → (lozinka) → potvrda.
2. Zatvori i ponovo otvori browser.

**Očekivano:** preusmjerenje van `/login`; sesija ostaje; pogrešna lozinka daje poruku bez otkrivanja postoji li nalog.

### P0-09 · PNG download
**Preduslov:** prijavljen, aktivan trial/plan.
1. Kreiraj draft, dekodiraj preview.
2. „Download QR“ → PNG.

**Očekivano:** fajl `.png`, validan PNG potpis, dekodiran sadržaj = link iz previewa.

### P0-10 · SVG download
Kao P0-09, format SVG. **Očekivano:** počinje `<svg`, nakon renderovanja dekodira se u isti link.

### P0-11 · Izmjena cilja dinamičkog QR-a
1. Kreiraj QR → cilj A, preuzmi PNG.
2. U dashboardu promijeni cilj u B.
3. Otvori kratki link iz starog PNG-a.

**Očekivano:** vodi na B; kratki link nepromijenjen.

### P0-12 · Analitika
1. Zapamti broj skeniranja QR-a.
2. Otvori kratki link iz novog, „čistog“ konteksta (bez kolačića).

**Očekivano:** broj se poveća u roku od 60 s.

### P0-13 · Transparentnost cijena
1. Otvori `/prices`.

**Očekivano:** vidljivi „7-Day Full Access“ ($1.95) s tekstom *After 7 days, renews to $49 every 4 weeks. Cancel anytime.* i „Yearly Plan“ s iznosom koji se plaća unaprijed; link „Cancel subscription“ u footeru radi.

### P0-14 · Kupovina triala (samo sandbox/test kartica)
**Očekivano:** iznos na checkoutu = iznos na `/prices`; nakon uplate download otključan; e-mail potvrda sadrži datum i iznos obnove.

### P0-15 · Otkazivanje
**Očekivano:** otkazivanje moguće bez kontaktiranja podrške; potvrda na ekranu i e-mailom; nema naplate $49 nakon 7 dana.

### P0-16 · Fizičko skeniranje
Preuzeti PNG, SVG i PDF (odštampan i sa ekrana) skenirati iOS kamerom i Android Google Lensom; uključiti varijantu s logom i okvirom. **Očekivano:** svi vode na cilj.

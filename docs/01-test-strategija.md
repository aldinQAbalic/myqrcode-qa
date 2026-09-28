# myqrcode.com – QA hub i test strategija

_Verzija 1.0 · 28.09.2026 · Projekat za vježbu (portfolio). Okruženje: samo produkcija, bez staginga._

## Dokumenti u hubu

| #   | Dokument               | Svrha                                           |
| --- | ---------------------- | ----------------------------------------------- |
| 01  | Test strategija (ovaj) | Obim, pristup, okruženja, rizici, kriteriji     |
| 02  | Mapa funkcionalnosti   | Šta aplikacija radi, rute, selektori, prioritet |
| 03  | P0 test slučajevi      | Kritični scenariji, veza s automatizacijom      |
| 04  | Šablon za bug          | Kako prijaviti defekt                           |
| 05  | Release checklist      | Provjera prije/poslije izdanja                  |
| –   | Repo `myqrcode-qa`     | Playwright + TS, POM, CI                        |

## 1. Proizvod ukratko

SaaS generator QR kodova. Tok: **tip → sadržaj → dizajn → download**. Download traži nalog (sign-up zid).
QR kodovi su **dinamički**: kod sadrži kratki link `https://myqrcode.mobi/<id>` koji preusmjerava na cilj, što omogućava izmjenu cilja i analitiku skeniranja.
Monetizacija: **7-dnevni pristup za $1.95** koji se automatski obnavlja na **$49 / 4 sedmice**, ili godišnji plan **$19/mj ($228 unaprijed)**.

## 2. Ciljevi kvaliteta

1. Svaki preuzeti QR se **skenira** i vodi na tačan cilj (osnovna vrijednost proizvoda).
2. Kratki link radi dok je pretplata aktivna; ponašanje po isteku je predvidivo i objašnjeno korisniku.
3. Naplata i obnova su transparentne (cijena, obnova, otkazivanje) – visok pravni i reputacijski rizik.
4. Analitika broji skeniranja pouzdano.

## 3. Obim

**U obimu:** auth (email, Google/Facebook/Apple, oporavak lozinke), svih 12 tipova QR-a, dizajn (okvir, uzorak, uglovi, boje, logo), download PNG/SVG/PDF, dinamički redirect, dashboard i analitika, cijene/trial/otkazivanje, lokalizacija (EN + ostali jezici), responsive (desktop + mobilni).

**Van obima (za sada):** stvarna naplata na produkciji, load/perf testovi na produkciji, penetracijsko testiranje, e-mail sadržaj (nema pristupa inboxu).

## 4. Pristup po nivoima

| Nivo                 | Šta                                                                            | Alat                                      | Kada            |
| -------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- | --------------- |
| Unit (helperi)       | Dekodiranje QR-a iz PNG/SVG                                                    | Playwright + jsqr/pngjs                   | Svaki PR        |
| E2E smoke            | Javne stranice, anonimni tok, redirect, sign-up zid                            | Playwright                                | Svaki PR        |
| E2E regresija        | Svi tipovi, dizajn varijante, download, dashboard                              | Playwright (2 sharda)                     | Svaku noć 03:00 |
| Ručno / istraživački | Fizičko skeniranje telefonom, plaćanje u sandboxu, e-mailovi, vizuelni detalji | Telefon (iOS kamera, Android Google Lens) | Prije izdanja   |

**Piramida:** većina provjere QR sadržaja ide kroz dekodiranje (brzo, deterministički), a mali broj fizičkih skeniranja telefonom potvrđuje da jsqr i stvarni čitači daju isti rezultat.

## 5. Okruženja i podaci

- Samo **produkcija** (`https://myqrcode.com`, kratki linkovi `myqrcode.mobi`). Nema staginga.
- Testovi prave draftove s prefiksom `qa-auto-` da se lako prepoznaju i počiste.
- Test nalog: dodaje se kasnije → `.env` / GitHub Secrets (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`). Bez naloga, auth testovi se automatski preskaču.
- Ciljni URL-ovi u testovima: `https://example.com/...` (stabilan, neutralan domen).

## 6. Rizici i ublažavanje

| Rizik                                             | Uticaj                    | Ublažavanje                                                                               |
| ------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| Nema `data-testid` atributa                       | Krhki selektori           | Prednost ARIA ulogama, `id`, `value`; sve u POM-u; zatražiti testid za preview i download |
| Testovi na produkciji                             | Smeće u bazi, analitika   | Blaga paralelnost, prefiks imena, noćna regresija 1×                                      |
| Social login (Google/Apple)                       | Ne može se automatizovati | `storageState` snimljen ručno (`npm run auth:save`)                                       |
| Dizajn smanjuje čitljivost (logo, niski kontrast) | QR se ne skenira          | Dekodiranje nakon svake izmjene dizajna                                                   |
| Trial automatski prelazi u skupu pretplatu        | Pravni rizik, chargeback  | P0 provjere prikaza uslova, otkazivanja i e-mail potvrde                                  |
| Asinhrona analitika                               | Flaky testovi             | `expect.poll` umjesto fiksnog čekanja                                                     |

## 7. Ulazni i izlazni kriteriji

**Ulaz u testiranje izdanja:** build je na okruženju, smoke zelen, poznate promjene opisane.
**Izlaz / spremno za izdanje:** 100 % P0 prolazi; nema otvorenih S1/S2 bugova; regresija ≥ 95 % (padovi analizirani i označeni kao flaky ili bug); fizičko skeniranje (iOS + Android) potvrđeno.

## 8. Ozbiljnost i prioritet bugova

| Ozbiljnost    | Primjer                                                 |
| ------------- | ------------------------------------------------------- |
| S1 – kritično | QR ne vodi na cilj, pogrešna naplata, pad logina za sve |
| S2 – visoko   | Jedan format downloada neispravan, analitika ne broji   |
| S3 – srednje  | Izmjena dizajna se ne sačuva, loša validacija           |
| S4 – nisko    | Tekst, poravnanje, prevod                               |

## 9. Metrike

Pass rate po sprintu, broj flaky testova (cilj < 2 %), vrijeme smoke-a (< 5 min), defekti po modulu, escaped defects (nađeni u produkciji).

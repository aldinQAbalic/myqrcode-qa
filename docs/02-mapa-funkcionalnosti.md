# Mapa funkcionalnosti – myqrcode.com

_Pregledano u browseru 28.09.2026. ✅ = viđeno na sajtu, 🔒 = iza logina (nije provjereno), P0–P2 = prioritet testiranja._

## Tok korisnika

```
Početna ──► /generator (tip) ──► /generator/<tip> (sadržaj) ──Next──► /generator/qr?id=<uuid> (dizajn)
                                                                        │ Download QR
                                                                        ▼
                                              anonimno: /generator/sign-up?id=<uuid> (sign-up zid)
                                              prijavljen: izbor formata PNG / SVG / PDF 🔒
QR sadrži https://myqrcode.mobi/<8 znakova> ──► 30x/JS redirect ──► ciljni URL
```

## 1. Autentifikacija

| Funkcija                 | Ruta / selektor                                                                    | Status                      | Prioritet |
| ------------------------ | ---------------------------------------------------------------------------------- | --------------------------- | --------- |
| Login e-mailom           | `/login`, `#email`, dugme „Log in“                                                 | ✅ (korak nakon e-maila 🔒) | P0        |
| Social login             | 3 dugmeta s ikonama (Google, Facebook, Apple) – bez teksta/aria-label              | ✅                          | P1        |
| Registracija             | `/sign-up`, `#email`, „Create Account“, „Continue with Google/Facebook/Apple“      | ✅                          | P0        |
| Oporavak lozinke         | `/recover-password` („Click here“)                                                 | ✅ link                     | P1        |
| Sign-up zid na downloadu | dialog „Download QR Code“, `#email`, „Continue“, `data-testid=dialog-close-button` | ✅                          | P0        |
| Odjava, sesija, istek    | –                                                                                  | 🔒                          | P1        |

## 2. Kreiranje QR-a po tipovima (`/generator`)

| Tip                     | Slug            | Prioritet |
| ----------------------- | --------------- | --------- |
| Website URL (MOST USED) | `url`           | P0        |
| vCard                   | `vcard`         | P1        |
| PDF                     | `pdf`           | P1        |
| Images                  | `images`        | P2        |
| Social Media            | `social-media`  | P2        |
| Video                   | `video`         | P2        |
| Simple Text             | `plain-text`    | P1        |
| Business Page           | `business-page` | P2        |
| Facebook                | `facebook`      | P2        |
| Wi-Fi                   | `wifi`          | P1        |
| App                     | `app`           | P2        |
| Menu                    | `menu`          | P2        |

**Website URL korak:** `#websiteUrl` (obavezno), `#qrName` (opcionalno, sklopljena sekcija „QR code name“), prekidač „Preview / QR code“ (radio), „Back“, „Next“.
Validacija (`p.text-error`): prazno → _This field is required and cannot be left blank._; neispravno → _You have entered an invalid link._
Nakon „Next“ nastaje draft s `?id=<uuid>`.

## 3. Dizajn (`/generator/qr?id=`)

| Sekcija (Radix accordion) | Kontrole                                                                                                                                                                            | Prioritet        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| QR code frame             | radio `value="default"` (No frame) + `"1"`–`"31"` („Scan me!“)                                                                                                                      | P1               |
| QR code pattern           | radio `square` (default), `rounded`, `dots`, `classy`, `classy-rounded`, `extra-rounded`; boje „Dot color“, „Background color“ (hex input `[data-channel=hex]`); `#qr-transparency` | P1               |
| QR code corners           | „Corner frames style“ `none/dot/square/extra-rounded`; „Corner dots type“ `none/dot/square`; dvije boje                                                                             | P2               |
| Add logo                  | 13 gotovih logotipa; upload jpg/png/svg do 5 MB (`[data-scope=file-upload] input[type=file]`)                                                                                       | P1               |
| Preview                   | inline `svg[viewBox="0 0 320 320"]`, 154 px                                                                                                                                         | P0 (dekodiranje) |

## 4. Download

| Format | Status | Provjera                                           | Prioritet |
| ------ | ------ | -------------------------------------------------- | --------- |
| PNG    | 🔒     | potpis PNG + dekodiranje = kratki link iz previewa | P0        |
| SVG    | 🔒     | validan SVG + render + dekodiranje                 | P0        |
| PDF    | 🔒     | `%PDF-` + veličina (+ ručno skeniranje)            | P1        |

## 5. Dinamički QR i redirect

- Preview draft-a već sadrži kratki link (npr. `https://myqrcode.mobi/3f8a43dc`) i link **radi i prije registracije** (redirect na cilj potvrđen).
- Za testiranje: izmjena cilja bez promjene koda 🔒, ponašanje po isteku triala/pretplate 🔒, nepostojeći ID, pauziran QR 🔒. P0.

## 6. Analitika 🔒

Broj skeniranja (ukupno/unikatno), vrijeme, uređaj/OS, lokacija. Provjera: skeniranje iz čistog konteksta povećava brojač (uz `expect.poll`). P1.

## 7. Plaćanje i trial

| Stavka                                   | Stanje na `/prices`                                                 | Prioritet  |
| ---------------------------------------- | ------------------------------------------------------------------- | ---------- |
| 7-Day Full Access                        | $1.95; _After 7 days, renews to $49 every 4 weeks. Cancel anytime._ | P0         |
| Yearly Plan                              | $19/mo; _Pay $228 upfront and save 50%_; godišnja obnova            | P0         |
| Valuta                                   | selektor „USD ($)“                                                  | P2         |
| Otkazivanje                              | `/cancel-subscription` u footeru                                    | P0         |
| Checkout, obnova, refund, e-mail potvrde | 🔒 / samo sandbox                                                   | P0 (ručno) |

## 8. Ostalo

Lokalizacija (dugme „EN“ u headeru i „English“ u footeru), statične stranice (About, Terms, Privacy, Contact, FAQ), podrška `support@myqrcode.com`, responsive/mobilni.

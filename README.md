# myqrcode-qa

E2E automatizacija za **myqrcode.com** (Playwright + TypeScript, Page Object Model).
Projekat za vježbu/portfolio – testovi idu na produkciju, pa su namjerno blagi (malo workera, bez load-a).

## Brzi start

```bash
npm ci
npx playwright install chromium
cp .env.example .env          # upiši test nalog kad ga budeš imao
npm run test:unit             # offline testovi helpera za dekodiranje QR-a
npm run test:smoke            # javni smoke (bez naloga)
npm run test:regression       # sve osim unit
npm run report                # HTML izvještaj
```

## Struktura

```
src/
  pages/          Page Objecti (Home, GeneratorType, UrlContent, Design, Auth, Pricing, Account*)
  fixtures/       test.ts (page objekti + createUrlDraft), auth.ts (preskače test bez sesije)
  utils/          env.ts, qr.ts (jsqr + pngjs), svg.ts (render SVG → PNG → decode)
tests/
  setup/          auth.setup.ts → .auth/user.json (storageState)
  unit/           provjera decode helpera (bez mreže)
  smoke/          @smoke – javne stranice + anonimni tok kreiranja
  regression/     @regression – svi tipovi, dizajn, *.auth.spec.ts (download, dashboard)
.github/workflows smoke.yml (PR), regression.yml (svaku noć, 2 sharda + spojeni izvještaj)
docs/             QA dokumentacija
```

## Playwright projekti

| Projekt | Šta | storageState |
|---|---|---|
| `unit` | helperi za QR, bez mreže | – |
| `setup` | login jednom, sprema `.auth/user.json` | – |
| `chromium` | javni testovi | – |
| `chromium-auth` | `*.auth.spec.ts` | `.auth/user.json` |
| `mobile` | testovi tagovani `@mobile` (Pixel 7) | – |

## Auth (storageState)

- Upiši `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` u `.env` (u CI: GitHub Secrets). `setup` se prijavi i spremi sesiju.
- Bez podataka `setup` napravi praznu sesiju, a `*.auth.spec.ts` testovi se sami preskoče.
- **Auth bez lozinke** (Google/Apple ili magic link): `npm run auth:save` otvori browser, prijaviš se ručno,
  sesija se spremi u `.auth/user.json`. Zatim pokreći sa `SKIP_AUTH_SETUP=1`.

## Kako radi QR provjera

1. Preview na koraku dizajna je inline SVG → screenshot elementa → `pngjs` → `jsqr`.
2. Dinamički QR ne sadrži ciljni URL nego kratki link (`https://myqrcode.mobi/<id>`); test otvara taj link i očekuje redirect na cilj.
3. Preuzeti PNG se dekodira i mora dati **isti** kratki link kao preview. SVG se renderuje u browseru pa dekodira. Za PDF se provjerava potpis `%PDF-` i veličina.
4. Transparentna pozadina se prije dekodiranja spljošti na bijelo, a oko slike se doda bijela margina (quiet zone).

## Selektori

Provjereni na živom sajtu 28.09.2026: početna, `/generator`, `/generator/url`, `/generator/qr?id=`, sign-up zid
na downloadu, `/login`, `/sign-up`, `/prices`.
**Neprovjereni** (iza logina): `src/pages/AccountPages.ts` – izbor formata za download, dashboard, analitika.
Kad dobiješ nalog: `npx playwright codegen --load-storage=.auth/user.json https://myqrcode.com` i zamijeni ih.

Sajt nema `data-testid` (osim `dialog-close-button`); selektori se oslanjaju na `id`, ARIA uloge i `value` atribute.
Najkrhkiji je `DesignPage.qrPreview` (`svg[viewBox="0 0 320 320"]`) – dobar kandidat za `data-testid="qr-preview"`.

## Napomene

- Svaki test kreiranja pravi **draft** QR kod na produkciji (ime `qa-auto-…`). Drži regresiju na jednom pokretanju noću.
- Plaćanje se ne automatizuje na produkciji – samo prikaz cijena i uslova obnove. Checkout testirati samo u sandboxu.

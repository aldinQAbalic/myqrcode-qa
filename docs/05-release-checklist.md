# Release checklist – myqrcode.com

**Verzija:** ______ **Datum:** ______ **QA:** ______ **Odluka:** ☐ GO ☐ NO-GO

## Prije izdanja

**Priprema**

- [ ] Release notes / lista promjena pročitana, rizične oblasti označene
- [ ] Nove funkcije imaju test slučajeve (i `data-testid` gdje treba)
- [ ] Test nalozi aktivni: trial, godišnji plan, istekao

**Automatizacija**

- [ ] Smoke (PR) zelen na zadnjem commitu
- [ ] Noćna regresija zelena ili svaki pad analiziran (bug / flaky / promjena UI-ja)
- [ ] Unit testovi decode helpera zeleni
- [ ] Nema novih `test.skip` / `fixme` bez tiketa

**P0 ručno**

- [ ] P0-07 Registracija novim e-mailom
- [ ] P0-14 Trial kupovina u sandboxu – iznos = `/prices`
- [ ] P0-15 Otkazivanje sprječava obnovu
- [ ] P0-16 Fizičko skeniranje: iOS + Android × PNG / SVG / PDF, s logom i okvirom

**Kros-browser i uređaji**

- [ ] Chrome, Safari, Firefox (desktop)
- [ ] Safari iOS, Chrome Android
- [ ] Najmanje 2 jezika (EN + jedan drugi)

**Nefunkcionalno**

- [ ] Nema novih grešaka u konzoli na glavnim stranicama
- [ ] Vrijeme učitavanja generatora nije primjetno gore
- [ ] Osnovna pristupačnost: tab kroz formu, labele na poljima, kontrast

**Kvalitet**

- [ ] 0 otvorenih S1 / S2
- [ ] S3 / S4 poznati i prihvaćeni od vlasnika proizvoda

## Nakon izdanja (prvih 30–60 min)

- [ ] Smoke pokrenut na produkciji (`workflow_dispatch`)
- [ ] Postojeći (stari) kratki linkovi i dalje preusmjeravaju
- [ ] Novi QR: kreiranje → download → skeniranje telefonom
- [ ] Monitoring: stopa grešaka, broj uplata, broj registracija u normalnom rasponu
- [ ] Rollback plan poznat i osoba za rollback dostupna

## Bilješke

| Nalaz | Ozbiljnost | Tiket | Odluka |
| ----- | ---------- | ----- | ------ |
|       |            |       |        |

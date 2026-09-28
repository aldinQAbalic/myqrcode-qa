# Šablon za prijavu buga

Kopiraj u GitHub Issue / Jira. Jedan bug = jedan problem.

```markdown
**Naslov:** [Oblast] Kratko šta ne radi – gdje
<!-- npr. [Download] PNG s logom se ne skenira na iOS kameri -->

**Ozbiljnost:** S1 / S2 / S3 / S4 **Prioritet:** P0 / P1 / P2
**Oblast:** Auth · Kreiranje · Dizajn · Download · Dinamički QR · Analitika · Plaćanje · Ostalo
**Okruženje:** https://myqrcode.com · Chrome 1xx / Safari iOS 1x · Windows / macOS / Android · desktop / mobilni
**Nalog:** anoniman / trial / godišnji plan / istekao (bez lozinki!)
**QR / draft ID:** <uuid iz URL-a ili kratki link>

### Koraci za reprodukciju

1.
2.
3.

### Očekivano

### Stvarno

### Učestalost

Uvijek / povremeno (x od y pokušaja) / jednom

### Dokazi

- Screenshot / video
- Playwright trace (`test-results/**/trace.zip`) ili link na CI run
- Preuzeti fajl (PNG/SVG/PDF), dekodirani sadržaj
- Console / network greške

### Dodatno

Zaobilazno rješenje, od kada se javlja (verzija/datum), povezani testovi (P0-xx)
```

## Vodič za ozbiljnost

|        | Značenje                                                                                              |
| ------ | ----------------------------------------------------------------------------------------------------- |
| **S1** | Osnovna vrijednost ne radi ili je novac/podaci u riziku: QR ne vodi na cilj, dupla naplata, login pao |
| **S2** | Važna funkcija ne radi, postoji zaobilazak: jedan format downloada, analitika ne broji                |
| **S3** | Funkcija radi s greškom: dizajn se ne sačuva, loša validacija                                         |
| **S4** | Kozmetika: tekst, prevod, poravnanje                                                                  |

## Dobra praksa

- Naslov mora biti razumljiv bez otvaranja: _šta, gdje, pod kojim uslovom_.
- Nikad ne stavljaj lozinke, tokene ni podatke kartice u bug.
- Ako je iz automatizacije: navedi ime testa, priloži trace i provjeri da nije flaky (ponovi 3×).

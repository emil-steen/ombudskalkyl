# Ombudsfördelningskalkylator: MUF, MSU & MST

En snabb, elegant och portabel macOS-optimerad applikation för att beräkna och visualisera mandatfördelningen för:
- **Moderata Ungdomsförbundet (MUF)** – Förbundsstämman (101 ombud, minst 2 grundmandat per distrikt)
- **Moderat Skolungdom (MSU)** – Nationella stämman (51 ombud, minst 1 grundmandat per distrikt)
- **Moderata Studenter (MST)** – Studentstämman (51 ombud, 0 grundmandat, tröskel $M \ge 14$)
- **Anpassad stämma** – Flexibelt läge för valfritt målantal och grundmandatsnivå

---

## 🚀 Så startar du appen på macOS

Appen är 100% självständig, byggd i **Apple Liquid Glass**-stil, fungerar helt **offline**, och kräver inga externa installationer:

### Alternativ 1: Direkt i webbläsaren (Snabbast)
1. Öppna mappen `ombudskalkyl` i Finder.
2. Dubbelklicka på **`index.html`** eller **`Ombudskalkylator.html`**.
3. Appen öppnas direkt i Safari eller Chrome.

### Alternativ 2: Startskriptet för macOS
1. Dubbelklicka på filen **`Starta Ombudskalkylator.command`** i Finder.
2. Skriptet startar en lokal webbserver och öppnar kalkylatorn automatiskt i din standardwebbläsare.

### Alternativ 3: Lägg till som Mac-app i Dockan (Safari)
1. Öppna `index.html` i **Safari**.
2. Klicka på **Arkiv** i macOS menyrad $\rightarrow$ **Lägg till i Dock...** (*Add to Dock*).
3. Du får nu en separat app-ikon med blått M i din macOS Dock och Launchpad som startar som ett eget fönster utan webbläsargränssnitt!

---

## 📐 Matematisk modell

Appen implementerar **Websters metod / Sainte-Laguës heltalsavrundning** kombinerat med **grundmandat**:

$$O_i = \max\left(\text{min\_grundmandat}, \left\lfloor \frac{M_i}{D} + 0.5 \right\rfloor\right)$$

där:
- $M_i$ är antalet betalande medlemmar per den 31 december.
- $D$ är den sökta divisorn som fastställs automatiskt med binärsökning (bisection) så att $\sum O_i = T$.
- $\text{min\_grundmandat} \in \{2, 1, 0\}$ beroende på organisation.

### Marginal- & Känslighetsanalys
För varje distrikt/förening beräknas:
- **Till nästa (+1):** Hur många ytterligare medlemmar som krävs för att erhålla ytterligare ett mandat:
  $$\Delta M_{next} = \lceil (O_i + 0.5) \cdot D \rceil - M_i$$
- **Marginal (-1):** Hur många medlemmar distriktet kan tappa innan ett mandat förloras (skyddas av grundmandat om $O_i = \text{min\_grundmandat}$).

---

## ✨ Huvudfunktioner

1. **Apple Liquid Glass Design:**
   - Genomskinliga frostade glasytor (`backdrop-filter: blur(24px)`), spegelreflektioner, moderna pill-kontroller och avskalad typografi.
   - Stöd för både ljust och mörkt läge (Dark Mode / Light Mode).
2. **Förifyllda officiella 2025-data:**
   - Direkt tillgång till 2025 års officiella siffror för MUF:s 25 distrikt, MSU:s 25 distrikt och MST:s 26 föreningar.
3. **Realtidsredigering & Excel-import:**
   - Ändra medlemsantal direkt i tabellcellerna – alla kvoter, divisorer och marginaler räknas om direkt.
   - Klistra in rader direkt från Excel/Google Sheets via knappen *Klistra in*.
4. **Plenisal / Hemicyle:**
   - Interaktiv stämmosal med färgkodade stolar per distrikt och hover-verktygstips.
5. **Officiellt Stämmoprotokoll & Export:**
   - **Skriv ut / PDF:** Formaterat förbundsprotokoll med officiell rubrik, divisor-redovisning, tabell och signaturrader.
   - **Excel (.xls) & CSV:** Ladda ner kalkylark anpassade för svensk Excel.
   - **Urklipp (TSV/Markdown):** Kopiera tabellen direkt med ett klick.

# Ombudsfördelningskalkylator
> **Officiell röstlängds- och mandatkalkylator för Moderata Ungdomsförbundet (MUF), Moderat Skolungdom (MSU) och Moderata Studenter (MST).**

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-005EA8?style=flat-square&logo=github)](https://emil-steen.github.io/ombudskalkyl/)
[![Metod](https://img.shields.io/badge/Algoritm-Websters%20heltalsmetod-0EA5E9?style=flat-square)](https://sv.wikipedia.org/wiki/Sainte-Lagu%C3%ABs_metod)
[![Plattform](https://img.shields.io/badge/Plattform-Web%20%7C%20macOS%20%7C%20iOS%20%7C%20Offline-002E54?style=flat-square)](#-anv%C3%A4ndning--k%C3%B6rning)
[![Design](https://img.shields.io/badge/Design-Apple%20Liquid%20Glass-475569?style=flat-square)](#-design--anv%C3%A4ndarupplevelse)

---

## 🌐 Kör direkt i webbläsaren

Appen finns tillgänglig online på GitHub Pages och fungerar direkt på dator, surfplatta och mobil:

👉 **[https://emil-steen.github.io/ombudskalkyl/](https://emil-steen.github.io/ombudskalkyl/)**

---

## 📌 Översikt & Syfte

Denna applikation är framtagen för att automatisera och säkerställa en 100% stadgeenlig mandatfördelning inför förbundsstämmor och rikskonferenser. Kalkylatorn beräknar röstlängden utifrån fastställd medlemsstatistik per den **31 december** och fördelar ombuden proportionellt enligt **Websters metod (Sainte-Laguë)** kombinerat med fastställda **grundmandatsnivåer**.

### Förkonfigurerade organisationer

| Organisation | Målram ($T$) | Enheter | Grundmandat | Spärr / Regler |
| :--- | :---: | :---: | :---: | :--- |
| **MUF Förbundsstämman** | **101 ombud** | 25 distrikt | Minst **2 grundmandat** per distrikt | Ingen spärr |
| **MSU Nationella Stämman** | **51 ombud** | 25 distrikt | Minst **1 grundmandat** per distrikt | Ingen spärr |
| **MST Studentstämman** | **51 ombud** | 26 föreningar | **0 grundmandat** | Naturlig avrundningströskel ($M \ge 14$) |
| **Anpassad Stämma** | Flexibel | Flexibel | Flexibel | Fritt anpassningsbar för distriktsstämmor |

---

## 📐 Matematisk modell & Algoritm

Mandatfördelningen bygger på **Websters metod med heltalsavrundning** i kombination med **garanterade grundmandat**:

$$O_i = \max\left(\text{min\_grundmandat}, \left\lfloor \frac{M_i}{D} + 0.5 \right\rfloor\right)$$

där:
- $M_i$ är antalet betalande medlemmar i enhet $i$ per skärningsdatumet (31 december).
- $D$ är den fastställda divisorn, vilken bestäms iterativt via en högprecisions **binärsökning (bisection search, 100 iterationer)** tills summan av alla mandat uppfyller målramen exakt:

$$\sum_{i=1}^{N} O_i = T$$

### Marginal- och känslighetsanalys

För varje distrikt/förening genomförs en realtidsanalys som visar hur nära enheten befinner sig att vinna respektive förlora ett mandat:

1. **Till nästa mandat ($+1$):**  
   Antalet medlemmar som saknades vid skärningsdatumet för att erhålla ytterligare ett ombud:
   $$\Delta M_{next} = \lceil (O_i + 0.5) \cdot D \rceil - M_i$$

2. **Marginal före mandatförlust ($-1$):**  
   Hur många medlemmar distriktet kunde ha tappat innan ett mandat gick förlorat:
   $$\Delta M_{drop} = M_i - \lfloor (O_i - 0.5) \cdot D \rfloor$$
   *(Distrikt på grundmandat skyddas automatiskt från mandatförlust).*

---

## ✨ Huvudfunktioner

- 💎 **Apple Liquid Glass Design:** Skapat i linje med `muf.se`:s grafiska profil med frostade glasytor (`backdrop-filter: blur(24px)`), subtila reflektioner och stöd för **Ljust och Mörkt läge (Dark Mode)**.
- 📱 **Full Mobilresponsivitet:** Optimerat gränssnitt för iPhone, iPad och bärbara datorer med flytande layout, horisontell touch-scroll och anpassade tryckytor.
- 📋 **Realtidsredigering & Excel-import:**
  - Redigera medlemsantal direkt i tabellcellerna – divisorer, kvoter och marginaler räknas om direkt i realtid.
  - Klistra in medlemslistor direkt från Excel eller Google Sheets via importdialogen.
- 🏛️ **Interaktiv Stämmosal (Plenum visualisering):**
  - Grafisk halvcirkel (*Hemicyle*) med färgkodade mandat och hover-detaljer per distrikt.
- 🖨️ **Officiellt Stämmoprotokoll & Export:**
  - **Utskrift & PDF:** Färdigt stämmoprotokoll med fastställd divisor, medlemsredovisning och signaturfält.
  - **Excel (.xls) & CSV:** Semicolonavgränsade filer anpassade för svensk Excel (UTF-8 BOM).
  - **Urklipp (TSV/Markdown):** Kopiera hela röstlängden med ett klick för smidig klistring i protokoll.

---

## 💻 Lokal användning & Portabilitet

Projektet är 100% självständigt, saknar externa beroenden och fungerar helt **offline**:

### Alternativ 1: Kör lokalt med dubbelklick
Öppna filen `index.html` eller `Ombudskalkylator.html` direkt i Safari, Chrome eller Firefox.

### Alternativ 2: Installera som macOS-app (Safari)
1. Öppna kalkylatorn i **Safari**.
2. Välj **Arkiv** i macOS menyrad $\rightarrow$ **Lägg till i Dock...** (*Add to Dock*).
3. Appen startar nu som ett fristående Mac-fönster direkt från Dockan med egen ikon!

---

## 📁 Projektstruktur

```
ombudskalkyl/
├── index.html                    # Huvudapplikation (fullständig & portabel)
├── Ombudskalkylator.html         # Fristående singelfils-kopia för enkel delning
├── styles.css                    # Liquid Glass designsystem & muf.se-styling
├── bundle.js                     # Konsoliderad beräknings- och UI-motor
├── calculator.js                 # Matematisk algoritm (Webster & marginalanalys)
├── data.js                       # Officiella referensdata för MUF, MSU & MST
├── export.js                     # Exportmotor (Excel, CSV, TSV, PDF-utskrift)
├── manifest.json                 # Web App Manifest för PWA & macOS Dock
├── sw.js                         # Service Worker för offline-stöd
└── Starta Ombudskalkylator.command # Startskript för macOS Terminal
```

---

## ⚖️ Licens & Rättigheter

Utvecklad för **Moderata Ungdomsförbundet**. Fri att använda och anpassa för interna stämmor och sammankomster.

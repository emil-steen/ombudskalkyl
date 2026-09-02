/**
 * MUF Ombudsfördelningskalkylator - Universal Bundle
 * Apple Liquid Glass Design System (riksdag26-tema)
 */

(function () {
  'use strict';

  // 1. DATA DEFINITIONS
  const ORG_CONFIGS = {
    muf: {
      key: 'muf',
      name: 'Moderata Ungdomsförbundet (MUF)',
      shortName: 'MUF',
      assemblyName: 'Förbundsstämman',
      unitTypeLabel: 'Distrikt',
      targetSeats: 101,
      minSeats: 2,
      description: '25 distrikt med minst 2 grundmandat per distrikt.',
      defaultData: [
        { id: 'muf-sthlm', name: 'MUF Stockholm', members: 4193 },
        { id: 'muf-skane', name: 'MUF Skåne', members: 3348 },
        { id: 'muf-ostergotland', name: 'MUF Östergötland', members: 1631 },
        { id: 'muf-jonkoping', name: 'MUF Jönköping', members: 1301 },
        { id: 'muf-goteborg', name: 'MUF Göteborg', members: 1230 },
        { id: 'muf-uppsala', name: 'MUF Uppsala', members: 913 },
        { id: 'muf-halland', name: 'MUF Halland', members: 748 },
        { id: 'muf-sodermanland', name: 'MUF Södermanland', members: 649 },
        { id: 'muf-vgv', name: 'MUF Västra Götaland Västra', members: 545 },
        { id: 'muf-orebro', name: 'MUF Örebro', members: 477 },
        { id: 'muf-salvsborg', name: 'MUF Södra Älvsborg', members: 464 },
        { id: 'muf-skaraborg', name: 'MUF Skaraborg', members: 463 },
        { id: 'muf-vasternorrland', name: 'MUF Västernorrland', members: 438 },
        { id: 'muf-kronoberg', name: 'MUF Kronoberg', members: 421 },
        { id: 'muf-varmland', name: 'MUF Värmland', members: 372 },
        { id: 'muf-vasterbotten', name: 'MUF Västerbotten', members: 325 },
        { id: 'muf-vastmanland', name: 'MUF Västmanland', members: 270 },
        { id: 'muf-fyrbodal', name: 'MUF Fyrbodal', members: 267 },
        { id: 'muf-norrbotten', name: 'MUF Norrbotten', members: 255 },
        { id: 'muf-kalmar', name: 'MUF Kalmar', members: 251 },
        { id: 'muf-gavleborg', name: 'MUF Gävleborg', members: 238 },
        { id: 'muf-jamtland', name: 'MUF Jämtland', members: 221 },
        { id: 'muf-dalarna', name: 'MUF Dalarna', members: 214 },
        { id: 'muf-blekinge', name: 'MUF Blekinge', members: 102 },
        { id: 'muf-gotland', name: 'MUF Gotland', members: 87 }
      ]
    },
    msu: {
      key: 'msu',
      name: 'Moderat Skolungdom (MSU)',
      shortName: 'MSU',
      assemblyName: 'Nationella Stämman',
      unitTypeLabel: 'Distrikt',
      targetSeats: 51,
      minSeats: 1,
      description: '25 distrikt med minst 1 grundmandat per distrikt.',
      defaultData: [
        { id: 'msu-sthlm', name: 'MUF Stockholm', members: 3636 },
        { id: 'msu-skane', name: 'MUF Skåne', members: 3014 },
        { id: 'msu-ostergotland', name: 'MUF Östergötland', members: 1322 },
        { id: 'msu-goteborg', name: 'MUF Göteborg', members: 1039 },
        { id: 'msu-jonkoping', name: 'MUF Jönköping', members: 995 },
        { id: 'msu-uppsala', name: 'MUF Uppsala', members: 812 },
        { id: 'msu-halland', name: 'MUF Halland', members: 647 },
        { id: 'msu-sodermanland', name: 'MUF Södermanland', members: 561 },
        { id: 'msu-vgv', name: 'MUF Västra Götaland Västra', members: 491 },
        { id: 'msu-salvsborg', name: 'MUF Södra Älvsborg', members: 415 },
        { id: 'msu-vasternorrland', name: 'MUF Västernorrland', members: 400 },
        { id: 'msu-orebro', name: 'MUF Örebro', members: 387 },
        { id: 'msu-skaraborg', name: 'MUF Skaraborg', members: 381 },
        { id: 'msu-kronoberg', name: 'MUF Kronoberg', members: 359 },
        { id: 'msu-varmland', name: 'MUF Värmland', members: 298 },
        { id: 'msu-vasterbotten', name: 'MUF Västerbotten', members: 254 },
        { id: 'msu-fyrbodal', name: 'MUF Fyrbodal', members: 241 },
        { id: 'msu-vastmanland', name: 'MUF Västmanland', members: 233 },
        { id: 'msu-kalmar', name: 'MUF Kalmar', members: 214 },
        { id: 'msu-gavleborg', name: 'MUF Gävleborg', members: 200 },
        { id: 'msu-norrbotten', name: 'MUF Norrbotten', members: 197 },
        { id: 'msu-jamtland', name: 'MUF Jämtland', members: 193 },
        { id: 'msu-dalarna', name: 'MUF Dalarna', members: 188 },
        { id: 'msu-blekinge', name: 'MUF Blekinge', members: 82 },
        { id: 'msu-gotland', name: 'MUF Gotland', members: 77 }
      ]
    },
    mst: {
      key: 'mst',
      name: 'Moderata Studenter (MST)',
      shortName: 'MST',
      assemblyName: 'Studentstämman',
      unitTypeLabel: 'Förening / Lärosäte',
      targetSeats: 51,
      minSeats: 0,
      description: '26 studentföreningar/lärosäten utan grundmandat (effektiv spärr vid M >= 14).',
      defaultData: [
        { id: 'mst-jonkoping', name: 'MST Jönköping', members: 362 },
        { id: 'mst-goteborg', name: 'MST Göteborg', members: 251 },
        { id: 'mst-linkoping', name: 'MST Linköping', members: 207 },
        { id: 'mst-sthlm', name: 'MST Stockholms län', members: 104 },
        { id: 'mst-skovde', name: 'MST Skövde', members: 83 },
        { id: 'mst-umea', name: 'MST Umeå', members: 65 },
        { id: 'mst-uppsala', name: 'MST Uppsala', members: 52 },
        { id: 'mst-lund', name: 'MST Lunds universitet', members: 43 },
        { id: 'mst-orebro', name: 'MST Örebro', members: 39 },
        { id: 'mst-karlstad', name: 'MST Karlstad', members: 31 },
        { id: 'mst-vaxjo', name: 'MST Linné Växjö', members: 28 },
        { id: 'mst-boras', name: 'MST Borås', members: 24 },
        { id: 'mst-halmstad', name: 'MST Halmstad', members: 22 },
        { id: 'mst-malmo', name: 'MST Malmö', members: 19 },
        { id: 'mst-vasteras', name: 'MST Mälardalen Västerås', members: 18 },
        { id: 'mst-sodertorn', name: 'MST Södertörn', members: 17 },
        { id: 'mst-kalmar', name: 'MST Linné Kalmar', members: 16 },
        { id: 'mst-sundsvall', name: 'MST Mittuniversitetet Sundsvall', members: 15 },
        { id: 'mst-lulea', name: 'MST Luleå', members: 14 },
        { id: 'mst-gavle', name: 'MST Gävle', members: 11 },
        { id: 'mst-kristianstad', name: 'MST Kristianstad', members: 9 },
        { id: 'mst-trollhattan', name: 'MST Väst Trollhättan', members: 8 },
        { id: 'mst-ostersund', name: 'MST Mittuniversitetet Östersund', members: 6 },
        { id: 'mst-eskilstuna', name: 'MST Mälardalen Eskilstuna', members: 5 },
        { id: 'mst-visby', name: 'MST Uppsala Campus Gotland', members: 4 },
        { id: 'mst-blekinge', name: 'MST Blekinge', members: 3 }
      ]
    },
    custom: {
      key: 'custom',
      name: 'Anpassad Stämma / Konferens',
      shortName: 'Anpassad',
      assemblyName: 'Årsstämman',
      unitTypeLabel: 'Enhet',
      targetSeats: 100,
      minSeats: 1,
      description: 'Flexibel röstlängdskalkylator för distrikts- och kretsstämmor.',
      defaultData: [
        { id: 'c-1', name: 'Krets 1', members: 1200 },
        { id: 'c-2', name: 'Krets 2', members: 950 },
        { id: 'c-3', name: 'Krets 3', members: 780 },
        { id: 'c-4', name: 'Krets 4', members: 540 },
        { id: 'c-5', name: 'Krets 5', members: 320 },
        { id: 'c-6', name: 'Krets 6', members: 190 },
        { id: 'c-7', name: 'Krets 7', members: 110 }
      ]
    }
  };

  // 2. MATHEMATICAL CALCULATION ENGINE (Webster / Sainte-Laguë with base mandates)
  function calculateOmbud(units, config) {
    const targetSeats = config.targetSeats || 101;
    const minSeats = config.minSeats !== undefined ? config.minSeats : 0;
    const validUnits = units.filter(u => u.members >= 0);
    const totalMembers = validUnits.reduce((acc, u) => acc + u.members, 0);

    if (validUnits.length === 0 || totalMembers === 0) {
      return {
        divisor: 1,
        divisorMin: 1,
        divisorMax: 1,
        totalMembers: 0,
        totalOmbud: 0,
        targetSeats,
        minSeats,
        isExactMatch: false,
        baseMandateUnitsCount: 0,
        results: []
      };
    }

    function evaluateDivisor(d) {
      let allocated = 0;
      for (const u of validUnits) {
        const quota = u.members / d;
        const seats = Math.max(minSeats, Math.round(quota));
        allocated += seats;
      }
      return allocated;
    }

    let lowD = 0.0001;
    let highD = Math.max(1, totalMembers * 2);

    while (evaluateDivisor(highD) >= targetSeats) {
      highD *= 2;
    }
    while (evaluateDivisor(lowD) < targetSeats) {
      lowD /= 2;
      if (lowD < 1e-7) break;
    }

    let bestD = (lowD + highD) / 2;
    for (let i = 0; i < 100; i++) {
      const mid = (lowD + highD) / 2;
      const seats = evaluateDivisor(mid);
      if (seats >= targetSeats) {
        lowD = mid;
      } else {
        highD = mid;
      }
    }
    bestD = (lowD + highD) / 2;

    let dMin = bestD;
    let dMax = bestD;
    let step = bestD * 0.01;
    while (step > 0.0001) {
      if (evaluateDivisor(dMin - step) === targetSeats) {
        dMin -= step;
      } else {
        step /= 2;
      }
    }
    step = bestD * 0.01;
    while (step > 0.0001) {
      if (evaluateDivisor(dMax + step) === targetSeats) {
        dMax += step;
      } else {
        step /= 2;
      }
    }

    let allocatedTotal = 0;
    let baseMandateCount = 0;
    const unitResults = validUnits.map(u => {
      const rawQuota = u.members / bestD;
      const naturalSeats = Math.round(rawQuota);
      const ombud = Math.max(minSeats, naturalSeats);
      const isBaseMandate = (naturalSeats < minSeats);

      if (isBaseMandate) baseMandateCount++;
      allocatedTotal += ombud;

      const nextThresholdQuota = ombud + 0.5;
      const neededMembersForNext = Math.ceil(nextThresholdQuota * bestD) - u.members;
      const neededForNext = Math.max(1, neededMembersForNext);

      let dropMargin = null;
      if (!isBaseMandate && ombud > minSeats) {
        const dropThresholdQuota = ombud - 0.5;
        const floorMembers = Math.floor(dropThresholdQuota * bestD);
        dropMargin = Math.max(0, u.members - floorMembers);
      }

      return {
        id: u.id,
        name: u.name,
        members: u.members,
        shareMembers: totalMembers > 0 ? (u.members / totalMembers) * 100 : 0,
        rawQuota,
        ombud,
        isBaseMandate,
        neededForNext,
        dropMargin
      };
    });

    return {
      divisor: bestD,
      divisorMin: dMin,
      divisorMax: dMax,
      totalMembers,
      totalOmbud: allocatedTotal,
      targetSeats,
      minSeats,
      isExactMatch: allocatedTotal === targetSeats,
      baseMandateUnitsCount: baseMandateCount,
      results: unitResults
    };
  }

  // 3. EXPORT HELPERS
  function exportToCSV(summary, orgName) {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `ombudsfordelning_${orgName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${dateStr}.csv`;

    const headers = [
      'Nr',
      'Distrikt/Enhet',
      'Medlemmar',
      'Andel (%)',
      'Kvot (M/D)',
      'Tilldelade Ombud',
      'Status',
      'Till nästa (+1)',
      'Marginal (-1)'
    ];

    const rows = [
      [`Officiellt Ombudsfördelningsprotokoll - ${orgName}`],
      [`Skärningsdatum: 31 december | Fastställd Divisor (D): ${summary.divisor.toFixed(2)}`],
      [`Målram: ${summary.targetSeats} ombud | Fördelade ombud: ${summary.totalOmbud}`],
      []
    ];

    rows.push(headers);
    summary.results.forEach((r, idx) => {
      rows.push([
        idx + 1,
        `"${r.name.replace(/"/g, '""')}"`,
        r.members,
        r.shareMembers.toFixed(2).replace('.', ','),
        r.rawQuota.toFixed(2).replace('.', ','),
        r.ombud,
        r.isBaseMandate ? 'Grundmandat' : 'Kvotmandat',
        r.neededForNext,
        r.dropMargin !== null ? r.dropMargin : 'Skyddad'
      ]);
    });

    rows.push([]);
    rows.push([
      'TOTALT',
      '',
      summary.totalMembers,
      '100,00',
      '',
      summary.totalOmbud,
      summary.baseMandateUnitsCount > 0 ? `${summary.baseMandateUnitsCount} på grundmandat` : 'Samtliga kvot',
      '',
      ''
    ]);

    const csvContent = '\uFEFF' + rows.map(e => e.join(';')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
  }

  function exportToExcel(summary, orgName) {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `ombudsfordelning_${orgName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${dateStr}.xls`;

    let tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Ombudsfördelning</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; }
        th { background-color: #005ea8; color: #ffffff; font-weight: bold; border: 1px solid #003f7a; padding: 7px 10px; }
        td { border: 1px solid #e2e8f0; padding: 6px 10px; }
        .num { text-align: right; }
        .total-row { font-weight: bold; background-color: #f1f5f9; }
        .grundmandat { color: #b45309; font-weight: 600; }
      </style>
    </head>
    <body>
      <table>
        <tr><td colspan="9" style="font-size:16pt; font-weight:bold; color:#003f7a;">Officiell Ombudsfördelning – ${escapeHtml(orgName)}</td></tr>
        <tr><td colspan="9" style="color:#64748b;">Fastställd Divisor (D): ${summary.divisor.toFixed(2)} | Skärningsdatum: 31 december</td></tr>
        <tr><td colspan="9"></td></tr>
        <thead>
          <tr>
            <th>Nr</th><th>Distrikt / Enhet</th><th>Medlemmar</th><th>Andel</th><th>Kvot (M/D)</th><th>Tilldelade Ombud</th><th>Status</th><th>Till nästa (+1)</th><th>Marginal (-1)</th>
          </tr>
        </thead>
        <tbody>
    `;

    summary.results.forEach((r, idx) => {
      tableHtml += `
        <tr>
          <td class="num">${idx + 1}</td>
          <td>${escapeHtml(r.name)}</td>
          <td class="num">${r.members.toLocaleString('sv-SE')}</td>
          <td class="num">${r.shareMembers.toFixed(2)}%</td>
          <td class="num">${r.rawQuota.toFixed(2)}</td>
          <td class="num" style="font-weight:bold;">${r.ombud}</td>
          <td class="${r.isBaseMandate ? 'grundmandat' : ''}">${r.isBaseMandate ? 'Grundmandat' : 'Kvotmandat'}</td>
          <td class="num">+${r.neededForNext}</td>
          <td class="num">${r.dropMargin !== null ? r.dropMargin : 'Skyddad'}</td>
        </tr>
      `;
    });

    tableHtml += `
        <tr class="total-row">
          <td colspan="2">TOTALT</td>
          <td class="num">${summary.totalMembers.toLocaleString('sv-SE')}</td>
          <td class="num">100.00%</td>
          <td></td>
          <td class="num">${summary.totalOmbud}</td>
          <td>${summary.baseMandateUnitsCount > 0 ? summary.baseMandateUnitsCount + ' på grundmandat' : 'Samtliga kvot'}</td>
          <td></td><td></td>
        </tr>
        </tbody>
      </table>
    </body>
    </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    downloadBlob(blob, filename);
  }

  async function copyToClipboardTSV(summary) {
    const header = ['Nr', 'Enhet', 'Medlemmar', 'Andel Medlemmar', 'Kvot (M/D)', 'Tilldelade Ombud', 'Status', 'Till nästa (+1)', 'Marginal (-1)'].join('\t');
    const rows = summary.results.map((r, idx) => [
      idx + 1,
      r.name,
      r.members,
      `${r.shareMembers.toFixed(2)}%`,
      r.rawQuota.toFixed(2),
      r.ombud,
      r.isBaseMandate ? 'Grundmandat' : 'Kvotmandat',
      `+${r.neededForNext}`,
      r.dropMargin !== null ? `${r.dropMargin}` : 'Skyddad'
    ].join('\t'));

    const totalRow = ['TOTALT', '', summary.totalMembers, '100.00%', '', summary.totalOmbud, `${summary.baseMandateUnitsCount} på grundmandat`, '', ''].join('\t');
    const fullTSV = [header, ...rows, totalRow].join('\n');

    try {
      await navigator.clipboard.writeText(fullTSV);
      return true;
    } catch (err) {
      console.error('Kunde inte kopiera TSV:', err);
      return false;
    }
  }

  async function copyToClipboardMarkdown(summary, orgName) {
    let md = `### Officiell Ombudsfördelning – ${orgName}\n`;
    md += `*Fastställd Divisor (D): ${summary.divisor.toFixed(2)} | Skärningsdatum: 31 december*\n\n`;
    md += `| Nr | Distrikt / Enhet | Medlemmar | Andel | Kvot (M/D) | Ombud | Status | Till nästa (+1) | Marginal (-1) |\n`;
    md += `| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :---: | :---: |\n`;

    summary.results.forEach((r, idx) => {
      md += `| ${idx + 1} | ${r.name} | ${r.members.toLocaleString('sv-SE')} | ${r.shareMembers.toFixed(2)}% | ${r.rawQuota.toFixed(2)} | **${r.ombud}** | ${r.isBaseMandate ? 'Grundmandat' : 'Kvot'} | +${r.neededForNext} | ${r.dropMargin !== null ? r.dropMargin : 'Skyddad'} |\n`;
    });

    md += `| **TOTALT** | | **${summary.totalMembers.toLocaleString('sv-SE')}** | **100.00%** | | **${summary.totalOmbud}** | ${summary.baseMandateUnitsCount > 0 ? summary.baseMandateUnitsCount + ' grundmandat' : 'Samtliga kvot'} | | |\n`;

    try {
      await navigator.clipboard.writeText(md);
      return true;
    } catch (err) {
      console.error('Kunde inte kopiera Markdown:', err);
      return false;
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  // 4. MAIN APP CONTROLLER
  const DISTRICT_COLORS = [
    '#005ea8', '#0077d4', '#0284c7', '#0369a1', '#024978',
    '#2563eb', '#3b82f6', '#60a5fa', '#1d4ed8', '#1e40af',
    '#0d9488', '#059669', '#10b981', '#34d399', '#f59e0b',
    '#d97706', '#b45309', '#e11d48', '#f43f5e', '#8b5cf6',
    '#7c3aed', '#6366f1', '#4f46e5', '#64748b', '#475569', '#334155'
  ];

  class OmbudsApp {
    constructor() {
      this.currentOrgKey = 'muf';
      this.searchQuery = '';
      this.sortColumn = 'members';
      this.sortDirection = 'desc';

      this.orgData = this.loadInitialData();
      this.customConfigs = {
        muf: { targetSeats: 101, minSeats: 2 },
        msu: { targetSeats: 51, minSeats: 1 },
        mst: { targetSeats: 51, minSeats: 0 },
        custom: { targetSeats: 100, minSeats: 1 }
      };

      this.factions = this.loadFactions();
      this.districtFactions = this.loadDistrictFactions();

      this.initElements();
      this.initEventListeners();
      try {
        localStorage.removeItem('muf_theme');
        document.documentElement.removeAttribute('data-theme');
      } catch (e) {}
      this.render();
    }

    loadFactions() {
      try {
        const saved = localStorage.getItem('muf_factions_v3');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return [
        { id: 'f1', name: 'Falang Blå', shortName: 'Blå', color: '#005ea8' },
        { id: 'f2', name: 'Falang Gul', shortName: 'Gul', color: '#d97706' }
      ];
    }

    saveFactions() {
      try {
        localStorage.setItem('muf_factions_v3', JSON.stringify(this.factions));
      } catch (e) {}
    }

    loadDistrictFactions() {
      try {
        const saved = localStorage.getItem('muf_district_factions_v3');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return { muf: {}, msu: {}, mst: {}, custom: {} };
    }

    saveDistrictFactions() {
      try {
        localStorage.setItem('muf_district_factions_v3', JSON.stringify(this.districtFactions));
      } catch (e) {}
    }

    addFaction() {
      const PALETTE = ['#005ea8', '#d97706', '#059669', '#7c3aed', '#dc2626', '#0284c7'];
      if (this.factions.length >= 5) {
        this.showToast('Max 5 falanger kan skapas.');
        return;
      }
      const num = this.factions.length + 1;
      const color = PALETTE[(num - 1) % PALETTE.length];
      this.factions.push({
        id: 'f_' + Date.now(),
        name: `Falang ${num}`,
        shortName: `F${num}`,
        color: color
      });
      this.saveFactions();
      this.render();
      this.showToast(`Falang ${num} tillagd.`);
    }

    removeFaction(factionId) {
      if (this.factions.length <= 1) {
        this.showToast('Minst en falang måste finnas kvar.');
        return;
      }
      this.factions = this.factions.filter(f => f.id !== factionId);
      for (const orgKey in this.districtFactions) {
        for (const uId in this.districtFactions[orgKey]) {
          if (this.districtFactions[orgKey][uId] === factionId) {
            delete this.districtFactions[orgKey][uId];
          }
        }
      }
      this.saveFactions();
      this.saveDistrictFactions();
      this.render();
      this.showToast('Falang borttagen.');
    }

    resetFactions() {
      this.districtFactions[this.currentOrgKey] = {};
      this.saveDistrictFactions();
      this.render();
      this.showToast('Alla distriktstilldelningar nollställda.');
    }

    setDistrictFaction(unitId, factionId) {
      if (!this.districtFactions[this.currentOrgKey]) {
        this.districtFactions[this.currentOrgKey] = {};
      }
      if (!factionId || this.districtFactions[this.currentOrgKey][unitId] === factionId) {
        delete this.districtFactions[this.currentOrgKey][unitId];
      } else {
        this.districtFactions[this.currentOrgKey][unitId] = factionId;
      }
      this.saveDistrictFactions();
      this.render();
    }

    loadInitialData() {
      try {
        const saved = localStorage.getItem('muf_ombud_data_v2');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Läsfel localStorage:', e);
      }

      return {
        muf: JSON.parse(JSON.stringify(ORG_CONFIGS.muf.defaultData)),
        msu: JSON.parse(JSON.stringify(ORG_CONFIGS.msu.defaultData)),
        mst: JSON.parse(JSON.stringify(ORG_CONFIGS.mst.defaultData)),
        custom: JSON.parse(JSON.stringify(ORG_CONFIGS.custom.defaultData))
      };
    }

    saveData() {
      try {
        localStorage.setItem('muf_ombud_data_v2', JSON.stringify(this.orgData));
      } catch (e) {
        console.warn('Sparfel localStorage:', e);
      }
    }

    initElements() {
      this.orgTabs = document.querySelectorAll('.org-tab');
      this.totalMembersEl = document.getElementById('stat-total-members');
      this.totalOmbudEl = document.getElementById('stat-total-ombud');
      this.targetSeatsBadgeEl = document.getElementById('stat-target-badge');
      this.divisorEl = document.getElementById('stat-divisor');
      this.divisorIntervalEl = document.getElementById('stat-divisor-interval');
      this.baseMandateCountEl = document.getElementById('stat-base-mandate-count');
      this.baseMandateMetaEl = document.getElementById('stat-base-mandate-meta');

      this.tableBody = document.getElementById('calc-table-body');
      this.tableFoot = document.getElementById('calc-table-foot');
      this.searchInput = document.getElementById('table-search-input');
      this.thElements = document.querySelectorAll('.calc-table th[data-sort]');

      this.inputTargetSeats = document.getElementById('param-target-seats');
      this.inputMinSeats = document.getElementById('param-min-seats');
      this.orgDescriptionEl = document.getElementById('org-description-text');
      this.marginalListEl = document.getElementById('marginal-ranking-list');

      this.duelLeftName = document.getElementById('duel-left-name');
      this.duelLeftMandates = document.getElementById('duel-left-mandates');
      this.duelLeftSub = document.getElementById('duel-left-sub');
      this.duelRightName = document.getElementById('duel-right-name');
      this.duelRightMandates = document.getElementById('duel-right-mandates');
      this.duelRightSub = document.getElementById('duel-right-sub');
      this.duelTargetText = document.getElementById('duel-target-text');
      this.duelUnassignedText = document.getElementById('duel-unassigned-text');
      this.duelBarLeft = document.getElementById('duel-bar-left');
      this.duelBarRight = document.getElementById('duel-bar-right');
      this.duelStatusBanner = document.getElementById('duel-status-banner');

      this.leftChipsContainer = document.getElementById('left-chips-container');
      this.rightChipsContainer = document.getElementById('right-chips-container');
      this.poolChipsContainer = document.getElementById('pool-chips-container');
      this.leftPillCount = document.getElementById('left-pill-count');
      this.rightPillCount = document.getElementById('right-pill-count');
      this.poolCountBadge = document.getElementById('pool-count-badge');
      this.leftEmptyHint = document.getElementById('left-empty-hint');
      this.rightEmptyHint = document.getElementById('right-empty-hint');

      this.dropZoneLeft = document.getElementById('drop-zone-left');
      this.dropZoneRight = document.getElementById('drop-zone-right');
      this.dropZonePool = document.getElementById('drop-zone-pool');
      this.btnResetFactions = document.getElementById('btn-reset-factions');

      this.printOrgTitle = document.getElementById('print-org-title');
      this.printDate = document.getElementById('print-date');
      this.printDivisor = document.getElementById('print-divisor');
      this.printBaseMandate = document.getElementById('print-base-mandate');
      this.printAssembly = document.getElementById('print-assembly');

      this.pasteModal = document.getElementById('paste-modal');
      this.pasteTextarea = document.getElementById('paste-textarea');
      this.toastContainer = document.getElementById('toast-container');
    }

    initEventListeners() {
      this.orgTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const orgKey = tab.dataset.org;
          if (orgKey && this.currentOrgKey !== orgKey) {
            this.currentOrgKey = orgKey;
            this.orgTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            this.searchQuery = '';
            if (this.searchInput) this.searchInput.value = '';
            this.render();
          }
        });
      });

      if (this.searchInput) {
        this.searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.renderTableOnly();
        });
      }

      this.thElements.forEach(th => {
        th.addEventListener('click', () => {
          const col = th.dataset.sort;
          if (this.sortColumn === col) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
            this.sortColumn = col;
            this.sortDirection = col === 'name' ? 'asc' : 'desc';
          }
          this.updateSortHeaders();
          this.renderTableOnly();
        });
      });

      if (this.inputTargetSeats) {
        this.inputTargetSeats.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val) && val > 0) {
            this.customConfigs[this.currentOrgKey].targetSeats = val;
            this.render();
          }
        });
      }

      const decTarget = document.getElementById('btn-target-dec');
      const incTarget = document.getElementById('btn-target-inc');
      if (decTarget && this.inputTargetSeats) {
        decTarget.addEventListener('click', () => {
          const cur = parseInt(this.inputTargetSeats.value, 10) || 101;
          if (cur > 1) {
            this.inputTargetSeats.value = cur - 1;
            this.inputTargetSeats.dispatchEvent(new Event('input'));
          }
        });
      }
      if (incTarget && this.inputTargetSeats) {
        incTarget.addEventListener('click', () => {
          const cur = parseInt(this.inputTargetSeats.value, 10) || 101;
          this.inputTargetSeats.value = cur + 1;
          this.inputTargetSeats.dispatchEvent(new Event('input'));
        });
      }

      if (this.inputMinSeats) {
        this.inputMinSeats.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val) && val >= 0) {
            this.customConfigs[this.currentOrgKey].minSeats = val;
            this.render();
          }
        });
      }

      const decMin = document.getElementById('btn-min-dec');
      const incMin = document.getElementById('btn-min-inc');
      if (decMin && this.inputMinSeats) {
        decMin.addEventListener('click', () => {
          const cur = parseInt(this.inputMinSeats.value, 10) || 0;
          if (cur > 0) {
            this.inputMinSeats.value = cur - 1;
            this.inputMinSeats.dispatchEvent(new Event('input'));
          }
        });
      }
      if (incMin && this.inputMinSeats) {
        incMin.addEventListener('click', () => {
          const cur = parseInt(this.inputMinSeats.value, 10) || 0;
          this.inputMinSeats.value = cur + 1;
          this.inputMinSeats.dispatchEvent(new Event('input'));
        });
      }

      const resetBtn = document.getElementById('btn-reset-data');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm(`Vill du återställa tabellen för ${ORG_CONFIGS[this.currentOrgKey].shortName} till officiella referenssiffror?`)) {
            this.orgData[this.currentOrgKey] = JSON.parse(JSON.stringify(ORG_CONFIGS[this.currentOrgKey].defaultData));
            this.customConfigs[this.currentOrgKey].targetSeats = ORG_CONFIGS[this.currentOrgKey].targetSeats;
            this.customConfigs[this.currentOrgKey].minSeats = ORG_CONFIGS[this.currentOrgKey].minSeats;
            this.saveData();
            this.render();
            this.showToast('Data har återställts till referenssiffror.');
          }
        });
      }

      const addRowBtn = document.getElementById('btn-add-row');
      if (addRowBtn) {
        addRowBtn.addEventListener('click', () => {
          const unitType = ORG_CONFIGS[this.currentOrgKey].unitTypeLabel;
          const newId = `custom-${Date.now()}`;
          this.orgData[this.currentOrgKey].push({
            id: newId,
            name: `Ny ${unitType}`,
            members: 100
          });
          this.saveData();
          this.render();
          this.showToast(`Ny rad lades till.`);
        });
      }

      const openPasteBtn = document.getElementById('btn-open-paste');
      if (openPasteBtn) {
        openPasteBtn.addEventListener('click', () => this.openPasteModal());
      }

      const closePasteBtn = document.getElementById('btn-close-paste');
      if (closePasteBtn) {
        closePasteBtn.addEventListener('click', () => this.closePasteModal());
      }

      const applyPasteBtn = document.getElementById('btn-apply-paste');
      if (applyPasteBtn) {
        applyPasteBtn.addEventListener('click', () => this.handleApplyPaste());
      }

      const exportCsvBtn = document.getElementById('btn-export-csv');
      if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
          const summary = this.getSummary();
          exportToCSV(summary, ORG_CONFIGS[this.currentOrgKey].name);
          this.showToast('CSV-fil genererad och laddas ner.');
        });
      }

      const exportXlsBtn = document.getElementById('btn-export-excel');
      if (exportXlsBtn) {
        exportXlsBtn.addEventListener('click', () => {
          const summary = this.getSummary();
          exportToExcel(summary, ORG_CONFIGS[this.currentOrgKey].name);
          this.showToast('Excel-fil genererad och laddas ner.');
        });
      }

      const copyTsvBtn = document.getElementById('btn-copy-tsv');
      if (copyTsvBtn) {
        copyTsvBtn.addEventListener('click', async () => {
          const summary = this.getSummary();
          const success = await copyToClipboardTSV(summary);
          if (success) this.showToast('Tabell kopierad till urklipp (Excel-format).');
        });
      }

      const printBtn = document.getElementById('btn-print-protocol');
      if (printBtn) {
        printBtn.addEventListener('click', () => {
          window.print();
        });
      }

      if (this.btnResetFactions) {
        this.btnResetFactions.addEventListener('click', () => this.resetFactions());
      }

      // Drag and Drop Zone listeners (SVT Regeringsbyggar-stil)
      const zones = [this.dropZoneLeft, this.dropZoneRight, this.dropZonePool];
      zones.forEach(zone => {
        if (!zone) return;
        zone.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          zone.classList.add(zone === this.dropZoneRight ? 'drag-over-amber' : 'drag-over');
        });

        zone.addEventListener('dragleave', () => {
          zone.classList.remove('drag-over', 'drag-over-amber');
        });

        zone.addEventListener('drop', (e) => {
          e.preventDefault();
          zone.classList.remove('drag-over', 'drag-over-amber');
          const unitId = e.dataTransfer.getData('text/plain');
          const targetFaction = zone.dataset.faction || null;
          if (unitId) {
            this.setDistrictFaction(unitId, targetFaction);
          }
        });
      });
    }

    getSummary() {
      const units = this.orgData[this.currentOrgKey] || [];
      const cfg = this.customConfigs[this.currentOrgKey];
      return calculateOmbud(units, cfg);
    }

    render() {
      const summary = this.getSummary();
      const orgMeta = ORG_CONFIGS[this.currentOrgKey];

      if (this.inputTargetSeats) this.inputTargetSeats.value = summary.targetSeats;
      if (this.inputMinSeats) this.inputMinSeats.value = summary.minSeats;
      if (this.orgDescriptionEl) this.orgDescriptionEl.textContent = orgMeta.description;

      this.renderKPIs(summary, orgMeta);
      this.renderTableOnly();
      this.renderMarginalList(summary);
      this.renderFactionAnalysis(summary);
      this.updatePrintHeaders(summary, orgMeta);

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    renderKPIs(summary, orgMeta) {
      if (this.totalMembersEl) this.totalMembersEl.textContent = summary.totalMembers.toLocaleString('sv-SE');
      if (this.totalOmbudEl) this.totalOmbudEl.textContent = summary.totalOmbud;

      if (this.targetSeatsBadgeEl) {
        if (summary.isExactMatch) {
          this.targetSeatsBadgeEl.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0 whitespace-nowrap inline-flex items-center gap-1';
          this.targetSeatsBadgeEl.innerHTML = `<i data-lucide="check" class="w-3 h-3"></i> Exakt ram (${summary.targetSeats} mål)`;
        } else {
          this.targetSeatsBadgeEl.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0 whitespace-nowrap inline-flex items-center gap-1';
          this.targetSeatsBadgeEl.innerHTML = `<i data-lucide="alert-triangle" class="w-3 h-3"></i> Diff (${summary.totalOmbud} / ${summary.targetSeats})`;
        }
      }

      if (this.divisorEl) {
        this.divisorEl.textContent = summary.divisor.toLocaleString('sv-SE', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2
        });
      }

      if (this.divisorIntervalEl) {
        this.divisorIntervalEl.textContent = `Intervall: ${summary.divisorMin.toFixed(2)} – ${summary.divisorMax.toFixed(2)}`;
      }

      if (this.baseMandateCountEl) this.baseMandateCountEl.textContent = summary.baseMandateUnitsCount;

      if (this.baseMandateMetaEl) {
        this.baseMandateMetaEl.textContent = summary.minSeats > 0
          ? `Minst ${summary.minSeats} grundmandat per enhet`
          : 'Inget krav på grundmandat';
      }
    }

    renderTableOnly() {
      const summary = this.getSummary();
      let rows = [...summary.results];

      if (this.searchQuery) {
        rows = rows.filter(r => r.name.toLowerCase().includes(this.searchQuery));
      }

      rows.sort((a, b) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];

        if (typeof valA === 'string') {
          return this.sortDirection === 'asc' ? valA.localeCompare(valB, 'sv') : valB.localeCompare(valA, 'sv');
        }

        if (valA === null || valA === undefined) valA = -999999;
        if (valB === null || valB === undefined) valB = -999999;

        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      });

      this.tableBody.innerHTML = '';
      rows.forEach((r, idx) => {
        const tr = document.createElement('tr');

        let statusBadge = '';
        if (r.isBaseMandate) {
          statusBadge = `<span class="status-badge grundmandat" title="Mottog mandat via grundmandatsnivån (${summary.minSeats} st)"><i data-lucide="shield" class="w-3 h-3"></i> Grundmandat</span>`;
        } else if (r.ombud > 0) {
          statusBadge = `<span class="status-badge kvot" title="Kvalificerade proportionellt via röstkvot"><i data-lucide="check" class="w-3 h-3"></i> Kvotmandat</span>`;
        } else {
          statusBadge = `<span class="status-badge sparr" title="Nådde ej upp till minsta tröskel"><i data-lucide="minus" class="w-3 h-3"></i> Under spärr</span>`;
        }

        const fId = this.districtFactions[this.currentOrgKey]?.[r.id];
        const fObj = fId ? this.factions.find(f => f.id === fId) : null;
        const factionTag = fObj
          ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs" style="background-color: ${fObj.color};">${escapeHtml(fObj.shortName || fObj.name)}</span>`
          : '';

        tr.innerHTML = `
          <td class="num"><span class="unit-rank">${idx + 1}</span></td>
          <td>
            <div class="flex items-center gap-1.5">
              <span class="unit-name-text" contenteditable="true" data-id="${r.id}" data-field="name">${escapeHtml(r.name)}</span>
            </div>
          </td>
          <td class="num">
            <input type="number" min="0" step="1" class="inline-input-members" data-id="${r.id}" value="${r.members}">
          </td>
          <td class="num font-mono text-slate-600 font-medium">${r.shareMembers.toFixed(2)}%</td>
          <td class="num font-mono text-slate-600 font-medium">${r.rawQuota.toFixed(2)}</td>
          <td class="num">
            <span class="ombud-badge">${r.ombud}</span>
          </td>
          <td><div class="flex items-center gap-1.5 flex-wrap">${statusBadge}${factionTag}</div></td>
          <td class="num font-mono">
            <span class="text-emerald-700 font-bold">+${r.neededForNext}</span>
          </td>
          <td class="num font-mono">
            <span class="text-slate-500">${r.dropMargin !== null ? r.dropMargin : 'Skyddad'}</span>
          </td>
          <td class="num" style="width: 44px;">
            <button class="apple-glass-pill w-7 h-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition active:scale-90 btn-delete-row" data-id="${r.id}" title="Ta bort rad">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        `;
        this.tableBody.appendChild(tr);
      });

      this.tableBody.querySelectorAll('.inline-input-members').forEach(input => {
        input.addEventListener('change', (e) => {
          const id = e.target.dataset.id;
          const newMembers = Math.max(0, parseInt(e.target.value, 10) || 0);
          const unit = this.orgData[this.currentOrgKey].find(u => u.id === id);
          if (unit) {
            unit.members = newMembers;
            this.saveData();
            this.render();
          }
        });
      });

      this.tableBody.querySelectorAll('.unit-name-text').forEach(nameEl => {
        nameEl.addEventListener('blur', (e) => {
          const id = e.target.dataset.id;
          const newName = e.target.textContent.trim();
          const unit = this.orgData[this.currentOrgKey].find(u => u.id === id);
          if (unit && newName) {
            unit.name = newName;
            this.saveData();
            this.updatePrintHeaders(this.getSummary(), ORG_CONFIGS[this.currentOrgKey]);
          }
        });
      });

      this.tableBody.querySelectorAll('.btn-delete-row').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          this.orgData[this.currentOrgKey] = this.orgData[this.currentOrgKey].filter(u => u.id !== id);
          this.saveData();
          this.render();
          this.showToast('Rad borttagen.');
        });
      });

      if (this.tableFoot) {
        this.tableFoot.innerHTML = `
          <tr>
            <td></td>
            <td><strong>TOTALT (${summary.results.length} enheter)</strong></td>
            <td class="num"><strong>${summary.totalMembers.toLocaleString('sv-SE')}</strong></td>
            <td class="num font-mono"><strong>100.00%</strong></td>
            <td class="num font-mono"><strong>–</strong></td>
            <td class="num"><strong><span class="ombud-badge">${summary.totalOmbud}</span></strong></td>
            <td><strong>${summary.baseMandateUnitsCount > 0 ? summary.baseMandateUnitsCount + ' på grundmandat' : 'Samtliga kvot'}</strong></td>
            <td colspan="3"></td>
          </tr>
        `;
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    updateSortHeaders() {
      this.thElements.forEach(th => {
        const col = th.dataset.sort;
        const originalText = th.dataset.label || th.textContent.replace(/[ ▲▼]/g, '').trim();
        th.dataset.label = originalText;

        if (col === this.sortColumn) {
          th.textContent = `${originalText} ${this.sortDirection === 'asc' ? '▲' : '▼'}`;
          th.classList.add('text-mblue-600');
        } else {
          th.textContent = originalText;
          th.classList.remove('text-mblue-600');
        }
      });
    }

    renderMarginalList(summary) {
      if (!this.marginalListEl) return;

      const sortedByNeeded = [...summary.results]
        .filter(r => r.members > 0)
        .sort((a, b) => a.neededForNext - b.neededForNext)
        .slice(0, 6);

      this.marginalListEl.innerHTML = '';
      sortedByNeeded.forEach((r, idx) => {
        const item = document.createElement('div');
        item.className = 'marginal-item apple-glass-inner p-3 flex items-center justify-between gap-3';
        item.innerHTML = `
          <div class="min-w-0">
            <div class="font-bold text-xs sm:text-sm text-slate-900 truncate">${idx + 1}. ${escapeHtml(r.name)}</div>
            <div class="text-[11px] text-slate-500 font-medium">${r.members.toLocaleString('sv-SE')} medl. (${r.ombud} ombud)</div>
          </div>
          <div class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full whitespace-nowrap shadow-xs">
            +${r.neededForNext} medl.
          </div>
        `;
        this.marginalListEl.appendChild(item);
      });
    }

    renderFactionAnalysis(summary) {
      if (!this.duelBarLeft || !this.leftChipsContainer || !this.rightChipsContainer || !this.poolChipsContainer) return;

      const totalSeats = summary.totalOmbud || summary.targetSeats;
      const majorityNeeded = Math.floor(summary.targetSeats / 2) + 1;

      if (this.duelTargetText) {
        this.duelTargetText.textContent = `${majorityNeeded} för majoritet`;
      }

      const f1 = this.factions[0] || { id: 'f1', name: 'Falang Blå', color: '#005ea8' };
      const f2 = this.factions[1] || { id: 'f2', name: 'Falang Gul', color: '#d97706' };

      const assignments = this.districtFactions[this.currentOrgKey] || {};

      let leftSeats = 0;
      let leftMembers = 0;
      const leftUnits = [];

      let rightSeats = 0;
      let rightMembers = 0;
      const rightUnits = [];

      let unassignedSeats = 0;
      let unassignedMembers = 0;
      const unassignedUnits = [];

      summary.results.forEach(u => {
        const assigned = assignments[u.id];
        if (assigned === f1.id) {
          leftSeats += u.ombud;
          leftMembers += u.members;
          leftUnits.push(u);
        } else if (assigned === f2.id) {
          rightSeats += u.ombud;
          rightMembers += u.members;
          rightUnits.push(u);
        } else {
          unassignedSeats += u.ombud;
          unassignedMembers += u.members;
          unassignedUnits.push(u);
        }
      });

      const leftPct = totalSeats > 0 ? (leftSeats / totalSeats) * 100 : 0;
      const rightPct = totalSeats > 0 ? (rightSeats / totalSeats) * 100 : 0;
      const unassignedPct = totalSeats > 0 ? (unassignedSeats / totalSeats) * 100 : 0;

      // Update Header Text & Stats (Clear, human readable - NO cryptic abbreviations!)
      if (this.duelLeftName) this.duelLeftName.textContent = f1.name;
      if (this.duelLeftMandates) {
        this.duelLeftMandates.innerHTML = `${leftSeats} <span class="text-xs font-semibold text-slate-500">ombud</span>`;
      }
      if (this.duelLeftSub) {
        this.duelLeftSub.textContent = `${leftPct.toFixed(1)}% • ${leftMembers.toLocaleString('sv-SE')} medlemmar`;
      }

      if (this.duelRightName) this.duelRightName.textContent = f2.name;
      if (this.duelRightMandates) {
        this.duelRightMandates.innerHTML = `${rightSeats} <span class="text-xs font-semibold text-slate-500">ombud</span>`;
      }
      if (this.duelRightSub) {
        this.duelRightSub.textContent = `${rightPct.toFixed(1)}% • ${rightMembers.toLocaleString('sv-SE')} medlemmar`;
      }

      if (this.duelUnassignedText) {
        this.duelUnassignedText.textContent = `${unassignedSeats} oallierade`;
      }

      // Duel Bars (Proportional left and right bars toward 50% line)
      if (this.duelBarLeft) {
        this.duelBarLeft.style.width = `${leftPct}%`;
        this.duelBarLeft.textContent = leftPct >= 14 ? `${leftSeats} ombud` : '';
      }
      if (this.duelBarRight) {
        this.duelBarRight.style.width = `${rightPct}%`;
        this.duelBarRight.textContent = rightPct >= 14 ? `${rightSeats} ombud` : '';
      }

      // Check for majority celebration
      let newlyWon = false;
      const leftHasMaj = leftSeats >= majorityNeeded;
      const rightHasMaj = rightSeats >= majorityNeeded;

      if (leftHasMaj && !f1.hadMajority) {
        f1.hadMajority = true;
        newlyWon = true;
      } else if (!leftHasMaj) {
        f1.hadMajority = false;
      }

      if (rightHasMaj && !f2.hadMajority) {
        f2.hadMajority = true;
        newlyWon = true;
      } else if (!rightHasMaj) {
        f2.hadMajority = false;
      }

      if (newlyWon && typeof confetti === 'function') {
        try {
          confetti({ particleCount: 65, spread: 70, origin: { y: 0.65 } });
        } catch(e) {}
      }

      // Update Status Banner
      if (this.duelStatusBanner) {
        if (leftHasMaj) {
          this.duelStatusBanner.innerHTML = `
            <span class="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
              🎉 ${escapeHtml(f1.name)} har säkrat egen majoritet! (${leftSeats} av ${summary.targetSeats} ombud)
            </span>
          `;
        } else if (rightHasMaj) {
          this.duelStatusBanner.innerHTML = `
            <span class="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
              🎉 ${escapeHtml(f2.name)} har säkrat egen majoritet! (${rightSeats} av ${summary.targetSeats} ombud)
            </span>
          `;
        } else {
          this.duelStatusBanner.innerHTML = `
            <span class="text-xs font-medium text-slate-600">
              Kvar till egen majoritet: <strong class="text-[#005ea8]">${majorityNeeded - leftSeats}</strong> (${escapeHtml(f1.name)}) vs <strong class="text-amber-700">${majorityNeeded - rightSeats}</strong> (${escapeHtml(f2.name)})
            </span>
          `;
        }
      }

      // Update pill counters in drop boxes
      if (this.leftPillCount) this.leftPillCount.textContent = `${leftSeats} ombud`;
      if (this.rightPillCount) this.rightPillCount.textContent = `${rightSeats} ombud`;
      if (this.poolCountBadge) this.poolCountBadge.textContent = `(${unassignedUnits.length} distrikt kvar)`;

      // Empty hints visibility
      if (this.leftEmptyHint) this.leftEmptyHint.style.display = leftUnits.length === 0 ? 'block' : 'none';
      if (this.rightEmptyHint) this.rightEmptyHint.style.display = rightUnits.length === 0 ? 'block' : 'none';

      // 1. Render Left Chips
      this.leftChipsContainer.innerHTML = '';
      leftUnits.forEach(u => {
        const chip = document.createElement('div');
        chip.className = 'district-drag-chip px-2.5 py-1.5 rounded-xl bg-white/95 border border-mblue-200/90 shadow-xs flex items-center justify-between gap-2 text-xs hover:shadow-md transition-all';
        chip.setAttribute('draggable', 'true');
        chip.dataset.id = u.id;
        chip.innerHTML = `
          <div class="flex items-center gap-1.5 min-w-0 select-none">
            <span class="w-2 h-2 rounded-full bg-[#005ea8] shrink-0"></span>
            <span class="font-bold text-slate-900 truncate">${escapeHtml(u.name)}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0 select-none">
            <span class="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#005ea8] text-white tabular-nums shadow-xs">${u.ombud}</span>
            <button class="btn-remove-chip text-slate-400 hover:text-rose-600 transition rounded-full w-4 h-4 flex items-center justify-center font-bold" data-id="${u.id}" title="Ta bort och lägg tillbaka till oallierade">
              ×
            </button>
          </div>
        `;
        this.attachChipEvents(chip, u.id);
        this.leftChipsContainer.appendChild(chip);
      });

      // 2. Render Right Chips
      this.rightChipsContainer.innerHTML = '';
      rightUnits.forEach(u => {
        const chip = document.createElement('div');
        chip.className = 'district-drag-chip px-2.5 py-1.5 rounded-xl bg-white/95 border border-amber-200/90 shadow-xs flex items-center justify-between gap-2 text-xs hover:shadow-md transition-all';
        chip.setAttribute('draggable', 'true');
        chip.dataset.id = u.id;
        chip.innerHTML = `
          <div class="flex items-center gap-1.5 min-w-0 select-none">
            <span class="w-2 h-2 rounded-full bg-[#d97706] shrink-0"></span>
            <span class="font-bold text-slate-900 truncate">${escapeHtml(u.name)}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0 select-none">
            <span class="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#d97706] text-white tabular-nums shadow-xs">${u.ombud}</span>
            <button class="btn-remove-chip text-slate-400 hover:text-rose-600 transition rounded-full w-4 h-4 flex items-center justify-center font-bold" data-id="${u.id}" title="Ta bort och lägg tillbaka till oallierade">
              ×
            </button>
          </div>
        `;
        this.attachChipEvents(chip, u.id);
        this.rightChipsContainer.appendChild(chip);
      });

      // 3. Render Pool Chips (Sorted by ombud descending: largest districts first!)
      unassignedUnits.sort((a, b) => b.ombud - a.ombud || b.members - a.members);
      this.poolChipsContainer.innerHTML = '';
      unassignedUnits.forEach(u => {
        const chip = document.createElement('div');
        chip.className = 'district-drag-chip apple-glass-pill px-2.5 py-1.5 rounded-xl border border-white/90 shadow-xs flex items-center gap-2 hover:shadow-md hover:scale-[1.02] transition-all';
        chip.setAttribute('draggable', 'true');
        chip.dataset.id = u.id;
        chip.innerHTML = `
          <button class="quick-move-btn px-1.5 py-0.5 rounded-full text-[10px] font-black bg-mblue-50 text-mblue-700 hover:bg-mblue-600 hover:text-white transition shadow-xs" data-move="${f1.id}" title="Flytta till ${escapeHtml(f1.name)}">
            ←
          </button>
          <span class="text-xs font-bold text-slate-800 select-none">${escapeHtml(u.name)}</span>
          <span class="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-800 text-white tabular-nums select-none shadow-xs">${u.ombud}</span>
          <button class="quick-move-btn px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white transition shadow-xs" data-move="${f2.id}" title="Flytta till ${escapeHtml(f2.name)}">
            →
          </button>
        `;
        this.attachChipEvents(chip, u.id);
        this.poolChipsContainer.appendChild(chip);
      });

      // Attach editable name handlers
      document.querySelectorAll('.faction-name-editable').forEach(el => {
        el.addEventListener('blur', (e) => {
          const id = e.target.dataset.id;
          const newName = e.target.textContent.trim();
          const f = this.factions.find(x => x.id === id);
          if (f && newName && newName !== f.name) {
            f.name = newName;
            f.shortName = newName.slice(0, 6);
            this.saveFactions();
            this.render();
          }
        });
      });

      if (window.lucide) window.lucide.createIcons();
    }

    attachChipEvents(chip, unitId) {
      chip.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', unitId);
        e.dataTransfer.effectAllowed = 'move';
        chip.classList.add('dragging');
      });

      chip.addEventListener('dragend', () => {
        chip.classList.remove('dragging');
      });

      // Mobile & Tablet Touch Drag-and-Drop
      let touchGhost = null;
      let startX = 0, startY = 0;
      let isDragging = false;

      chip.addEventListener('touchstart', (e) => {
        if (e.target.closest('button')) return;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = false;
      }, { passive: true });

      chip.addEventListener('touchmove', (e) => {
        if (e.target.closest('button')) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        // If moved more than 10px, activate drag mode
        if (!isDragging && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
          isDragging = true;
          chip.classList.add('dragging');

          touchGhost = chip.cloneNode(true);
          touchGhost.classList.remove('dragging');
          touchGhost.classList.add('shadow-2xl');
          touchGhost.style.position = 'fixed';
          touchGhost.style.zIndex = '9999';
          touchGhost.style.pointerEvents = 'none';
          touchGhost.style.opacity = '0.92';
          touchGhost.style.transform = 'translate(-50%, -50%) scale(1.04)';
          touchGhost.style.left = `${touch.clientX}px`;
          touchGhost.style.top = `${touch.clientY}px`;
          document.body.appendChild(touchGhost);
        }

        if (isDragging && touchGhost) {
          if (e.cancelable) e.preventDefault();
          touchGhost.style.left = `${touch.clientX}px`;
          touchGhost.style.top = `${touch.clientY}px`;

          const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
          const dropZone = elemBelow ? elemBelow.closest('.drop-zone') : null;

          document.querySelectorAll('.drop-zone').forEach(z => {
            z.classList.remove('drag-over', 'drag-over-amber');
          });

          if (dropZone) {
            dropZone.classList.add(dropZone === this.dropZoneRight ? 'drag-over-amber' : 'drag-over');
          }
        }
      }, { passive: false });

      chip.addEventListener('touchend', (e) => {
        if (isDragging) {
          chip.classList.remove('dragging');
          if (touchGhost) {
            touchGhost.remove();
            touchGhost = null;
          }

          document.querySelectorAll('.drop-zone').forEach(z => {
            z.classList.remove('drag-over', 'drag-over-amber');
          });

          const touch = e.changedTouches[0];
          const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
          const dropZone = elemBelow ? elemBelow.closest('.drop-zone') : null;

          if (dropZone) {
            const targetFaction = dropZone.dataset.faction || null;
            this.setDistrictFaction(unitId, targetFaction);
          }
          isDragging = false;
        }
      });

      const removeBtn = chip.querySelector('.btn-remove-chip');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.setDistrictFaction(unitId, null);
        });
      }

      const quickMoveBtns = chip.querySelectorAll('.quick-move-btn');
      quickMoveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetFaction = btn.dataset.move;
          this.setDistrictFaction(unitId, targetFaction);
        });
      });
    }

    updatePrintHeaders(summary, orgMeta) {
      if (this.printOrgTitle) this.printOrgTitle.textContent = `Officiellt Ombudsfördelningsprotokoll – ${orgMeta.name}`;
      if (this.printAssembly) this.printAssembly.textContent = orgMeta.assemblyName;
      if (this.printDate) this.printDate.textContent = `Skärningsdatum: 31 december | Upprättat: ${new Date().toLocaleDateString('sv-SE')}`;
      if (this.printDivisor) this.printDivisor.textContent = `Fastställd Divisor (D): ${summary.divisor.toFixed(2)} (Intervall ${summary.divisorMin.toFixed(2)} – ${summary.divisorMax.toFixed(2)})`;
      if (this.printBaseMandate) this.printBaseMandate.textContent = `Grundmandat: Minst ${summary.minSeats} ombud per ${orgMeta.unitTypeLabel.toLowerCase()}`;
    }

    openPasteModal() {
      if (!this.pasteModal) return;
      this.pasteTextarea.value = '';
      this.pasteModal.classList.remove('hidden');
      this.pasteTextarea.focus();
    }

    closePasteModal() {
      if (!this.pasteModal) return;
      this.pasteModal.classList.add('hidden');
    }

    handleApplyPaste() {
      const rawText = this.pasteTextarea.value.trim();
      if (!rawText) {
        this.closePasteModal();
        return;
      }

      const lines = rawText.split(/\r?\n/);
      const parsedUnits = [];

      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        let parts = [];
        if (trimmed.includes('\t')) parts = trimmed.split('\t');
        else if (trimmed.includes(';')) parts = trimmed.split(';');
        else if (trimmed.includes(',')) parts = trimmed.split(',');
        else {
          const match = trimmed.match(/^(.*?)\s+(\d[\d\s]*)$/);
          if (match) parts = [match[1], match[2]];
          else parts = [trimmed, '0'];
        }

        if (parts.length >= 2) {
          const name = parts[0].replace(/^["']|["']$/g, '').trim();
          const memberStr = parts[1].replace(/[\s\u00A0\.]/g, '').replace(/,/g, '.');
          const members = parseInt(memberStr, 10) || 0;

          if (name) {
            parsedUnits.push({
              id: `pasted-${idx + 1}-${Date.now()}`,
              name,
              members
            });
          }
        }
      });

      if (parsedUnits.length > 0) {
        this.orgData[this.currentOrgKey] = parsedUnits;
        this.saveData();
        this.closePasteModal();
        this.render();
        this.showToast(`Importerade ${parsedUnits.length} enheter!`);
        if (window.confetti) {
          window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
        }
      } else {
        alert('Kunde inte identifiera giltiga rader. Kontrollera formatet (Namn och Medlemsantal).');
      }
    }

    showToast(message) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toast-message');
      if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.classList.remove('opacity-0', '-translate-y-24', 'pointer-events-none');
        toast.classList.add('opacity-100', 'translate-y-0');
        if (this._toastTimer) clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
          toast.classList.remove('opacity-100', 'translate-y-0');
          toast.classList.add('opacity-0', '-translate-y-24', 'pointer-events-none');
        }, 2800);
        return;
      }
      if (this.toastContainer) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<span>${escapeHtml(message)}</span>`;
        this.toastContainer.appendChild(t);
        setTimeout(() => t.remove(), 2500);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.app = new OmbudsApp();
  });

})();

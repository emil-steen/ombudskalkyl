/**
 * Exportmodul för Ombudsfördelningskalkylatorn
 * Stödjer CSV (UTF-8 BOM för svensk Excel), TSV (Urklipp),
 * formaterad Markdown, XML/HTML-kalkylblad (Excel) och utskrifts-/PDF-läge.
 */

/**
 * Exporterar beräkningsresultat till en ren CSV-fil med semikolon och UTF-8 BOM
 * @param {import('./calculator.js').CalculationSummary} summary 
 * @param {string} orgName 
 */
export function exportToCSV(summary, orgName) {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `ombudsfordelning_${orgName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${dateStr}.csv`;

  const rows = [
    [`Ombudsfördelning - ${orgName}`],
    [`Genererad: ${new Date().toLocaleString('sv-SE')}`],
    [`Målram ombud: ${summary.targetSeats}`, `Faktiskt fördelade ombud: ${summary.totalOmbud}`],
    [`Fastställd Divisor (D): ${summary.divisor.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`],
    [`Giltigt Divisorintervall: ${summary.divisorMin.toLocaleString('sv-SE')} - ${summary.divisorMax.toLocaleString('sv-SE')}`],
    [`Grundmandat per enhet: ${summary.minSeats} st`],
    [],
    ['Nr', 'Enhetsnamn', 'Medlemmar', 'Andel Medlemmar (%)', 'Kvot (M/D)', 'Naturlig Avrundning', 'Tilldelade Ombud', 'Tilldelningstyp', 'Marginal till nästa (+1)', 'Marginal att behålla (-1)']
  ];

  summary.results.forEach((r, idx) => {
    rows.push([
      idx + 1,
      `"${r.name.replace(/"/g, '""')}"`,
      r.members,
      r.shareMembers.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) + '%',
      r.rawQuota.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
      r.roundedQuota,
      r.ombud,
      r.isLotteryWinner ? 'Kvotmandat (Lottning)' : (r.isBaseMandate ? 'Grundmandat' : 'Kvotmandat'),
      `+${r.neededForNext} medl.`,
      r.dropMargin !== null ? `${r.dropMargin} medl.` : 'Skyddad (grundmandat)'
    ]);
  });

  rows.push([]);
  rows.push([
    'TOTALT',
    '',
    summary.totalMembers,
    '100.00%',
    '',
    '',
    summary.totalOmbud,
    summary.baseMandateUnitsCount > 0 ? `${summary.baseMandateUnitsCount} distrikt på grundmandat` : 'Samtliga på kvot',
    '',
    ''
  ]);

  // Skapa CSV med semikolon som avgränsare för svenskt Excel
  const csvContent = '\uFEFF' + rows.map(e => e.join(';')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * Exporterar till ett Excel-kompatibelt XML-kalkylblad (.xls) med fullständig formatering
 * @param {import('./calculator.js').CalculationSummary} summary 
 * @param {string} orgName 
 */
export function exportToExcel(summary, orgName) {
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
            <x:WorksheetOptions>
              <x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; }
      th { background-color: #005ea8; color: #ffffff; font-weight: bold; border: 1px solid #003f7a; padding: 7px 10px; }
      td { border: 1px solid #e2e8f0; padding: 6px 10px; }
      .header-title { font-size: 16pt; font-weight: bold; color: #003f7a; }
      .meta { font-size: 10pt; color: #475569; }
      .num { text-align: right; }
      .total-row { font-weight: bold; background-color: #f1f5f9; border-top: 2px solid #005ea8; }
      .grundmandat { color: #b45309; font-weight: 600; }
    </style>
  </head>
  <body>
    <table>
      <tr><td colspan="9" class="header-title">Officiell Ombudsfördelning – ${escapeHtml(orgName)}</td></tr>
      <tr><td colspan="9" class="meta">Beräknad: ${new Date().toLocaleString('sv-SE')} | Metod: Websters heltalsavrundning (Sainte-Laguë)</td></tr>
      <tr><td colspan="9" class="meta">Divisor (D): ${summary.divisor.toFixed(2)} (Intervall: ${summary.divisorMin.toFixed(2)} – ${summary.divisorMax.toFixed(2)}) | Grundmandat: Minst ${summary.minSeats} ombud</td></tr>
      <tr><td colspan="9"></td></tr>
      <thead>
        <tr>
          <th>Nr</th>
          <th>Distrikt / Förening</th>
          <th>Medlemsantal</th>
          <th>Andel Medlemmar</th>
          <th>Kvot (M / D)</th>
          <th>Tilldelade Ombud</th>
          <th>Tilldelningstyp</th>
          <th>Till nästa (+1)</th>
          <th>Marginal (-1)</th>
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
        <td class="num" style="font-weight:bold; font-size:11pt; color:#005ea8;">${r.ombud}</td>
        <td class="${r.isLotteryWinner ? 'lottat' : (r.isBaseMandate ? 'grundmandat' : '')}">${r.isLotteryWinner ? 'Kvotmandat (Lottning)' : (r.isBaseMandate ? 'Grundmandat' : 'Kvotmandat')}</td>
        <td class="num">+${r.neededForNext}</td>
        <td class="num">${r.dropMargin !== null ? r.dropMargin : '–'}</td>
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
        <td></td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </body>
  </html>
  `;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * Kopierar tabellen som flikseparerad text (perfekt för att klistra in i Excel eller Numbers)
 * @param {import('./calculator.js').CalculationSummary} summary 
 */
export async function copyToClipboardTSV(summary) {
  const header = ['Nr', 'Enhet', 'Medlemmar', 'Andel Medlemmar', 'Kvot (M/D)', 'Tilldelade Ombud', 'Status', 'Till nästa (+1)', 'Marginal (-1)'].join('\t');
  const rows = summary.results.map((r, idx) => [
    idx + 1,
    r.name,
    r.members,
    `${r.shareMembers.toFixed(2)}%`,
    r.rawQuota.toFixed(2),
    r.ombud,
    r.isLotteryWinner ? 'Kvotmandat (Lottning)' : (r.isBaseMandate ? 'Grundmandat' : 'Kvotmandat'),
    `+${r.neededForNext}`,
    r.dropMargin !== null ? `${r.dropMargin}` : 'Skyddad'
  ].join('\t'));

  const totalRow = ['TOTALT', '', summary.totalMembers, '100.00%', '', summary.totalOmbud, '', '', ''].join('\t');
  const fullText = [header, ...rows, totalRow].join('\n');

  try {
    await navigator.clipboard.writeText(fullText);
    return true;
  } catch (err) {
    console.error('Kunde inte kopiera till urklipp:', err);
    return false;
  }
}

/**
 * Kopierar tabellen som en formaterad GitHub Markdown-tabell
 * @param {import('./calculator.js').CalculationSummary} summary 
 * @param {string} orgName 
 */
export async function copyToClipboardMarkdown(summary, orgName) {
  let md = `### Ombudsfördelning: ${orgName}\n\n`;
  md += `* **Totala medlemmar:** ${summary.totalMembers.toLocaleString('sv-SE')}\n`;
  md += `* **Fördelade ombud:** ${summary.totalOmbud} st (Mål: ${summary.targetSeats})\n`;
  md += `* **Fastställd divisor (D):** ${summary.divisor.toFixed(2)} (Intervall: ${summary.divisorMin.toFixed(2)} – ${summary.divisorMax.toFixed(2)})\n`;
  md += `* **Grundmandatsnivå:** Minst ${summary.minSeats} grundmandat per enhet\n\n`;
  md += `| Nr | Distrikt / Förening | Medlemmar | Andel | Kvot (M/D) | Ombud | Status |\n`;
  md += `|---|---|---|---|---|---|---|\n`;

  summary.results.forEach((r, idx) => {
    md += `| ${idx + 1} | ${r.name} | ${r.members.toLocaleString('sv-SE')} | ${r.shareMembers.toFixed(2)}% | ${r.rawQuota.toFixed(2)} | **${r.ombud}** | ${r.isLotteryWinner ? 'Kvot (Lottat)' : (r.isBaseMandate ? 'Grundmandat' : 'Kvot')} |\n`;
  });

  md += `| | **TOTALT** | **${summary.totalMembers.toLocaleString('sv-SE')}** | **100%** | | **${summary.totalOmbud}** | |\n`;

  try {
    await navigator.clipboard.writeText(md);
    return true;
  } catch (err) {
    console.error('Kunde inte kopiera markdown:', err);
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
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 150);
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

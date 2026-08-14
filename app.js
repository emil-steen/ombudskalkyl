/**
 * Ombudsfördelningskalkylator: Huvudapplikation och UI-styrning
 */

import { ORG_CONFIGS } from './data.js';
import { calculateOmbud } from './calculator.js';
import { exportToCSV, exportToExcel, copyToClipboardTSV, copyToClipboardMarkdown } from './export.js';

// Apple Liquid Glass färgpalett för distrikt i plenisalen
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

    this.initElements();
    this.initEventListeners();
    this.initTheme();
    this.render();
  }

  loadInitialData() {
    try {
      const saved = localStorage.getItem('muf_ombud_data_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Kunde inte läsa från localStorage:', e);
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
      console.warn('Kunde inte spara till localStorage:', e);
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

    this.plenumSvg = document.getElementById('plenum-svg');
    this.plenumLegend = document.getElementById('plenum-legend');

    this.printOrgTitle = document.getElementById('print-org-title');
    this.printDate = document.getElementById('print-date');
    this.printDivisor = document.getElementById('print-divisor');
    this.printBaseMandate = document.getElementById('print-base-mandate');
    this.printAssembly = document.getElementById('print-assembly');

    this.pasteModal = document.getElementById('paste-modal');
    this.pasteTextarea = document.getElementById('paste-textarea');
    this.toastContainer = document.getElementById('toast-container');
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');
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

    if (this.inputMinSeats) {
      this.inputMinSeats.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0) {
          this.customConfigs[this.currentOrgKey].minSeats = val;
          this.render();
        }
      });
    }

    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm(`Vill du återställa tabellen för ${ORG_CONFIGS[this.currentOrgKey].shortName} till 2025 års officiella siffror?`)) {
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

    const copyMdBtn = document.getElementById('btn-copy-md');
    if (copyMdBtn) {
      copyMdBtn.addEventListener('click', async () => {
        const summary = this.getSummary();
        const success = await copyToClipboardMarkdown(summary, ORG_CONFIGS[this.currentOrgKey].name);
        if (success) this.showToast('Markdown-tabell kopierad till urklipp.');
      });
    }

    const printBtn = document.getElementById('btn-print-protocol');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('muf_theme', nextTheme);
        this.updateThemeButton(nextTheme);
      });
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('muf_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', activeTheme);
    this.updateThemeButton(activeTheme);
  }

  updateThemeButton(theme) {
    if (!this.themeToggleBtn) return;
    this.themeToggleBtn.innerHTML = theme === 'dark'
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
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
    this.renderPlenum(summary);
    this.updatePrintHeaders(summary, orgMeta);
  }

  renderKPIs(summary, orgMeta) {
    if (this.totalMembersEl) {
      this.totalMembersEl.textContent = summary.totalMembers.toLocaleString('sv-SE');
    }

    if (this.totalOmbudEl) {
      this.totalOmbudEl.textContent = summary.totalOmbud;
    }

    if (this.targetSeatsBadgeEl) {
      if (summary.isExactMatch) {
        this.targetSeatsBadgeEl.className = 'stat-pill success';
        this.targetSeatsBadgeEl.textContent = `Exakt ram (${summary.targetSeats} mål)`;
      } else {
        this.targetSeatsBadgeEl.className = 'stat-pill warning';
        this.targetSeatsBadgeEl.textContent = `Diff (${summary.totalOmbud} / ${summary.targetSeats})`;
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

    if (this.baseMandateCountEl) {
      this.baseMandateCountEl.textContent = summary.baseMandateUnitsCount;
    }

    if (this.baseMandateMetaEl) {
      this.baseMandateMetaEl.textContent = summary.minSeats > 0
        ? `Minst ${summary.minSeats} grundmandat per distrikt`
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
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB, 'sv')
          : valB.localeCompare(valA, 'sv');
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
        statusBadge = `<span class="status-badge grundmandat" title="Mottog mandat tack vare grundmandatsnivån (${summary.minSeats} st)">Grundmandat</span>`;
      } else if (r.ombud > 0) {
        statusBadge = `<span class="status-badge kvot" title="Kvalificerade proportionellt via röstkvot">Kvotmandat</span>`;
      } else {
        statusBadge = `<span class="status-badge sparr" title="Nådde ej upp till minsta tröskel">Under spärr</span>`;
      }

      tr.innerHTML = `
        <td class="num"><span class="unit-rank">${idx + 1}</span></td>
        <td>
          <div class="unit-name-cell">
            <span class="unit-name-text" contenteditable="true" data-id="${r.id}" data-field="name">${escapeHtml(r.name)}</span>
          </div>
        </td>
        <td class="num">
          <input type="number" min="0" step="1" class="inline-input-members" data-id="${r.id}" value="${r.members}">
        </td>
        <td class="num">${r.shareMembers.toFixed(2)}%</td>
        <td class="num">${r.rawQuota.toFixed(2)}</td>
        <td class="num">
          <span class="ombud-badge">${r.ombud}</span>
        </td>
        <td>${statusBadge}</td>
        <td class="num">
          <span style="color: var(--accent-green); font-weight: 600;">+${r.neededForNext}</span>
        </td>
        <td class="num">
          <span style="color: var(--text-secondary);">${r.dropMargin !== null ? r.dropMargin : '–'}</span>
        </td>
        <td class="num" style="width: 40px;">
          <button class="btn btn-subtle btn-icon btn-delete-row" data-id="${r.id}" title="Ta bort rad" style="color: var(--accent-red); width: 28px; height: 28px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
          <td class="num"><strong>100.00%</strong></td>
          <td class="num"><strong>–</strong></td>
          <td class="num"><strong><span class="ombud-badge" style="background: linear-gradient(180deg, var(--muf-blue-accent), var(--muf-blue)); color: white;">${summary.totalOmbud}</span></strong></td>
          <td><strong>${summary.baseMandateUnitsCount > 0 ? summary.baseMandateUnitsCount + ' på grundmandat' : 'Samtliga kvot'}</strong></td>
          <td colspan="3"></td>
        </tr>
      `;
    }
  }

  updateSortHeaders() {
    this.thElements.forEach(th => {
      const col = th.dataset.sort;
      const originalText = th.dataset.label || th.textContent.replace(/[ ▲▼]/g, '');
      th.dataset.label = originalText;

      if (col === this.sortColumn) {
        th.textContent = `${originalText} ${this.sortDirection === 'asc' ? '▲' : '▼'}`;
        th.style.color = 'var(--muf-blue)';
      } else {
        th.textContent = originalText;
        th.style.color = '';
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
      item.className = 'marginal-item';
      item.innerHTML = `
        <div>
          <div class="marginal-district">${idx + 1}. ${escapeHtml(r.name)}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${r.members.toLocaleString('sv-SE')} medl. (${r.ombud} ombud)</div>
        </div>
        <div class="marginal-diff" title="Kräver ytterligare ${r.neededForNext} medlemmar för att nå ${r.ombud + 1} ombud">
          +${r.neededForNext} medl.
        </div>
      `;
      this.marginalListEl.appendChild(item);
    });
  }

  renderPlenum(summary) {
    if (!this.plenumSvg || !this.plenumLegend) return;

    const totalSeats = summary.totalOmbud;
    this.plenumSvg.innerHTML = '';
    this.plenumLegend.innerHTML = '';

    if (totalSeats === 0) return;

    const unitColors = {};
    summary.results.forEach((u, i) => {
      unitColors[u.id] = DISTRICT_COLORS[i % DISTRICT_COLORS.length];
    });

    const centerX = 300;
    const centerY = 240;
    const rowsCount = totalSeats > 80 ? 5 : 4;
    const minRadius = 90;
    const maxRadius = 210;
    const radiusStep = (maxRadius - minRadius) / (rowsCount - 1);

    const seatsPerRow = [];
    for (let r = 0; r < rowsCount; r++) {
      const radius = minRadius + r * radiusStep;
      seatsPerRow.push({ radius, count: 0, weight: radius });
    }
    const totalWeight = seatsPerRow.reduce((sum, row) => sum + row.weight, 0);
    seatsPerRow.forEach((row) => {
      row.count = Math.floor((row.weight / totalWeight) * totalSeats);
    });
    let allocatedRowsSum = seatsPerRow.reduce((sum, row) => sum + row.count, 0);
    let diff = totalSeats - allocatedRowsSum;
    while (diff > 0) {
      seatsPerRow[seatsPerRow.length - 1].count++;
      diff--;
    }

    const seatList = [];
    summary.results.forEach(u => {
      for (let i = 0; i < u.ombud; i++) {
        seatList.push({
          unitId: u.id,
          unitName: u.name,
          seatIndex: i + 1,
          totalUnitSeats: u.ombud,
          color: unitColors[u.id]
        });
      }
    });

    let seatCursor = 0;
    seatsPerRow.forEach((row) => {
      const { radius, count } = row;
      if (count === 0) return;

      const angleStep = Math.PI / (count + 1);
      for (let i = 1; i <= count; i++) {
        if (seatCursor >= seatList.length) break;
        const seat = seatList[seatCursor++];
        const angle = Math.PI - i * angleStep;

        const x = centerX + radius * Math.cos(angle);
        const y = centerY - radius * Math.sin(angle);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', totalSeats > 80 ? '6.5' : '8');
        circle.setAttribute('fill', seat.color);
        circle.setAttribute('class', 'seat-dot');

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${seat.unitName}: Ombud ${seat.seatIndex} av ${seat.totalUnitSeats}`;
        circle.appendChild(title);

        this.plenumSvg.appendChild(circle);
      }
    });

    summary.results.filter(u => u.ombud > 0).forEach(u => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `
        <span class="legend-dot" style="background-color: ${unitColors[u.id]};"></span>
        <span>${escapeHtml(u.name)} (${u.ombud})</span>
      `;
      this.plenumLegend.appendChild(item);
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
    this.pasteModal.classList.add('open');
    this.pasteTextarea.focus();
  }

  closePasteModal() {
    if (!this.pasteModal) return;
    this.pasteModal.classList.remove('open');
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
      this.showToast(`Importerade ${parsedUnits.length} enheter framgångsrikt!`);
    } else {
      alert('Kunde inte identifiera giltiga rader. Kontrollera formatet (Namn och Medlemsantal).');
    }
  }

  showToast(message) {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-green);"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${escapeHtml(message)}</span>
    `;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new OmbudsApp();
});

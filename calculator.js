/**
 * Ombudsfördelningskalkylator: Matematisk beräkningsmotor
 * Implementerar Websters metod / Sainte-Laguës heltalsavrundning
 * med stöd för grundmandat och marginalkalkyler.
 */

/**
 * @typedef {Object} UnitInput
 * @property {string} id
 * @property {string} name
 * @property {number} members
 */

/**
 * @typedef {Object} UnitResult
 * @property {string} id
 * @property {string} name
 * @property {number} members
 * @property {number} rawQuota         - M / D (exakt kvot)
 * @property {number} roundedQuota     - round(M / D) (naturligt antal mandat före grundmandat)
 * @property {number} ombud            - max(minSeats, round(M / D)) (slutgiltigt tilldelade ombud)
 * @property {boolean} isBaseMandate   - Sant om enheten fick mandat genom grundmandatsnivå
 * @property {number} shareMembers     - Andel av totala medlemsantalet i %
 * @property {number} shareOmbud       - Andel av totala ombudsantalet i %
 * @property {number} neededForNext    - Medlemmar som saknas till ytterligare 1 mandat
 * @property {number|null} dropMargin  - Medlemmar som kan tappas innan ett mandat förloras (null om skyddat av grundmandat)
 */

/**
 * @typedef {Object} CalculationSummary
 * @property {UnitResult[]} results
 * @property {number} totalMembers
 * @property {number} totalOmbud
 * @property {number} targetSeats
 * @property {number} minSeats
 * @property {number} divisor
 * @property {number} divisorMin
 * @property {number} divisorMax
 * @property {number} baseMandateUnitsCount
 * @property {boolean} isExactMatch
 */

/**
 * Huvudfunktion för att beräkna ombudsfördelning
 * @param {UnitInput[]} units 
 * @param {{ targetSeats: number, minSeats: number }} config 
 * @returns {CalculationSummary}
 */
export function calculateOmbud(units, config) {
  const targetSeats = Number(config.targetSeats) || 101;
  const minSeats = Number(config.minSeats) || 0;

  // Filtrera och sanera indata
  const cleanUnits = units.map((u, idx) => ({
    id: u.id || `unit-${idx + 1}`,
    name: (u.name || `Enhet ${idx + 1}`).trim(),
    members: Math.max(0, parseInt(u.members, 10) || 0)
  }));

  const totalMembers = cleanUnits.reduce((sum, u) => sum + u.members, 0);

  if (totalMembers === 0 || cleanUnits.length === 0) {
    const defaultResults = cleanUnits.map(u => ({
      ...u,
      rawQuota: 0,
      roundedQuota: 0,
      ombud: minSeats,
      isBaseMandate: minSeats > 0,
      shareMembers: 0,
      shareOmbud: cleanUnits.length > 0 ? Number((100 / cleanUnits.length).toFixed(2)) : 0,
      neededForNext: 1,
      dropMargin: null
    }));

    return {
      results: defaultResults,
      totalMembers: 0,
      totalOmbud: cleanUnits.length * minSeats,
      targetSeats,
      minSeats,
      divisor: 1,
      divisorMin: 1,
      divisorMax: 1,
      baseMandateUnitsCount: minSeats > 0 ? cleanUnits.length : 0,
      isExactMatch: cleanUnits.length * minSeats === targetSeats
    };
  }

  // 1. Binärsökning för att hitta effektiv divisor (D)
  const getSeatsAtDivisor = (d) => {
    return cleanUnits.reduce((sum, u) => {
      const natural = Math.round(u.members / d);
      return sum + Math.max(minSeats, natural);
    }, 0);
  };

  let dLow = 0.0001;
  let dHigh = Math.max(totalMembers * 2, 100000);
  let bestD = totalMembers / Math.max(1, targetSeats);

  while (getSeatsAtDivisor(dLow) < targetSeats && dLow > 0.000001) {
    dLow /= 2;
  }
  while (getSeatsAtDivisor(dHigh) > targetSeats) {
    dHigh *= 2;
  }

  // Binärsökning med 100 iterationer
  for (let i = 0; i < 100; i++) {
    const dMid = (dLow + dHigh) / 2;
    const currentSeats = getSeatsAtDivisor(dMid);

    if (currentSeats === targetSeats) {
      bestD = dMid;
      break;
    } else if (currentSeats > targetSeats) {
      dLow = dMid;
    } else {
      dHigh = dMid;
    }
    bestD = dMid;
  }

  // 2. Hitta giltiga divisor-intervallet [divisorMin, divisorMax]
  let dIntervalMin = bestD;
  let dIntervalMax = bestD;

  let bLow = dLow / 2;
  let bHigh = bestD;
  for (let i = 0; i < 50; i++) {
    const mid = (bLow + bHigh) / 2;
    if (getSeatsAtDivisor(mid) === targetSeats) {
      bHigh = mid;
      dIntervalMin = mid;
    } else {
      bLow = mid;
    }
  }

  bLow = bestD;
  bHigh = dHigh * 2;
  for (let i = 0; i < 50; i++) {
    const mid = (bLow + bHigh) / 2;
    if (getSeatsAtDivisor(mid) === targetSeats) {
      bLow = mid;
      dIntervalMax = mid;
    } else {
      bHigh = mid;
    }
  }

  const finalDivisor = (dIntervalMin + dIntervalMax) / 2;
  let baseMandateUnitsCount = 0;

  // 3. Bygg resultat för varje enhet
  const results = cleanUnits.map(u => {
    const rawQuota = u.members / finalDivisor;
    const roundedQuota = Math.round(rawQuota);
    const ombud = Math.max(minSeats, roundedQuota);
    const isBaseMandate = (minSeats > 0 && roundedQuota < minSeats);

    if (isBaseMandate) {
      baseMandateUnitsCount++;
    }

    const shareMembers = totalMembers > 0 ? (u.members / totalMembers) * 100 : 0;

    // Marginalanalys: Hur många medlemmar saknas till O_i + 1?
    const nextTargetSeats = ombud + 1;
    const thresholdNextQuota = nextTargetSeats - 0.5;
    const minMembersForNext = Math.ceil(thresholdNextQuota * finalDivisor);
    const neededForNext = Math.max(1, minMembersForNext - u.members);

    // Marginalanalys: Hur många medlemmar kan tappas innan ett mandat förloras?
    let dropMargin = null;
    if (ombud > minSeats) {
      const thresholdKeepQuota = ombud - 0.5;
      const minMembersToKeep = Math.ceil(thresholdKeepQuota * finalDivisor);
      dropMargin = Math.max(0, u.members - minMembersToKeep + 1);
    }

    return {
      id: u.id,
      name: u.name,
      members: u.members,
      rawQuota: Number(rawQuota.toFixed(4)),
      roundedQuota,
      ombud,
      isBaseMandate,
      shareMembers: Number(shareMembers.toFixed(2)),
      shareOmbud: 0,
      neededForNext,
      dropMargin
    };
  });

  const totalOmbud = results.reduce((sum, r) => sum + r.ombud, 0);

  results.forEach(r => {
    r.shareOmbud = totalOmbud > 0 ? Number(((r.ombud / totalOmbud) * 100).toFixed(2)) : 0;
  });

  return {
    results,
    totalMembers,
    totalOmbud,
    targetSeats,
    minSeats,
    divisor: Number(finalDivisor.toFixed(4)),
    divisorMin: Number(dIntervalMin.toFixed(4)),
    divisorMax: Number(dIntervalMax.toFixed(4)),
    baseMandateUnitsCount,
    isExactMatch: totalOmbud === targetSeats
  };
}

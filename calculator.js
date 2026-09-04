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
 * @property {boolean} [isTied]        - Sant om enheten står på gränskvot (tie)
 * @property {boolean} [isLotteryWinner] - Sant om enheten vann lottningen om mandat
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
 * @property {boolean} hasTie
 * @property {string[]} tiedUnitIds
 * @property {string[]} lotteryWinnerIds
 * @property {number} seatsToDistribute
 */

/**
 * Huvudfunktion för att beräkna ombudsfördelning
 * @param {UnitInput[]} units 
 * @param {{ targetSeats: number, minSeats: number, manualTieWinners?: string[], tieBreakSeed?: number }} config 
 * @returns {CalculationSummary}
 */
export function calculateOmbud(units, config) {
  const targetSeats = Number(config.targetSeats) || 101;
  const minSeats = config.minSeats !== undefined ? Number(config.minSeats) : 0;
  const manualTieWinners = Array.isArray(config.manualTieWinners) ? config.manualTieWinners : null;
  const tieBreakSeed = typeof config.tieBreakSeed === 'number' ? config.tieBreakSeed : 42;

  // Filtrera och sanera indata
  const cleanUnits = units
    .filter(u => u.members >= 0)
    .map((u, idx) => ({
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
      isTied: false,
      isLotteryWinner: false,
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
      isExactMatch: cleanUnits.length * minSeats === targetSeats,
      hasTie: false,
      tiedUnitIds: [],
      lotteryWinnerIds: [],
      seatsToDistribute: 0
    };
  }

  // Om grundmandat ensamt täcker eller överskrider målramen
  if (cleanUnits.length * minSeats >= targetSeats) {
    const defaultResults = cleanUnits.map(u => {
      const shareMembers = totalMembers > 0 ? (u.members / totalMembers) * 100 : 0;
      return {
        ...u,
        rawQuota: 0,
        roundedQuota: 0,
        ombud: minSeats,
        isBaseMandate: minSeats > 0,
        isTied: false,
        isLotteryWinner: false,
        shareMembers: Number(shareMembers.toFixed(2)),
        shareOmbud: Number((100 / cleanUnits.length).toFixed(2)),
        neededForNext: 1,
        dropMargin: null
      };
    });

    return {
      results: defaultResults,
      totalMembers,
      totalOmbud: cleanUnits.length * minSeats,
      targetSeats,
      minSeats,
      divisor: 1,
      divisorMin: 1,
      divisorMax: 1,
      baseMandateUnitsCount: minSeats > 0 ? cleanUnits.length : 0,
      isExactMatch: cleanUnits.length * minSeats === targetSeats,
      hasTie: false,
      tiedUnitIds: [],
      lotteryWinnerIds: [],
      seatsToDistribute: 0
    };
  }

  // 1. Gränsvärdesfunktion för att utvärdera mandat vid divisor d
  const TOL = 1e-7;
  const evalAtD = (d) => {
    let lowSum = 0;
    let highSum = 0;
    const boundary = [];
    for (const u of cleanUnits) {
      const q = u.members / d;
      const k = Math.floor(q);
      const rem = q - k;
      if (Math.abs(rem - 0.5) < TOL) {
        lowSum += Math.max(minSeats, k);
        highSum += Math.max(minSeats, k + 1);
        boundary.push(u.id);
      } else {
        const s = Math.max(minSeats, Math.round(q));
        lowSum += s;
        highSum += s;
      }
    }
    return { lowSum, highSum, boundary };
  };

  // Binärsökning för att hitta effektiv divisor
  let lowD = 0.0001;
  let highD = Math.max(totalMembers * 2, 100000);

  while (evalAtD(highD).highSum >= targetSeats) {
    highD *= 2;
  }
  while (evalAtD(lowD).lowSum < targetSeats) {
    lowD /= 2;
    if (lowD < 1e-7) break;
  }

  let bestMid = (lowD + highD) / 2;
  for (let i = 0; i < 120; i++) {
    bestMid = (lowD + highD) / 2;
    const { lowSum, highSum } = evalAtD(bestMid);
    if (lowSum > targetSeats) {
      lowD = bestMid;
    } else if (highSum < targetSeats) {
      highD = bestMid;
    } else {
      break;
    }
  }

  let bestD = bestMid;
  let { lowSum, highSum, boundary: boundaryIds } = evalAtD(bestD);

  // Finjustera bestD till exakt analytisk kvot M / (k + 0.5) om boundary-enheter finns
  for (const u of cleanUnits) {
    const q = u.members / bestD;
    const k = Math.round(q - 0.5);
    if (k + 0.5 > 0) {
      const candD = u.members / (k + 0.5);
      if (Math.abs(candD - bestD) / bestD < 1e-3) {
        const resCand = evalAtD(candD);
        if (resCand.lowSum <= targetSeats && targetSeats <= resCand.highSum) {
          bestD = candD;
          lowSum = resCand.lowSum;
          highSum = resCand.highSum;
          boundaryIds = resCand.boundary;
          break;
        }
      }
    }
  }

  // 2. Initial mandatfördelning
  const unitSeats = {};
  for (const u of cleanUnits) {
    const q = u.members / bestD;
    const k = Math.floor(q);
    const isBoundary = boundaryIds.includes(u.id);
    const naturalSeats = isBoundary ? k : Math.round(q);
    unitSeats[u.id] = Math.max(minSeats, naturalSeats);
  }

  let currentTotal = 0;
  for (const u of cleanUnits) {
    currentTotal += unitSeats[u.id];
  }

  // 3. Strikt Sainte-Laguë prioritetsjustering och likalägesgaranti
  let hasTie = false;
  let tiedUnitIds = [];
  let lotteryWinnerIds = [];
  let seatsToDistribute = 0;

  const getLotteryScore = (uid) => {
    let val = tieBreakSeed;
    for (let i = 0; i < uid.length; i++) {
      val += uid.charCodeAt(i) * (i + 1);
    }
    const s = Math.sin(val) * 10000;
    return s - Math.floor(s);
  };

  // Om totalen understiger målramen: tilldela enligt högsta nästa kvot
  while (currentTotal < targetSeats) {
    const prios = cleanUnits.map(u => {
      const cur = unitSeats[u.id];
      const p = u.members / (cur + 0.5);
      return { id: u.id, priority: p };
    });
    prios.sort((a, b) => b.priority - a.priority);
    const topP = prios[0].priority;
    const tiedGroup = prios.filter(p => Math.abs(p.priority - topP) < 1e-5).map(p => p.id);
    const needed = targetSeats - currentTotal;

    if (tiedGroup.length > needed) {
      hasTie = true;
      tiedUnitIds = [...tiedGroup];
      seatsToDistribute = needed;

      let winners = [];
      if (manualTieWinners && manualTieWinners.length > 0) {
        winners = manualTieWinners.filter(id => tiedGroup.includes(id)).slice(0, needed);
      }
      if (winners.length < needed) {
        const remaining = tiedGroup.filter(id => !winners.includes(id));
        remaining.sort((a, b) => getLotteryScore(a) - getLotteryScore(b));
        winners.push(...remaining.slice(0, needed - winners.length));
      }

      lotteryWinnerIds = winners;
      for (const wid of winners) {
        unitSeats[wid] += 1;
        currentTotal += 1;
      }
      break;
    } else {
      for (const uid of tiedGroup) {
        unitSeats[uid] += 1;
        currentTotal += 1;
      }
    }
  }

  // Om totalen överstiger målramen: dra tillbaka från lägsta erhållna kvot
  while (currentTotal > targetSeats) {
    const prios = [];
    for (const u of cleanUnits) {
      const cur = unitSeats[u.id];
      if (cur > minSeats) {
        prios.push({ id: u.id, priority: u.members / (cur - 0.5) });
      }
    }
    prios.sort((a, b) => a.priority - b.priority);
    const lowestP = prios[0].priority;
    const tiedGroup = prios.filter(p => Math.abs(p.priority - lowestP) < 1e-5).map(p => p.id);
    const toDrop = currentTotal - targetSeats;

    if (tiedGroup.length > toDrop) {
      hasTie = true;
      tiedUnitIds = [...tiedGroup];
      seatsToDistribute = tiedGroup.length - toDrop;

      let keepWinners = [];
      if (manualTieWinners && manualTieWinners.length > 0) {
        keepWinners = manualTieWinners.filter(id => tiedGroup.includes(id)).slice(0, seatsToDistribute);
      }
      if (keepWinners.length < seatsToDistribute) {
        const remaining = tiedGroup.filter(id => !keepWinners.includes(id));
        remaining.sort((a, b) => getLotteryScore(a) - getLotteryScore(b));
        keepWinners.push(...remaining.slice(0, seatsToDistribute - keepWinners.length));
      }

      lotteryWinnerIds = keepWinners;
      const droppers = tiedGroup.filter(id => !keepWinners.includes(id));
      for (const did of droppers) {
        unitSeats[did] -= 1;
        currentTotal -= 1;
      }
      break;
    } else {
      for (const did of tiedGroup) {
        unitSeats[did] -= 1;
        currentTotal -= 1;
      }
    }
  }

  // 4. Hitta giltigt divisorintervall
  let dIntervalMin = bestD;
  let dIntervalMax = bestD;

  if (!hasTie) {
    let bLow = lowD / 2;
    let bHigh = bestD;
    for (let i = 0; i < 50; i++) {
      const mid = (bLow + bHigh) / 2;
      if (evalAtD(mid).lowSum === targetSeats) {
        bHigh = mid;
        dIntervalMin = mid;
      } else {
        bLow = mid;
      }
    }

    bLow = bestD;
    bHigh = highD * 2;
    for (let i = 0; i < 50; i++) {
      const mid = (bLow + bHigh) / 2;
      if (evalAtD(mid).lowSum === targetSeats) {
        bLow = mid;
        dIntervalMax = mid;
      } else {
        bHigh = mid;
      }
    }
  }

  // 5. Bygg resultat per enhet
  let baseMandateUnitsCount = 0;
  const results = cleanUnits.map(u => {
    const rawQuota = u.members / bestD;
    const ombud = unitSeats[u.id];
    const isBoundary = tiedUnitIds.includes(u.id);
    const isWinner = lotteryWinnerIds.includes(u.id);
    const naturalSeats = Math.round(rawQuota);
    const isBaseMandate = (minSeats > 0 && naturalSeats < minSeats);

    if (isBaseMandate) {
      baseMandateUnitsCount++;
    }

    const shareMembers = totalMembers > 0 ? (u.members / totalMembers) * 100 : 0;

    // Marginalanalys: Till nästa mandat (+1)
    let neededForNext;
    if (isBoundary && !isWinner) {
      neededForNext = 1;
    } else {
      const thresholdNextQuota = ombud + 0.5;
      const minMembersForNext = Math.ceil(thresholdNextQuota * bestD);
      neededForNext = Math.max(1, minMembersForNext - u.members);
    }

    // Marginalanalys: Marginal före mandatförlust (-1)
    let dropMargin = null;
    if (ombud > minSeats) {
      if (isBoundary && isWinner) {
        dropMargin = 1;
      } else {
        const thresholdKeepQuota = ombud - 0.5;
        const minMembersToKeep = Math.ceil(thresholdKeepQuota * bestD);
        dropMargin = Math.max(0, u.members - minMembersToKeep + 1);
      }
    }

    return {
      id: u.id,
      name: u.name,
      members: u.members,
      shareMembers: Number(shareMembers.toFixed(2)),
      shareOmbud: 0,
      rawQuota: Number(rawQuota.toFixed(4)),
      roundedQuota: naturalSeats,
      ombud,
      isBaseMandate,
      isTied: isBoundary,
      isLotteryWinner: isWinner,
      neededForNext,
      dropMargin
    };
  });

  results.forEach(r => {
    r.shareOmbud = currentTotal > 0 ? Number(((r.ombud / currentTotal) * 100).toFixed(2)) : 0;
  });

  return {
    results,
    totalMembers,
    totalOmbud: currentTotal,
    targetSeats,
    minSeats,
    divisor: Number(bestD.toFixed(4)),
    divisorMin: Number(dIntervalMin.toFixed(4)),
    divisorMax: Number(dIntervalMax.toFixed(4)),
    baseMandateUnitsCount,
    isExactMatch: currentTotal === targetSeats,
    hasTie,
    tiedUnitIds,
    lotteryWinnerIds,
    seatsToDistribute
  };
}

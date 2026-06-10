// =============================================================================
// agentScripts.js — every pre-written string the demo plays back.
//
// Nothing here is generated at runtime. Log lines, intermediate findings, key
// finding cards and the orchestrator summary are all authored copy (FR-2).
// The simulation engine reads these and reveals them on a timer.
//
// Finding severities map to the key-finding card colours (FR-3):
//   'protected' → lime  (no action needed)
//   'monitor'   → amber (monitor / review)
//   'escalate'  → magenta (act now)
// =============================================================================

// The order in which agents are dispatched and complete.
export const AGENT_ORDER = ['exposure', 'position', 'costGuidance', 'contract'];

export const AGENTS = {
  exposure: {
    name: 'Exposure Agent',
    role: 'Maps which lines are exposed to the move',
    shortName: 'Exposure',
    logLines: [
      'Connecting to commodity index feed...',
      'Loading 50 ingredient lines from portfolio registry...',
      'Scanning for soybean linkage — direct and indirect...',
      'Oilseed category: 18 lines flagged as directly linked',
      'Grain co-products: cross-referencing CBOT correlation data...',
      '12 grain-linked lines added to exposure set',
      'Running price impact model at +8% futures delta...',
      'Applying FOB adjustment factors by origin region...',
      'Exposure scoring complete.',
    ],
    intermediate:
      'Early read: 26 of 50 lines show price sensitivity above threshold — oilseed category dominant',
    finding: {
      severity: 'monitor',
      text: '30 lines carry exposure to this futures movement. 18 direct (oilseed), 12 indirect (grain co-products). 20 lines unaffected.',
    },
  },

  position: {
    name: 'Position Agent',
    role: 'Checks inventory cover on exposed lines',
    shortName: 'Position',
    logLines: [
      'Pulling current inventory positions for 30 exposed lines...',
      'Checking stock cover in days against standard threshold (30d)...',
      '18 direct-linked lines assessed...',
      '12 lines: IN_POSITION — average cover 38 days',
      '6 lines: COST_PLUS with no forward cover',
      'Cross-checking against open purchase orders...',
      'No additional cover identified for COST_PLUS lines.',
      'Position assessment complete.',
    ],
    intermediate:
      'First pass: majority of direct-linked lines appear covered — COST_PLUS exposure concentrated in amino acids and specialty oilseeds',
    finding: {
      severity: 'protected',
      text: '12 of 18 direct-linked lines are IN_POSITION and protected — current price guidance holds. 6 cost-plus lines are fully exposed to the cost increase. No additional cover available.',
    },
  },

  costGuidance: {
    name: 'Cost Guidance Agent',
    role: 'Recalculates guidance for cost-plus lines',
    shortName: 'Cost',
    logLines: [
      'Loading RMMC guidance (regional competitive benchmark) for 18 cost-plus lines...',
      'Rebuilding contract cost guidance — landed cost, weighted across OpCos...',
      'Applying +8% raw material delta to the cost build-up...',
      'Adjusting for freight index (FOB Rotterdam, current week)...',
      'Average contract cost guidance moves +4.2% across affected lines',
      'Comparing updated guidance against RMMC and contract ceilings...',
      '3 lines exceed contract ceiling post-adjustment — flagging for escalation.',
      'Updated cost guidance prepared for sales distribution.',
    ],
    intermediate:
      'Preliminary: contract cost guidance will move +3.8–5.1% across most cost-plus lines — 3 lines approaching contract ceiling',
    finding: {
      severity: 'escalate',
      text: '18 cost-plus lines require updated contract cost guidance. Average increase: +4.2%, tracking above RMMC. 3 lines breach contract ceiling and need escalation before the next pricing window.',
    },
  },

  contract: {
    name: 'Contract Agent',
    role: 'Flags customer contracts now below cost guidance',
    shortName: 'Contract',
    logLines: [
      'Scanning active customer contracts linked to 30 exposed lines...',
      'Filtering for repricing dates within 90 days...',
      '9 contracts identified within the repricing window...',
      'Comparing contracted sell price to updated cost guidance...',
      '4 contracts now priced below updated cost — margin underwater...',
      'Assessing repricing urgency by volume and margin...',
      'Escalation priority assigned: 2 high, 2 medium.',
      'Contract margin report prepared for the commercial team.',
    ],
    intermediate:
      'Early flag: at least 4 customer contracts appear to be below updated cost guidance — volume-weighted margin impact being calculated',
    finding: {
      severity: 'escalate',
      text: '9 customer contracts reprice within 90 days. 4 are now priced below updated cost guidance (margin underwater). 2 need immediate commercial review; 2 can wait until next cycle.',
    },
  },
};

// Phase 4 — pre-scripted orchestrator convergence summary (FR-6). Written to
// read like a pricing analyst's real-time recommendation: what moved, what is
// covered, where the pressure is, and a clear call to act.
export const ORCHESTRATOR_SUMMARY =
  'Soybean futures opened +8% this morning, and the move runs through 30 of our 50 lines — 18 directly across the oilseed complex, 12 indirectly via grain co-products. Twelve of the directly-linked lines are well covered, averaging 38 days of stock, so their price guidance holds for now. The pressure is on the 18 cost-plus lines: updated contract cost guidance comes in at +4.2% on average, just above the RMMC benchmark, and three lines breach their contract ceiling — those need a pricing call before this afternoon’s window. On the commercial side, four customer contracts are now selling below refreshed cost; two carry enough volume to escalate today, the other two can wait for the next cycle. Recommendation: clear the three ceiling breaches and the two underwater contracts now, reprice the remaining cost-plus lines into the next window, and hold the covered and unaffected lines as they are. Fifty lines assessed in 28 seconds, no manual triage.';

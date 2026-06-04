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
      text: '12 of 18 direct-linked lines are IN_POSITION and protected. 6 cost-plus lines are fully exposed to spot movement. No additional cover available.',
    },
  },

  costGuidance: {
    name: 'Cost Guidance Agent',
    role: 'Recalculates guidance for cost-plus lines',
    shortName: 'Cost',
    logLines: [
      'Loading current RMMC benchmarks for 18 cost-plus lines...',
      'Applying +8% futures delta to base cost model...',
      'Adjusting for freight index (FOB Rotterdam, current week)...',
      'Recalculating expected landed cost per line...',
      'Average guidance adjustment: +4.2% across affected lines',
      '3 lines exceed contract ceiling post-adjustment...',
      'Flagging for escalation — ceiling breach confirmed.',
      'Updated cost guidance prepared for sales distribution.',
    ],
    intermediate:
      'Preliminary: cost guidance will move +3.8–5.1% across most cost-plus lines — 3 lines approaching contract ceiling',
    finding: {
      severity: 'escalate',
      text: '18 cost-plus lines require updated guidance. Average increase: +4.2%. 3 lines breach contract ceiling and need escalation before the next pricing window.',
    },
  },

  contract: {
    name: 'Contract Agent',
    role: 'Flags contracts now below cost guidance',
    shortName: 'Contract',
    logLines: [
      'Scanning active contracts linked to 30 exposed lines...',
      'Filtering for renewal dates within 90 days...',
      '9 contracts identified within renewal window...',
      'Comparing current contract price to updated cost guidance...',
      '4 contracts now priced below updated cost floor...',
      'Assessing renegotiation urgency by volume and margin...',
      'Escalation priority assigned: 2 high, 2 medium.',
      'Contract risk report prepared.',
    ],
    intermediate:
      'Early flag: at least 4 contracts appear to be below the updated cost floor — volume-weighted impact being calculated',
    finding: {
      severity: 'escalate',
      text: '9 contracts renew within 90 days. 4 are now underwater relative to updated guidance. 2 require immediate procurement review; 2 can wait until next cycle.',
    },
  },
};

// Phase 4 — pre-scripted orchestrator convergence summary (FR-6).
export const ORCHESTRATOR_SUMMARY =
  'Soybean futures moved +8% this morning. The system assessed all 50 ingredient lines across four dimensions simultaneously. Thirty lines carry direct or indirect exposure. Twelve are protected by current inventory positions and need no action today. The remaining 18 cost-plus lines require updated cost guidance before the next pricing window opens. Four contracts are now priced below updated guidance and should reach procurement by end of week. No manual triage was needed. Total assessment time: 28 seconds.';

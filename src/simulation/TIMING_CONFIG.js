// =============================================================================
// TIMING_CONFIG.js — single source of truth for the demo's pacing.
//
// Every duration in the simulation is derived from the values below. To make
// the demo run faster or slower, edit ONLY this file (NFR-2, AC-12). Nothing
// in the component logic hardcodes timing.
//
// All values are in milliseconds.
//
// Quick presets (Bas):
//   • Board pace (default): ~33s total — values as below.
//   • Short pace (~20s): halve each agentCompletionTimes value and set
//     summaryWordDelay: 40. No other changes needed.
// =============================================================================

export const TIMING = {
  // Phase 1 — prompt appears character by character in the orchestrator.
  promptTypewriterDelay: 40, // ms per character

  // Phase 1 — agent cards light up one after another (staggered, not together).
  agentActivationStagger: 120, // ms between each agent activating

  // Phase 2 — baseline cadence for log lines. Each agent automatically
  // stretches its log feed to fill the window up to its completion time, using
  // this value as the reference rhythm.
  logLineInterval: 900, // ms between log line appearances

  // Phase 2 — how long after an agent starts before its intermediate
  // "the agent is thinking" finding appears (FR-4).
  intermediateDelay: 4500, // ms after an agent activates

  // Phase 2/3 — absolute time (from trigger) at which each agent locks its
  // key finding. Order and overlap are driven entirely by these four numbers
  // (AC-6: Exposure → Position → Cost Guidance → Contract, visibly overlapping).
  agentCompletionTimes: {
    exposure: 9000,
    position: 14000,
    costGuidance: 21000,
    contract: 27000,
  },

  // Phase 4 — pause after the last agent before the orchestrator summary types.
  convergenceDelay: 1500,

  // Phase 4 — orchestrator summary reveal speed.
  summaryWordDelay: 60, // ms per word

  // Phase 5 — pause after the summary finishes before the results table fades in.
  tableDelay: 500,
};
